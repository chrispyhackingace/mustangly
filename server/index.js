import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import googleRouter from './oauth/google.js';
import authRouter from './auth.js';

dotenv.config();

console.log('--- Dotenv Test ---');
console.log('TEST_VAR from .env:', process.env.TEST_VAR);
console.log('PORT:', process.env.PORT);
console.log('GOOGLE_CLIENT_ID (index.js check):', process.env.GOOGLE_CLIENT_ID);
console.log('--- End Dotenv Test ---');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/oauth', googleRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
