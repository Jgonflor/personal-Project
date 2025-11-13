import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import journalRouter from './routes/journal.js';
import { getDatabase } from './models/mongoDB.js'; 
console.log("cwd:", process.cwd());
import path from 'path';
console.log("Directory:", path.resolve());
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
