import express from 'express'
import { addJournalEntry,getJournalEntries,deleteJournalEntry } from '../models/journalEntry.js'

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
  const { userId } = req.query
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' })
  }
  try {
    const entries = await getJournalEntries(userId)
    res.status(200).json(entries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

router.delete('/:id', async (req, res) => {
  const { id }     = req.params
  const { userId } = req.query
  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' })
  }
  try {
    const result = await deleteJournalEntry(id,userId)
    if (result) {
      res.status(200).json({ success: true })
    } else {
      res.status(404).json({ success: false, error: 'Entry not found' })
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router