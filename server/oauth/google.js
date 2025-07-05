import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const router = express.Router();

// For simplicity, let's move JWT_SECRET access into generateToken for now
function generateToken(user) {
  // Make sure process.env.JWT_SECRET is actually available by this point (it will be, as index.js loads it)
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET, // Access directly
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Access directly
  );
}

router.post('/google', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing authorization code' });

  try {
    // Access variables directly inside the handler,
    // where you know dotenv.config() in index.js has already run.
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
    const JWT_SECRET_FOR_LOG = process.env.JWT_SECRET; // Just for logging if needed later

    // --- YOUR DEBUG LOGS (KEEP THESE FOR NOW) ---
    console.log('--- Google OAuth Debug (inside handler) ---');
    console.log('Code received:', code ? 'Yes' : 'No');
    console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? 'Exists' : 'MISSING');
    console.log('GOOGLE_REDIRECT_URI sent to Google:', GOOGLE_REDIRECT_URI);
    console.log('JWT_SECRET (inside handler):', JWT_SECRET_FOR_LOG ? 'Exists' : 'MISSING');
    console.log('--- End Google OAuth Debug (inside handler) ---');
    // --- END DEBUG LOGS ---

    // Exchange code for tokens - send params as URLSearchParams to comply with Google's API
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { sub: googleId, email, name, picture } = userInfoResponse.data;

    // Upsert user with provider='google'
    const upsertUserQuery = `
      INSERT INTO users (google_id, email, name, picture, provider)
      VALUES ($1, $2, $3, $4, 'google')
      ON CONFLICT (google_id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        picture = EXCLUDED.picture,
        provider = 'google'
      RETURNING id, google_id, email, name, picture;
    `;

    const result = await query(upsertUserQuery, [googleId, email, name, picture]);
    const user = result.rows[0];

    const token = generateToken(user); // generateToken will now access process.env.JWT_SECRET directly

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error('Google OAuth error (in handler catch):', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

export default router;