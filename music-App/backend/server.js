import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import journalRouter from './backend/routes/journal.js';
import { getDatabase } from './backend/models/mongoDB.js'; // ← path fixed

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/journal', journalRouter);

getDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
