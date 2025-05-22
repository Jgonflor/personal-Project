import express from 'express'
import { addJournalEntry } from '../models/journalEntry.js'

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

export default router