const { MongoClient } = require('mongodb');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://rsautomacao2000:%40Desbravadores%4093@sosdentecluster.zg8xrbc.mongodb.net/?retryWrites=true&w=majority&appName=SOSDenteCluster";

let db;

async function connectToMongoDB() {
  if (db) return db;
  
  try {
    console.log('🔍 Conectando ao MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('sosdente');
    console.log('✅ Conectado ao MongoDB Atlas');
    
    // Criar índices
    await db.collection('analytics_events').createIndex({ timestamp: -1 });
    await db.collection('analytics_events').createIndex({ sessionId: 1 });
    await db.collection('analytics_events').createIndex({ eventType: 1 });
    
    return db;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const database = await connectToMongoDB();

    if (req.method === 'POST') {
      // Salvar evento
      const event = req.body;
      
      if (!event.id || !event.timestamp || !event.eventType || !event.sessionId) {
        return res.status(400).json({ 
          error: 'Dados obrigatórios ausentes',
          required: ['id', 'timestamp', 'eventType', 'sessionId']
        });
      }

      event.receivedAt = new Date().toISOString();
      event.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      
      const result = await database.collection('analytics_events').insertOne(event);
      
      console.log(`📊 Evento salvo: ${event.eventType} - Session: ${event.sessionId}`);
      
      res.status(201).json({ 
        success: true, 
        id: result.insertedId,
        message: 'Evento salvo com sucesso'
      });

    } else if (req.method === 'GET') {
      // Buscar eventos
      const { 
        limit = 1000, 
        offset = 0, 
        eventType, 
        sessionId,
        startDate,
        endDate 
      } = req.query;

      const filter = {};
      
      if (eventType) filter.eventType = eventType;
      if (sessionId) filter.sessionId = sessionId;
      
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
      }

      const events = await database.collection('analytics_events')
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .toArray();

      console.log(`📊 Buscados ${events.length} eventos`);
      res.json(events);

    } else {
      res.status(405).json({ error: 'Método não permitido' });
    }

  } catch (error) {
    console.error('❌ Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
