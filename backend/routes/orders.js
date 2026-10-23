const express = require('express');
const { db } = require('../database/database');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', ensureAuthenticated, (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items || !items.length || !shippingAddress) return res.status(400).json({ error: 'Invalid order data.' });

  const ids = items.map(i => i.productId);
  db.all(`SELECT id, price_cents FROM products WHERE id IN (${ids.map(()=>'?').join(',')})`, ids, (err, rows) => {
    const map = {};
    rows.forEach(r => map[r.id] = r.price_cents);
    let total = items.reduce((sum, i) => sum + (map[i.productId] || 0) * i.quantity, 0);

    db.run(`INSERT INTO orders (user_id, total_cents, shipping_address) VALUES (?,?,?)`,
      [req.userId, total, shippingAddress], function(err) {
        const orderId = this.lastID;
        const stmt = db.prepare(`INSERT INTO order_items (order_id, product_id, quantity, price_cents) VALUES (?,?,?,?)`);
        items.forEach(i => stmt.run(orderId, i.productId, i.quantity, map[i.productId]));
        stmt.finalize();
        res.json({ message: 'Order placed', orderId });
      });
  });
});

router.get('/my', ensureAuthenticated, (req, res) => {
  db.all(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, [req.userId], (err, orders) => {
    const getItems = (o) => new Promise((resolve) => {
      db.all(`SELECT oi.*, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`, [o.id], (e, it) => {
        o.items = it || [];
        resolve();
      });
    });
    Promise.all((orders || []).map(getItems)).then(() => res.json(orders));
  });
});

module.exports = router;
