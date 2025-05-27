import {getDatabase} from './mongoDB.js'

const getCollection = async () => (await getDatabase()).collection('journalEntries')


export async function addJournalEntry(journalEntry) {
  const collection = await getCollection()
  const { insertedId } = await collection.insertOne(journalEntry)
  return insertedId
}
export async function getJournalEntries() {
  const collection = await getCollection()
  const entries = await collection.find().toArray()
  return entries.map(entry => ({
    ...entry,
    _id: entry._id.toString() // Convert ObjectId to string for easier handling
  }))
}
