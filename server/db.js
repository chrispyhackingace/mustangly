import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g. postgres://user:pass@host:port/dbname
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Helper query function
export const query = (text, params) => pool.query(text, params);

// User-related queries:
export const findUserByEmail = async (email) => {
  const res = await query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

export const createUser = async ({ name, email, provider }) => {
  const res = await query(
    'INSERT INTO users (name, email, provider) VALUES ($1, $2, $3) RETURNING *',
    [name, email, provider]
  );
  return res.rows[0];
};
