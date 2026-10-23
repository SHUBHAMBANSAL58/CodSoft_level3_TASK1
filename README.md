# CodeAlpha_Ecommerce_Store
A full-stack e-commerce store built with HTML, CSS, JavaScript, Node.js, and Express.js.
# Simple E‑commerce Store
> Beginner‑friendly full‑stack project for the **CodeAlpha Full Stack Development Internship**

## 🎯 Project Overview
A small online shop that lets users browse products, add them to a cart, register/login, and place simulated orders.  
Tech stack: **HTML / CSS / JavaScript**, **Node.js + Express**, **SQLite**.

## 📦 Features
- Responsive home page with product grid
- Product detail view
- Search & category filter
- Shopping cart (stored locally, persisted across sessions)
- User registration & login (hashed passwords, session‑based auth)
- Order placement & order‑history page
- REST API with proper validation & parameterised SQL
- Sample data (3 products) loaded automatically

## 🛠️ Technologies
| Layer | Tech |
|------|------|
| Front‑end | HTML5, CSS3, vanilla JavaScript (`fetch` API) |
| Back‑end | Node.js, Express.js |
| Database | SQLite (via `sqlite3` npm package) |
| Auth | `express-session`, `bcryptjs` |
| Dev tools | VS Code, npm, nodemon |

## 📂 Project Structure
ecommerce-store/ │ server.js │ package.json │ .env │ ├─ database/ │ └─ database.js ├─ middleware/ │ └─ authMiddleware.js ├─ routes/ │ ├─ products.js │ ├─ auth.js │ └─ orders.js └─ public/ ├─ index.html ├─ product.html ├─ cart.html ├─ login.html ├─ register.html ├─ checkout.html ├─ orders.html ├─ css/ │ └─ style.css └─ js/ ├─ app.js ├─ product.js ├─ cart.js ├─ auth.js ├─ checkout.js └─ orders.j
