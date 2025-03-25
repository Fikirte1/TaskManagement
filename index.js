// app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js'; // Authentication routes
import tasksRoutes from './src/routes/tasksRoutes.js'; // Task routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Task Manager Backend is running!');
});

app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api', tasksRoutes); // Task routes with the '/api/v1' prefix

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
