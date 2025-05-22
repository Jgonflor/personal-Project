import {getDatabase} from './mongoDB.js'
import {ObjectId} from 'mongodb'

const getCollection = async () => (await getDatabase()).collection('journalEntries')


export async function addJournalEntry(journalEntry) {
  const collection = await getCollection()
  const { insertedId } = await collection.insertOne(journalEntry)
  return insertedId
}
