import express from 'express'
import { addJournalEntry,getJournalEntries } from '../models/journalEntry.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const entry = req.body
    const insertedId = await addJournalEntry(entry)
    res.status(201).json({ insertedId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const entries = await getJournalEntries()
    res.status(200).json(entries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

export default router