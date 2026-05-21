import { MongoClient } from "mongodb";
import { getMongoDbName } from "@/lib/app-env";

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
  // Same database as Express (studynook-server): rooms, bookings, Better Auth `user`, etc.
  return client.db(getMongoDbName());
}
