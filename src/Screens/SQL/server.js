// example of setting it up

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.post('/students', async (req, res) => {
  const { name, email, password_hash, student_type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Students (name, email, password_hash, student_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password_hash, student_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Students');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Students WHERE student_id = $1', [id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Students SET name = $1 WHERE student_id = $2 RETURNING *',
      [name, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Students WHERE student_id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});