// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb"

let clientPromise;

// Allow the app to run without database for demo purposes
if (!process.env.MONGO_URL) {
  console.warn('Warning: MONGO_URL environment variable is not set. Database features will not work.')
  // Export a dummy promise that resolves to null
  clientPromise = Promise.resolve(null);
} else {
  const uri = process.env.MONGO_URL
  const options = {}

  let client;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise;