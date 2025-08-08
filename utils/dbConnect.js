import mongoose from 'mongoose';

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;
    
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    const db = await mongoose.connect(MONGODB_URI);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Unable to connect to MongoDB');
  }
}

export default dbConnect;
