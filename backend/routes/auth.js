const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../database/database');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required.' });
  const hash = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, email, password_hash) VALUES (?,?,?)`, [username, email, hash], function(err) {
    if (err) return res.status(400).json({ error: 'Username or email already exists.' });
    req.session.userId = this.lastID;
    res.json({ message: 'Registered successfully', userId: this.lastID });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials.' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
    req.session.userId = user.id;
    res.json({ message: 'Login successful', username: user.username });
  });
});

router.post('/logout', (req, res) => req.session.destroy(() => res.json({ message: 'Logged out' })));

router.get('/me', (req, res) => {
  if (!req.session || !req.session.userId) return res.json({ user: null });
  db.get(`SELECT id, username, email FROM users WHERE id = ?`, [req.session.userId], (err, user) => res.json({ user }));
});

module.exports = router;
