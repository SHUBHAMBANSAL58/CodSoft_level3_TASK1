require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 86400000 }
}));

// Serve frontend statically
app.use(express.static(path.join(__dirname, '../frontend')));

const { init: initDB } = require('./database/database');
initDB();

app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

app.listen(PORT, () => console.log(`🚀 Store running: http://localhost:${PORT}`));
