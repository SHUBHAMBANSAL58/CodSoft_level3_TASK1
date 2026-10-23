const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, 'ecommerce.db'));

function runMany(statements) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.exec('BEGIN TRANSACTION;');
      statements.forEach((sql) => db.run(sql, (err) => err && reject(err)));
      db.exec('COMMIT;', (err) => (err ? reject(err) : resolve()));
    });
  });
}

async function init() {
  await runMany([
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price_cents INTEGER NOT NULL,
      image_url TEXT,
      category TEXT,
      rating REAL DEFAULT 5.0,
      stock INTEGER DEFAULT 50
    );`,
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_cents INTEGER NOT NULL,
      shipping_address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price_cents INTEGER NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );`,
    `INSERT INTO products (name, description, price_cents, image_url, category, rating, stock)
     SELECT 'Classic Cotton T-Shirt', '100% organic cotton unisex tee.', 1999, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 'Apparel', 4.8, 50
     WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Classic Cotton T-Shirt');`,
    `INSERT INTO products (name, description, price_cents, image_url, category, rating, stock)
     SELECT 'Stainless Steel Flask', 'Vacuum insulated bottle keeps drinks cold 24h.', 2499, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 'Accessories', 4.7, 30
     WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Stainless Steel Flask');`,
    `INSERT INTO products (name, description, price_cents, image_url, category, rating, stock)
     SELECT 'Wireless ANC Headphones', 'Noise cancelling with 30h battery.', 8999, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Electronics', 4.9, 20
     WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wireless ANC Headphones');`,
    `INSERT INTO products (name, description, price_cents, image_url, category, rating, stock)
     SELECT 'Slim Leather Wallet', 'Genuine leather RFID blocking cardholder.', 2999, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', 'Accessories', 4.6, 40
     WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Slim Leather Wallet');`
  ]);
  console.log("✅ SQLite Database ready with sample products.");
}

module.exports = { db, init };
