import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { and, eq } from 'drizzle-orm';

// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'demo.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

// Seed data if table is empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
  const insert = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  insert.run('Intern5', 'jt@testmail.com', 'test123');
  insert.run('Kenji', 'kj@testmail.com', 'sushiRoll!2024');
  insert.run('Ze Xiang', 'zx@testmail.com', 'dragonFruit#88');
  insert.run('Nicholas', 'nc@testmail.com', 'astroN1nja!');
  insert.run('Ivan Cheah', 'ic@testmail.com', 'cheahPower$42');
  insert.run('Jeremy Ho', 'jh@testmail.com', 'hoDownTown!');
  insert.run('Kee Zher', 'kz@testmail.com', 'keeZher@moon');
  insert.run('Harry Po', 'hp@testmail.com', 'wizardHat777');
  insert.run('Wen Chin', 'wc@testmail.com', 'wenChinWind!');
  insert.run('Yik Soon', 'ys@testmail.com', 'soonShine!2024');
  insert.run('Zaid', 'z@testmail.com', 'zaidTheBrave!');
}

// Drizzle ORM setup
const drizzleDb = new Database(dbPath);
const orm = drizzle(drizzleDb);

// Drizzle users table schema
const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

// Route 1: Get all users
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// Route 2: Add a user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  try {
    const info = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(name, email);
    res.status(201).json({ id: info.lastInsertRowid, name, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vulnerable GET endpoint for unprotected login
app.get('/api/unprotected-login', (req, res) => {
  const { username, password } = req.query;
  // Vulnerable to SQL injection!
  const sql = `SELECT * FROM users WHERE name = '${username}' AND password = '${password}'`;
  console.log(`Executed Command: ${sql}`);
  try {
    const result = db.prepare(sql).all();
    if (result.length > 0) {
      res.json({ success: true, result });
    } else {
      res.json({ success: false, result: [] });
    }
  } catch (err) {
    res.status(400).json({ error: err.message, sql });
  }
});

// Protected login endpoint using Drizzle ORM
app.get('/api/protected-login', async (req, res) => {
  const { username, password } = req.query;
  console.log('Query Parameters: username:', username, 'password:', password);
  try {
    const result = await orm.select().from(usersTable)
      .where(
        and(
          eq(usersTable.name, username),
          eq(usersTable.password, password)
        )
      );
    console.log('Results: ', result);
    if (result.length > 0) {
      res.json({ success: true, result });
    } else {
      res.json({ success: false, result: [] });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// ProtectedLogin2: Like unprotected, but with blacklist-based input sanitization
app.get('/api/protected-login2', (req, res) => {
  // Ensure username and password are strings, trim and lowercase for comparison
  const username = (req.query.username || '').toString().trim().toLowerCase();
  const password = (req.query.password || '').toString().trim().toLowerCase();
  // List of generic SQL keywords/patterns to block
  const blacklist = [
    ' or ',
    ' and ',
    '=',
    '--',
    ';',
    '/*',
    '*/',
    ' drop ',
    ' select ',
    ' insert ',
    ' update ',
    ' delete ',
  ];
  // Check if username or password contains any blacklisted keyword
  const containsBlacklisted = (input) =>
    blacklist.some((pattern) => input.includes(pattern));

  if (containsBlacklisted(username) || containsBlacklisted(password)) {
    return res.status(400).json({
      error: 'Input contains potentially dangerous SQL keyword or pattern. Request rejected.'
    });
  }

  // Escape known SQL injection characters
  const escapeSql = (str) =>
    str
      .replace(/'/g, "''")
      .replace(/"/g, '\"')
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\;')
      .replace(/--/g, '')
      .replace(/\//g, '\/')
      .replace(/\*/g, '\*');

  const safeUsername = escapeSql(req.query.username || '');
  const safePassword = escapeSql(req.query.password || '');

  // Vulnerable SQL query (for demonstration)
  const sql = `SELECT * FROM users WHERE name = '${safeUsername}' AND password = '${safePassword}'`;
  console.log(`Executed Command: ${sql}`);
  try {
    const result = db.prepare(sql).all();
    if (result.length > 0) {
      res.json({ success: true, result });
    } else {
      res.json({ success: false, result: [] });
    }
  } catch (err) {
    res.status(400).json({ error: err.message, sql });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 