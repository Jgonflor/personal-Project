import {getDatabase} from './mongoDB.js'
import { ObjectId } from 'mongodb';

const getCollection = async () => (await getDatabase()).collection('journalEntries')


export async function addJournalEntry(journalEntry) {
  const collection = await getCollection()
  const { insertedId } = await collection.insertOne(journalEntry)
  return insertedId
}
export async function getJournalEntries(userId) {
  const collection = await getCollection()
  const entries = await collection.find({ userId }).toArray()
  return entries.map(entry => ({
    ...entry,
    _id: entry._id.toString() 
  }))
}

export async function deleteJournalEntry(id,userId) {
  const collection = await getCollection()
  const _id = new ObjectId(id) // Convert string ID to ObjectId
  const result = await collection.deleteOne({ _id , userId })
  return result.deletedCount > 0 
}
