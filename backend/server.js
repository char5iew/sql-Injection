import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { and } from 'drizzle-orm';

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
  console.log("Endpoint hit");
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

// Protected login endpoint using Drizzle ORM (safe)
app.get('/api/protected-login', (req, res) => {
  const { username, password } = req.query;
  console.log('[PROTECTED LOGIN] username:', username, 'password:', password);
  try {
    const result = orm.select().from(usersTable)
      .where(
        and(
          usersTable.name.eq(username),
          usersTable.password.eq(password)
        )
      );
    console.log('[PROTECTED LOGIN] result:', result);
    if (result.length > 0) {
      res.json({ success: true, result });
    } else {
      res.json({ success: false, result: [] });
    }
  } catch (err) {
    console.error('[PROTECTED LOGIN] error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 