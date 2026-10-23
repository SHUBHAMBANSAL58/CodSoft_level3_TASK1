const API = '/api';
const CART_KEY = 'cart_items';

async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Server error');
  return data;
}

function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const el = document.getElementById('cart-count');
  if (el) el.textContent = cart.reduce((s, i) => s + i.quantity, 0);
}
function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.productId === id);
  if (item) item.quantity++;
  else cart.push({ productId: id, quantity: 1 });
  saveCart(cart);
  alert('Added to cart!');
}

async function checkAuth() {
  try {
    const { user } = await api('/auth/me');
    const link = document.getElementById('auth-link');
    if (!link) return;
    if (user) {
      link.textContent = `Logout (${user.username})`;
      link.href = '#';
      link.onclick = async () => { await api('/auth/logout', { method: 'POST' }); location.href = 'index.html'; };
    } else {
      link.textContent = 'Login';
      link.href = 'login.html';
    }
  } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  saveCart(getCart());
  checkAuth();
});
