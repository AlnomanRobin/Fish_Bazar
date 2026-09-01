/* =====================================================
   FishBazar — Global Init, Navbar, Toast System
   ===================================================== */

import { updateNavbarAuth, logout } from './auth.js';
import { updateCartBadge } from './cart.js';
import { fetchSearchSuggestions } from './api.js';

/* =============================================
   TOAST SYSTEM
   ============================================= */
let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'success', title = '', duration = 3500) {
  const container = getToastContainer();
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const titles = { success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '✅'}</span>
    <div class="toast-content">
      <div class="toast-title">${title || titles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <span class="toast-close" aria-label="Close">✕</span>
  `;

  container.appendChild(toast);

  const close = () => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.toast-close').addEventListener('click', close);
  setTimeout(close, duration);
}

/* =============================================
   NAVBAR
   ============================================= */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Hamburger
  const hamburger = document.getElementById('navbar-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Dropdown toggle on click (for mobile/touch & desktop)
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      if (e.target.closest('.nav-dropdown-item')) return;
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });
  });

  // Close dropdowns and mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.active').forEach(d => d.classList.remove('active'));
    }
    if (mobileMenu && hamburger && !e.target.closest('.navbar') && !e.target.closest('.mobile-menu')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  // Logout
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      logout();
    });
  });

  // Autocomplete for global search, hero search and shop search
  initSearchAutocomplete('#global-search');
  initSearchAutocomplete('#hero-search');
  initSearchAutocomplete('#shop-search');

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (hamburger)  hamburger.classList.remove('open');
    });
  });
}

/* =============================================
   SIDEBAR (Dashboard pages)
   ============================================= */
function initSidebar() {
  const sidebar   = document.getElementById('sidebar');
  const toggle    = document.getElementById('sidebar-toggle');
  const overlay   = document.getElementById('sidebar-overlay');
  if (!sidebar) return;

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Active nav link
  const currentPath = window.location.pathname;
  sidebar.querySelectorAll('.sidebar-nav-link').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href').split('/').pop().replace('.html',''))) {
      link.classList.add('active');
    }
  });
}

/* =============================================
   MODALS
   ============================================= */
export function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function initModals() {
  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Close buttons
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Open buttons
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
  });
}

/* =============================================
   NUMBER FORMATTERS
   ============================================= */
export function formatBDT(amount) {
  return '৳' + Number(amount).toLocaleString('en-BD');
}

export function formatKg(kg) {
  return Number(kg).toFixed(1) + ' kg';
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-BD', { day:'numeric', month:'short', year:'numeric' });
}

/* =============================================
   RENDER HELPERS
   ============================================= */
export function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export function renderProductCard(product) {
  const seller = product.seller || {};
  return `
    <div class="product-card animate-fade-in" data-id="${product.id}" data-slug="${product.slug}">
      <div class="product-card-img">
        <img src="${product.img}" alt="${product.name_en}" loading="lazy" onerror="this.src='https://placehold.co/400x300/0d4f5c/white?text=Fish'">
        <div class="product-card-badges">
          ${product.is_featured ? '<span class="badge badge-primary">Featured</span>' : ''}
          ${product.freshness_hours <= 12 ? '<span class="badge badge-success">Super Fresh</span>' : ''}
          ${product.stock_kg < 5 ? '<span class="badge badge-danger">Low Stock</span>' : ''}
        </div>
        <button class="product-card-wishlist" data-id="${product.id}" title="Wishlist">♡</button>
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${product.category?.name_en || ''}</span>
        <div class="product-card-name">
          ${product.name_en}
          <span class="name-bn">${product.name_bn}</span>
        </div>
        ${seller.shop_name ? `
        <div class="product-card-seller">
          <span class="product-card-seller-dot"></span>
          ${seller.shop_name}
        </div>` : ''}
        <div class="product-card-meta">
          <div class="product-card-price">
            <span class="currency">৳</span>${product.price_per_kg.toLocaleString()}
            <span class="per-kg">/kg</span>
          </div>
          <div class="product-card-rating">
            ★ ${product.rating}
          </div>
        </div>
        <button class="product-card-add-btn" onclick="event.stopPropagation();handleAddToCart(${product.id})">
          🛒 Add to Cart
        </button>
      </div>
    </div>
  `;
}

export function renderSkeleton(count = 8) {
  return Array(count).fill('').map(() =>
    `<div class="skeleton skeleton-card"></div>`
  ).join('');
}

/* =============================================
   GLOBAL EVENT HANDLERS
   ============================================= */
window.handleAddToCart = async function(productId) {
  // Dynamically import to avoid circular deps
  const { addToCart } = await import('./cart.js');
  const { fetchProduct } = await import('./api.js');
  const res = await fetchProduct(String(productId));
  if (res.ok && res.data) {
    addToCart(res.data, 1);
    showToast(`Added to cart!`, 'success', '🛒 Cart Updated');
    const btn = document.querySelector(`.product-card[data-id="${productId}"] .product-card-add-btn`);
    if (btn) {
      btn.classList.add('added');
      btn.textContent = '✓ Added';
      setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '🛒 Add to Cart'; }, 2000);
    }
  }
};

/* =============================================
   COUNTER ANIMATION
   ============================================= */
export function animateCount(el, target, duration = 1500) {
  const start    = performance.now();
  const isFloat  = target % 1 !== 0;
  const startVal = 0;

  function update(time) {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const val      = startVal + (target - startVal) * ease;
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
  }
  requestAnimationFrame(update);
}

/* =============================================
   INFINITE SCROLL / INTERSECTION OBSERVER
   ============================================= */
export function onVisible(el, callback, threshold = 0.15) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });
  observer.observe(el);
}

/* =============================================
   GLOBAL INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSidebar();
  initModals();
  updateNavbarAuth();
  updateCartBadge();

  // Animate elements on scroll
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    onVisible(el, target => {
      target.style.opacity = '1';
      target.style.animation = 'fadeInUp 0.5s ease forwards';
    });
  });
});

/* =============================================
   SEARCH AUTOCOMPLETE
   ============================================= */
function debounce(fn, wait = 180) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

function highlightMatch(text, query) {
  if (!text || !query) return escapeHtml(text || '');
  const rawText = String(text);
  const q = query.trim();
  if (!q) return escapeHtml(rawText);
  const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  try {
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return rawText.replace(regex, '<span class="search-suggestion-highlight">$1</span>');
  } catch(e) {
    return escapeHtml(rawText);
  }
}

function getAppRootPrefix() {
  const path = window.location.pathname;
  if (path.includes('/seller/') || path.includes('/customer/') || path.includes('/admin/')) {
    return '../';
  }
  return '';
}

function createSuggestionBox() {
  const box = document.createElement('div');
  box.className = 'search-suggestions hidden';
  document.body.appendChild(box);
  return box;
}

function positionBox(box, input) {
  const r = input.getBoundingClientRect();
  box.style.width = Math.max(300, r.width) + 'px';
  box.style.left = (window.scrollX + r.left) + 'px';
  box.style.top = (window.scrollY + r.bottom + 6) + 'px';
}

function initSearchAutocomplete(selector) {
  const input = document.querySelector(selector);
  if (!input) return;
  input.setAttribute('autocomplete', 'off');
  let box = createSuggestionBox();
  box.classList.add('hidden');
  let activeIdx = -1;
  let currentItems = [];

  const cache = initSearchAutocomplete._cache || (initSearchAutocomplete._cache = new Map());

  const render = (items, query = '') => {
    currentItems = items || [];
    activeIdx = -1;
    if (!items || items.length === 0) {
      if (query && query.trim().length > 0) {
        box.classList.remove('hidden');
        box.innerHTML = `
          <div class="search-suggestion-empty">
            <div style="font-size:1.6rem;margin-bottom:4px">🐟</div>
            <div>"<strong>${escapeHtml(query)}</strong>" নামের কোনো মাছ পাওয়া যায়নি</div>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px">অন্য কোনো মাছের নাম দিয়ে খুঁজুন</div>
          </div>
        `;
        return;
      }
      box.classList.add('hidden');
      box.innerHTML = '';
      return;
    }
    box.classList.remove('hidden');
    box.innerHTML = `
      <div class="search-suggestion-header">
        🐟 মাছের সাজেশন (Fish Suggestions)
      </div>
    ` + items.map((it, i) => `
      <div class="search-suggestion-item" data-idx="${i}" data-slug="${it.slug}">
        <img src="${it.img || 'https://placehold.co/80x60/0d4f5c/fff?text=Fish'}" alt="${escapeHtml(it.name_en)}" onerror="this.src='https://placehold.co/80x60/0d4f5c/fff?text=Fish'">
        <div class="search-suggestion-info">
          <div class="search-suggestion-title">
            <span>${highlightMatch(it.name_en, query)}</span>
            ${it.price ? `<span class="search-suggestion-price">৳${Number(it.price).toLocaleString()}/kg</span>` : ''}
          </div>
          <div class="search-suggestion-sub">
            <span class="name-bn">${highlightMatch(it.name_bn || '', query)}</span>
            ${it.category ? `<span class="search-suggestion-cat">${escapeHtml(it.category)}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  };

  const choose = (idx, navigate = true) => {
    if (idx < 0 || idx >= currentItems.length) return;
    const it = currentItems[idx];
    if (!it) return;
    input.value = it.name_en;
    if (navigate) {
      const prefix = getAppRootPrefix();
      window.location.href = `${prefix}product.html?slug=${encodeURIComponent(it.slug)}`;
    }
  };

  const performSearch = async (q) => {
    if (!q || !q.trim()) {
      render([]);
      return;
    }
    try {
      const key = q.toLowerCase();
      let items;
      if (cache.has(key)) items = cache.get(key);
      else {
        const res = await fetchSearchSuggestions(q, 8);
        items = (res && res.ok) ? (res.data || res) : (res || []);
        cache.set(key, items);
      }
      render(items, q);
    } catch (err) {
      render([], q);
    }
    positionBox(box, input);
  };

  input.addEventListener('input', debounce((e) => {
    performSearch(e.target.value);
  }, 180));

  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      performSearch(input.value);
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      if (box.classList.contains('hidden')) return;
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, currentItems.length - 1);
      updateActive();
    } else if (e.key === 'ArrowUp') {
      if (box.classList.contains('hidden')) return;
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      updateActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0) {
        choose(activeIdx);
        return;
      }
      const q = input.value.trim();
      if (!q) return;
      (async () => {
        try {
          const res = await fetchSearchSuggestions(q, 8);
          const items = (res && res.ok) ? (res.data || res) : (res || []);
          const exact = items.find(it => 
            (it.name_en && it.name_en.toLowerCase() === q.toLowerCase()) || 
            (it.name_bn && it.name_bn.toLowerCase() === q.toLowerCase())
          );
          const prefix = getAppRootPrefix();
          if (exact) {
            input.value = exact.name_en;
            window.location.href = `${prefix}product.html?slug=${encodeURIComponent(exact.slug)}`;
            return;
          }
          if (input.id === 'shop-search' && typeof applyFilters === 'function') {
            applyFilters();
            box.classList.add('hidden');
            return;
          }
          window.location.href = `${prefix}shop.html?search=${encodeURIComponent(q)}`;
        } catch (err) {
          const prefix = getAppRootPrefix();
          if (input.id === 'shop-search' && typeof applyFilters === 'function') applyFilters();
          else window.location.href = `${prefix}shop.html?search=${encodeURIComponent(input.value.trim())}`;
        }
      })();
    } else if (e.key === 'Escape') {
      box.classList.add('hidden');
    }
  });

  function updateActive() {
    box.querySelectorAll('.search-suggestion-item').forEach((el, i) => {
      el.classList.toggle('active', i === activeIdx);
    });
    const el = box.querySelector(`.search-suggestion-item[data-idx="${activeIdx}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  box.addEventListener('click', (e) => {
    const item = e.target.closest('.search-suggestion-item');
    if (!item) return;
    const idx = Number(item.dataset.idx);
    choose(idx);
  });

  // Close on outside click or blur
  document.addEventListener('click', (e) => {
    if (e.target === input || input.contains(e.target) || box.contains(e.target)) return;
    box.classList.add('hidden');
  });
  window.addEventListener('resize', () => positionBox(box, input));
  window.addEventListener('scroll', () => positionBox(box, input));
}
