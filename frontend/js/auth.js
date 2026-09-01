/* =====================================================
   FishBazar — Auth Helpers & Role Guards
   ===================================================== */

import { loginUser, registerUser } from './api.js';

const KEYS = {
  token: 'fb_token',
  user:  'fb_user',
};

/* ---- Store / Retrieve / Update ---- */
export function saveAuth(user) {
  localStorage.setItem(KEYS.token, user.token || 'mock-token-' + Date.now());
  localStorage.setItem(KEYS.user,  JSON.stringify(user));
}

export function updateUserProfile(updates) {
  const user = getUser();
  if (!user) return null;
  const updated = { ...user, ...updates };
  saveAuth(updated);
  window.dispatchEvent(new CustomEvent('auth-updated', { detail: updated }));
  updateNavbarAuth();
  return updated;
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

    // Avatar image or letter
    if (userAvatar) {
      if (user.avatar) {
        userAvatar.innerHTML = `<img src="${user.avatar}" alt="${user.name || 'User'}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`;
        userAvatar.style.background = 'transparent';
      } else {
        userAvatar.textContent = user.name?.charAt(0).toUpperCase() || 'U';
        userAvatar.style.background = '';
      }
    }

    if (userName) {
      userName.textContent = user.name?.split(' ')[0] || 'User';
    }
    
    let dashPath = `${root}customer/dashboard.html`;
    let profPath = `${root}customer/profile.html`;
    let profLabel = '👤 My Profile';

    if (user.role === 'admin') {
      dashPath = `${root}admin/dashboard.html`;
      profPath = `${root}admin/profile.html`;
      profLabel = '👤 Admin Profile';
    } else if (user.role === 'seller') {
      dashPath = `${root}seller/dashboard.html`;
      profPath = `${root}seller/profile.html`;
      profLabel = '🏪 Shop Profile';
    }

    if (dashLink) {
      dashLink.href = dashPath;
    }

    // Dynamic dropdown menu items
    const dropdownMenu = document.querySelector('#nav-user .nav-dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.innerHTML = `
        <a href="${profPath}" class="nav-dropdown-item"><strong>${profLabel}</strong></a>
        <a href="${dashPath}" class="nav-dropdown-item" id="nav-dashboard">📊 Dashboard</a>
        ${user.role === 'customer' ? `<a href="${root}customer/orders.html" class="nav-dropdown-item">📦 My Orders</a>` : ''}
        ${user.role === 'seller' ? `<a href="${root}seller/products.html" class="nav-dropdown-item">🐟 My Products</a>` : ''}
        ${user.role === 'admin' ? `<a href="${root}admin/sellers.html" class="nav-dropdown-item">🏪 Manage Sellers</a>` : ''}
        <div class="nav-dropdown-divider"></div>
        <span class="nav-dropdown-item danger" data-action="logout">🚪 Logout</span>
      `;
      dropdownMenu.querySelector('[data-action="logout"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }

    if (mobileMenu) {
      mobileMenu.innerHTML = `
        <a href="${root}index.html">🏠 Home</a>
        <a href="${root}shop.html">🐟 Shop</a>
        <a href="${profPath}">${profLabel} (${user.name?.split(' ')[0] || 'User'})</a>
        <a href="${dashPath}">📊 Dashboard</a>
        ${user.role === 'customer' ? `<a href="${root}customer/orders.html">📦 My Orders</a>` : ''}
        ${user.role === 'seller' ? `<a href="${root}seller/products.html">🐟 Products</a>` : ''}
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

