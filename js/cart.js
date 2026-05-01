function addToCart(productId) {
  const item = appState.cart.find((cartItem) => cartItem.id === productId);

  if (item) {
    item.qty += 1;
  } else {
    const product = appState.products.find((currentProduct) => currentProduct.id === productId);
    appState.cart.push({ ...product, qty: 1 });
  }

  writeStorage(AMANCARE_CONFIG.storage.cart, appState.cart);
  renderCart();
  showToast('تمت الإضافة إلى السلة');
}

function changeQty(productId, step) {
  const item = appState.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.qty += step;

  if (item.qty <= 0) {
    appState.cart = appState.cart.filter((cartItem) => cartItem.id !== productId);
  }

  writeStorage(AMANCARE_CONFIG.storage.cart, appState.cart);
  renderCart();
}

function renderCart() {
  const countElement = document.getElementById('cartCount');
  const totalElement = document.getElementById('cartTotal');
  const itemsElement = document.getElementById('cartItems');

  const count = appState.cart.reduce((sum, item) => sum + item.qty, 0);
  const total = appState.cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  countElement.textContent = count;
  totalElement.textContent = money(total);

  itemsElement.innerHTML = appState.cart.length
    ? appState.cart.map((item) => `
      <div class="cart-item">
        <div>
          <b>${item.name}</b><br>
          <small>${money(item.price)} × ${item.qty}</small>
        </div>
        <div class="qty">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <b>${item.qty}</b>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join('')
    : '<p class="desc">السلة فارغة.</p>';
}

function toggleCart(force) {
  document.getElementById('cartDrawer').classList.toggle('open', force);
}

function sendWhatsApp() {
  if (!appState.cart.length) {
    showToast('السلة فارغة');
    return;
  }

  const total = appState.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const lines = [
    'طلب جديد من AmanCare',
    '',
    ...appState.cart.map((item) => `- ${item.name} | الكمية: ${item.qty} | السعر: ${money(item.price * item.qty)}`),
    '',
    `الإجمالي: ${money(total)}`
  ];

  window.open(`https://wa.me/${AMANCARE_CONFIG.whatsappPhone}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
}
