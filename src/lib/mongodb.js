import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const globalForMongo = globalThis;

function createClient() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  return new MongoClient(uri, {
    maxPoolSize: 10,
  });
}

const client = globalForMongo._mongoClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}

export { client };

export function getDatabase() {
  // Must match the exact database name in MongoDB (case-sensitive on Atlas).
  const dbName = process.env.MONGODB_DB_NAME?.trim() || "StudyNook";
  return client.db(dbName);
}
