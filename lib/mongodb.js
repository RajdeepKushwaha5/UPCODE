import mongoose from 'mongoose'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI or MONGO_URL environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose
let cachedClient = global.mongoClient

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

if (!cachedClient) {
  cachedClient = global.mongoClient = { client: null, db: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// MongoDB native client connection for API routes
export async function connectToDatabase() {
  if (cachedClient.client && cachedClient.db) {
    return {
      client: cachedClient.client,
      db: cachedClient.db
    }
  }

  if (!cachedClient.promise) {
    cachedClient.promise = MongoClient.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  }

  try {
    cachedClient.client = await cachedClient.promise
    cachedClient.db = cachedClient.client.db() // Use default database from URI
    
    return {
      client: cachedClient.client,
      db: cachedClient.db
    }
  } catch (e) {
    cachedClient.promise = null
    throw e
  }
}

export default connectDB
