/* =====================================================
   FishBazar — Cart State Management
   ===================================================== */

const CART_KEY = 'fb_cart';

/* ---- Read / Write ---- */
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatchCartUpdate(cart);
}

function dispatchCartUpdate(cart) {
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
}

/* ---- Operations ---- */
export function addToCart(product, quantityKg = 1, cleaning = 'whole') {
  const cart = getCart();
  const key  = `${product.id}-${cleaning}`;
  const idx  = cart.findIndex(i => i.key === key);

  if (idx >= 0) {
    cart[idx].quantity_kg += quantityKg;
  } else {
    cart.push({
      key,
      product_id:   product.id,
      name_en:      product.name_en,
      name_bn:      product.name_bn,
      price_per_kg: product.price_per_kg,
      img:          product.img,
      cleaning,
      quantity_kg:  quantityKg,
      seller_id:    product.seller_id,
      seller_name:  product.seller?.shop_name || '',
    });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(key) {
  const cart = getCart().filter(i => i.key !== key);
  saveCart(cart);
  return cart;
}

export function updateQty(key, qty) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (item) {
    if (qty <= 0) return removeFromCart(key);
    item.quantity_kg = qty;
    saveCart(cart);
  }
  return cart;
}

export function clearCart() {
  saveCart([]);
}

/* ---- Totals ---- */
export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity_kg, 0);
}

export function getCartSubtotal() {
  return getCart().reduce((sum, i) => sum + i.price_per_kg * i.quantity_kg, 0);
}

export function getCartTotal(deliveryCharge = 0) {
  return getCartSubtotal() + deliveryCharge;
}

/* ---- Group by seller ---- */
export function getCartBySeller() {
  const cart = getCart();
  const groups = {};
  cart.forEach(item => {
    const sid = item.seller_id || 'unknown';
    if (!groups[sid]) groups[sid] = { seller_name: item.seller_name, items: [] };
    groups[sid].items.push(item);
  });
  return groups;
}

/* ---- Badge Update ---- */
export function updateCartBadge() {
  const count = getCart().length;
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  });
}

// Listen for updates globally
window.addEventListener('cart-updated', () => updateCartBadge());
