import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const router = express.Router();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN = '7d',
} = process.env;

function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

router.post('/', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing authorization code' });

  try {
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

    const token = generateToken(user);

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
    console.error('Google OAuth error:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

export default router;
