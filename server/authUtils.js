import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // Make sure you have this in your .env file!

// Function to generate a JWT
export const generateToken = (user) => {
  // You might want to include more user info here, but keep it minimal for token size
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' }); // Token valid for 7 days
};

// Middleware to authenticate a JWT
export const authenticateToken = (req, res, next) => {
  // Assuming the token is stored in a cookie named 'token'
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required: No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Token is invalid or expired
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: 'Authentication failed: Invalid token' });
    }
    req.user = user; // Attach the decoded user payload to the request object
    next(); // Proceed to the next middleware/route handler
  });
};