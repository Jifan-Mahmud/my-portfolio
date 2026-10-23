const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "portfolio_db";

if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbInstance = null;

async function connectDB() {
  if (dbInstance) {
    return dbInstance;
  }
  try {
    await client.connect();
    dbInstance = client.db(dbName);
    console.log(`✅ Successfully connected to MongoDB database: ${dbName}`);
    return dbInstance;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

function getDB() {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return dbInstance;
}

module.exports = {
  client,
  connectDB,
  getDB,
};
