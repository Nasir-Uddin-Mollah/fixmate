import "server-only";
import { MongoClient, ObjectId } from "mongodb";

let client;
let dbPromise;

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing");
  if (!client) client = new MongoClient(uri);
  if (!dbPromise) dbPromise = client.connect().then((c) => c.db("fixmate"));
  return dbPromise;
}

export { ObjectId };
