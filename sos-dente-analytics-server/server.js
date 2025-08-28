const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { MongoClient } = require('mongodb');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Debug: verificar se as variáveis de ambiente estão carregadas
console.log('🔍 Debug - Variáveis de ambiente:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Definida' : 'NÃO DEFINIDA');

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'https://sos-dente.com', 'https://www.sos-dente.com'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://rsautomacao2000:%40Desbravadores%4093@sosdentecluster.zg8xrbc.mongodb.net/?retryWrites=true&w=majority&appName=SOSDenteCluster";

async function connectToMongoDB() {
  try {
    console.log('🔍 Tentando conectar ao MongoDB com URI:', MONGODB_URI ? 'Definida' : 'NÃO DEFINIDA');
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI não está definida no arquivo .env');
    }
    
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: db ? 'connected' : 'disconnected'
  });
});

// API Routes
app.post('/api/analytics/events', async (req, res) => {
  try {
    const event = req.body;
    
    // Validar dados obrigatórios
    if (!event.id || !event.timestamp || !event.eventType || !event.sessionId) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios ausentes',
        required: ['id', 'timestamp', 'eventType', 'sessionId']
      });
    }

    // Adicionar timestamp de recebimento
    event.receivedAt = new Date().toISOString();
    event.ipAddress = req.ip || req.connection.remoteAddress;
    
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

app.get('/api/analytics/events', async (req, res) => {
  try {
    const { 
      limit = 1000, 
      offset = 0, 
      eventType, 
      sessionId,
      startDate,
      endDate 
    } = req.query;

    // Construir filtro
    const filter = {};
    
    if (eventType) {
      filter.eventType = eventType;
    }
    
    if (sessionId) {
      filter.sessionId = sessionId;
    }
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Buscar eventos
    const events = await db.collection('analytics_events')
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
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
app.get('/api/analytics/stats', async (req, res) => {
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
app.delete('/api/analytics/cleanup', async (req, res) => {
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
