const express = require('express');
const { db } = require('../database/database');
const router = express.Router();

router.get('/', (req, res) => {
  const { search, category } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  if (search) { sql += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  db.all(sql, params, (err, rows) => res.json(rows || []));
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});

module.exports = router;
