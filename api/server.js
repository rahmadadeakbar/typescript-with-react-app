require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

let pool;
async function initDb() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const dbName = process.env.DB_NAME || 'crud_app';

  // Ensure database exists: create a temporary connection without database
  const tempPool = mysql.createPool({ host, port, user, password, waitForConnections: true, connectionLimit: 1 });
  await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
  await tempPool.end();

  // Now create pool connected to the database
  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // create table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      nim VARCHAR(100) DEFAULT NULL,
      major VARCHAR(255) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

app.get('/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, nim, major FROM students ORDER BY id');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/students', async (req, res) => {
  const { name, nim, major } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
  try {
    const [result] = await pool.query('INSERT INTO students (name, nim, major) VALUES (?, ?, ?)', [name.trim(), nim || null, major || null]);
    const id = result.insertId;
    const [rows] = await pool.query('SELECT id, name, nim, major FROM students WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

app.put('/students/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, nim, major } = req.body;
  try {
    await pool.query('UPDATE students SET name = ?, nim = ?, major = ? WHERE id = ?', [name, nim || null, major || null, id]);
    const [rows] = await pool.query('SELECT id, name, nim, major FROM students WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

app.delete('/students/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await pool.query('DELETE FROM students WHERE id = ?', [id]);
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to initialize DB', err);
    process.exit(1);
  });
