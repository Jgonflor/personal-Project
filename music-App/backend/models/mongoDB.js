import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config(); 

let client;

async function getMongoClient() {
  if (!client) {
    const uri = process.env.MONGO_URI;
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

export async function getDatabase() {
  return (await getMongoClient()).db('music-journal');
}
