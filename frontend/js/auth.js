/* =====================================================
   FishBazar — Auth Helpers & Role Guards
   ===================================================== */

import { loginUser, registerUser } from './api.js';

const KEYS = {
  token: 'fb_token',
  user:  'fb_user',
};

/* ---- Store / Retrieve ---- */
export function saveAuth(user) {
  localStorage.setItem(KEYS.token, user.token);
  localStorage.setItem(KEYS.user,  JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(KEYS.token);
  localStorage.removeItem(KEYS.user);
}

export function getToken() {
  return localStorage.getItem(KEYS.token);
}

export function getUser() {
  const u = localStorage.getItem(KEYS.user);
  return u ? JSON.parse(u) : null;
}

export function isLoggedIn() {
  return !!getToken();
}

export function getRole() {
  const u = getUser();
  return u?.role || null;
}

/* ---- Auth Actions ---- */
export async function login(phone, password) {
  const res = await loginUser(phone, password);
  if (res.ok) {
    saveAuth(res.data);
    return { success: true, user: res.data };
  }
  return { success: false, error: res.data?.detail || 'Invalid credentials' };
}

export async function register(data) {
  const res = await registerUser(data);
  if (res.ok) {
    saveAuth(res.data);
    return { success: true, user: res.data };
  }
  return { success: false, error: res.data?.detail || 'Registration failed' };
}

/* ---- Dynamic Path Helper ---- */
function getAppRoot() {
  const p = window.location.pathname;
  const idx = p.indexOf('/frontend/');
  if (idx !== -1) {
    return p.substring(0, idx) + '/frontend/';
  }
  return '/';
}

export function logout() {
  clearAuth();
  window.location.href = `${getAppRoot()}login.html`;
}

/* ---- Route Guards ---- */
export function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = `${getAppRoot()}login.html?next=${encodeURIComponent(window.location.pathname)}`;
    return false;
  }
  return true;
}

export function requireRole(role) {
  if (!requireLogin()) return false;
  const userRole = getRole();
  if (userRole !== role) {
    // Redirect to appropriate dashboard
    redirectToDashboard();
    return false;
  }
  return true;
}

export function redirectToDashboard() {
  const role = getRole();
  const root = getAppRoot();
  if (role === 'admin')        window.location.href = `${root}admin/dashboard.html`;
  else if (role === 'seller')  window.location.href = `${root}seller/dashboard.html`;
  else                         window.location.href = `${root}customer/dashboard.html`;
}

/* ---- Navbar UI update ---- */
export function updateNavbarAuth() {
  const user = getUser();
  const guestNav  = document.getElementById('nav-guest');
  const userNav   = document.getElementById('nav-user');
  const userAvatar= document.getElementById('nav-avatar');
  const userName  = document.getElementById('nav-username');
  const dashLink  = document.getElementById('nav-dashboard');
  const mobileMenu= document.getElementById('mobile-menu');
  const root      = getAppRoot();

  if (user) {
    if (guestNav)  guestNav.classList.add('hidden');
    if (userNav)   userNav.classList.remove('hidden');
    if (userAvatar) userAvatar.textContent = user.name?.charAt(0).toUpperCase() || 'U';
    if (userName)   userName.textContent = user.name?.split(' ')[0] || 'User';
    
    let dashPath = `${root}customer/dashboard.html`;
    if (user.role === 'admin') dashPath = `${root}admin/dashboard.html`;
    else if (user.role === 'seller') dashPath = `${root}seller/dashboard.html`;

    if (dashLink) {
      dashLink.href = dashPath;
    }

    if (mobileMenu) {
      mobileMenu.innerHTML = `
        <a href="${root}index.html">🏠 Home</a>
        <a href="${root}shop.html">🐟 Shop</a>
        <a href="${dashPath}">📊 Dashboard (${user.name?.split(' ')[0] || 'User'})</a>
        <a href="${root}customer/orders.html">📦 My Orders</a>
        <a href="${root}cart.html">🛒 Cart</a>
        <a href="#" data-action="logout" style="color:var(--danger)">🚪 Logout</a>
      `;
      mobileMenu.querySelector('[data-action="logout"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    if (guestNav) guestNav.classList.remove('hidden');
    if (userNav)  userNav.classList.add('hidden');
    if (mobileMenu) {
      mobileMenu.innerHTML = `
        <a href="${root}index.html">🏠 Home</a>
        <a href="${root}shop.html">🐟 Shop</a>
        <a href="${root}login.html">🔑 Login / Register</a>
        <a href="${root}cart.html">🛒 Cart</a>
      `;
    }
  }
}

