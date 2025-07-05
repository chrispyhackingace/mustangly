import express from 'express';
import bcrypt from 'bcrypt';
import { query, findUserByEmail, createUser } from './db.js'; // Adjust path to db.js if necessary
// Now, import from your new utility file:
import { generateToken, authenticateToken } from './authUtils.js'; // Adjust path as per your new file location

const router = express.Router();

// Email/password login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await findUserByEmail(email);
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' });

    // Check password hash
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = generateToken(user);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Email/password signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password required' });

  try {
    const existing = await findUserByEmail(email);
    if (existing)
      return res.status(409).json({ error: 'Email already in use' });

    const password_hash = await bcrypt.hash(password, 10);
    const newUserRes = await query(
      'INSERT INTO users (name, email, password_hash, provider) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password_hash, 'email']
    );
    const newUser = newUserRes.rows[0];

    const token = generateToken(newUser);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
});

export default router; // This correctly exports the router