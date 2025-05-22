import express from 'express'
import cors from 'cors'
import journalRouter from './routes/journal.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/journal', journalRouter)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})