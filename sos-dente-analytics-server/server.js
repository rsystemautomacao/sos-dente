const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { MongoClient } = require('mongodb');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI não está definida. Crie o arquivo .env com base no .env.example');
  process.exit(1);
}

// Rate limiting
const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em 1 minuto.' }
});

const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em 1 minuto.' }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'https://sos-dente.com', 'https://www.sos-dente.com'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('sosdente');
    console.log('✅ Conectado ao MongoDB Atlas');
    
    // Criar índices para performance
    await db.collection('analytics_events').createIndex({ timestamp: -1 });
    await db.collection('analytics_events').createIndex({ sessionId: 1 });
    await db.collection('analytics_events').createIndex({ eventType: 1 });
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

// Tipos de evento válidos (espelho do frontend)
const VALID_EVENT_TYPES = new Set([
  'wizard_start', 'wizard_complete', 'wizard_step', 'page_view', 'button_click'
]);

// Remove chaves com $ para evitar injeção de operadores MongoDB
function sanitizeObject(obj, depth = 0) {
  if (depth > 5 || obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.slice(0, 50).map(v => sanitizeObject(v, depth + 1));
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([k]) => !k.startsWith('$'))
      .slice(0, 50)
      .map(([k, v]) => [k, sanitizeObject(v, depth + 1)])
  );
}

function validateEvent(event) {
  const errors = [];

  if (!event.id || typeof event.id !== 'string' || event.id.length > 64)
    errors.push('id inválido');
  if (!event.sessionId || typeof event.sessionId !== 'string' || event.sessionId.length > 64)
    errors.push('sessionId inválido');
  if (!event.timestamp || isNaN(Date.parse(event.timestamp)))
    errors.push('timestamp inválido');
  if (!VALID_EVENT_TYPES.has(event.eventType))
    errors.push(`eventType inválido (aceitos: ${[...VALID_EVENT_TYPES].join(', ')})`);
  if (event.userAgent && typeof event.userAgent !== 'string')
    errors.push('userAgent inválido');
  if (event.data !== undefined && (typeof event.data !== 'object' || Array.isArray(event.data)))
    errors.push('data deve ser um objeto');

  return errors;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: db ? 'connected' : 'disconnected'
  });
});

// API Routes
app.post('/api/analytics/events', writeLimiter, async (req, res) => {
  try {
    const raw = req.body;

    const errors = validateEvent(raw);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Dados inválidos', details: errors });
    }

    const event = {
      id: raw.id.trim(),
      sessionId: raw.sessionId.trim(),
      timestamp: new Date(raw.timestamp).toISOString(),
      eventType: raw.eventType,
      userAgent: typeof raw.userAgent === 'string' ? raw.userAgent.slice(0, 512) : '',
      data: raw.data ? sanitizeObject(raw.data) : {},
      receivedAt: new Date().toISOString(),
      ipAddress: req.ip || req.socket?.remoteAddress || '',
    };

    // Salvar no MongoDB
    const result = await db.collection('analytics_events').insertOne(event);
    
    console.log(`📊 Evento salvo: ${event.eventType} - Session: ${event.sessionId}`);
    
    res.status(201).json({ 
      success: true, 
      id: result.insertedId,
      message: 'Evento salvo com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao salvar evento:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

app.get('/api/analytics/events', readLimiter, async (req, res) => {
  try {
    const rawLimit  = parseInt(req.query.limit)  || 100;
    const rawOffset = parseInt(req.query.offset) || 0;
    const limit  = Math.min(Math.max(rawLimit,  1), 500);
    const offset = Math.max(rawOffset, 0);

    const { eventType, sessionId, startDate, endDate } = req.query;

    const filter = {};

    if (eventType) {
      if (!VALID_EVENT_TYPES.has(eventType)) {
        return res.status(400).json({ error: 'eventType inválido' });
      }
      filter.eventType = eventType;
    }

    if (sessionId) {
      if (typeof sessionId !== 'string' || sessionId.length > 64) {
        return res.status(400).json({ error: 'sessionId inválido' });
      }
      filter.sessionId = sessionId.trim();
    }

    if (startDate || endDate) {
      if ((startDate && isNaN(Date.parse(startDate))) || (endDate && isNaN(Date.parse(endDate)))) {
        return res.status(400).json({ error: 'Datas inválidas' });
      }
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate).toISOString();
      if (endDate)   filter.timestamp.$lte = new Date(endDate).toISOString();
    }

    // Buscar eventos
    const events = await db.collection('analytics_events')
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();

    console.log(`📊 Buscados ${events.length} eventos`);

    res.json(events);
    
  } catch (error) {
    console.error('❌ Erro ao buscar eventos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Estatísticas
app.get('/api/analytics/stats', readLimiter, async (req, res) => {
  try {
    const stats = await db.collection('analytics_events').aggregate([
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          uniqueSessions: { $addToSet: '$sessionId' },
          eventTypes: { $addToSet: '$eventType' }
        }
      },
      {
        $project: {
          totalEvents: 1,
          uniqueSessions: { $size: '$uniqueSessions' },
          eventTypes: 1
        }
      }
    ]).toArray();

    res.json(stats[0] || { totalEvents: 0, uniqueSessions: 0, eventTypes: [] });
    
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Limpar dados antigos (mais de 90 dias)
app.delete('/api/analytics/cleanup', writeLimiter, async (req, res) => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const result = await db.collection('analytics_events').deleteMany({
      timestamp: { $lt: ninetyDaysAgo.toISOString() }
    });
    
    console.log(`🧹 Limpos ${result.deletedCount} eventos antigos`);
    
    res.json({ 
      success: true, 
      deletedCount: result.deletedCount,
      message: 'Limpeza concluída'
    });
    
  } catch (error) {
    console.error('❌ Erro na limpeza:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Iniciar servidor
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor de Analytics rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 API: http://localhost:${PORT}/api/analytics/events`);
  });
}

startServer().catch(console.error);
