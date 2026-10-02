const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodora_db';
    console.log(`[DB] Connecting to MongoDB at ${connStr}...`);
    const conn = await mongoose.connect(connStr, { serverSelectionTimeoutMS: 3000 });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[DB] Standard MongoDB failed: ${error.message}`);
    console.log('[DB] Using MongoDB Memory Server fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[DB] In-Memory MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error(`[DB] Memory Server failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
