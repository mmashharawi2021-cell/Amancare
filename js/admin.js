function openAdmin() {
  document.getElementById('adminModal').classList.add('open');
}

function closeAdmin() {
  document.getElementById('adminModal').classList.remove('open');
}

function loginAdmin() {
  const password = document.getElementById('adminPassword').value;

  if (password !== AMANCARE_CONFIG.adminPassword) {
    showToast('كلمة المرور غير صحيحة');
    return;
  }

  document.getElementById('loginBox').classList.add('hide');
  document.getElementById('adminPanel').classList.remove('hide');
  renderAdmin();
  showToast('تم فتح لوحة الإدارة');
}

function saveProduct() {
  const product = {
    id: Date.now(),
    name: document.getElementById('pName').value.trim(),
    price: Number(document.getElementById('pPrice').value),
    category: document.getElementById('pCategory').value,
    categoryLabel: document.getElementById('pCategory').selectedOptions[0].textContent,
    icon: document.getElementById('pIcon').value.trim() || '💊',
    desc: document.getElementById('pDesc').value.trim() || 'منتج صيدلي موثوق.'
  };

  if (!product.name || !product.price) {
    showToast('أدخل اسم المنتج والسعر');
    return;
  }

  appState.products.unshift(product);
  writeStorage(AMANCARE_CONFIG.storage.products, appState.products);
  clearProductForm();
  renderAll();
  renderAdmin();
  showToast('تم حفظ المنتج');
}

function clearProductForm() {
  document.getElementById('pName').value = '';
  document.getElementById('pPrice').value = '';
  document.getElementById('pIcon').value = '';
  document.getElementById('pDesc').value = '';
}

function deleteProduct(productId) {
  appState.products = appState.products.filter((product) => product.id !== productId);
  appState.cart = appState.cart.filter((product) => product.id !== productId);
  writeStorage(AMANCARE_CONFIG.storage.products, appState.products);
  writeStorage(AMANCARE_CONFIG.storage.cart, appState.cart);
  renderAll();
  renderAdmin();
}

function resetProducts() {
  if (!confirm('استعادة المنتجات الافتراضية؟')) return;

  appState.products = [...DEFAULT_PRODUCTS];
  appState.cart = [];
  writeStorage(AMANCARE_CONFIG.storage.products, appState.products);
  writeStorage(AMANCARE_CONFIG.storage.cart, appState.cart);
  renderAll();
  renderAdmin();
  showToast('تمت استعادة المنتجات الافتراضية');
}

function renderAdmin() {
  const adminProductsElement = document.getElementById('adminProducts');

  adminProductsElement.innerHTML = appState.products.map((product) => `
    <div class="admin-product">
      <span>${product.icon} <b>${product.name}</b> — ${money(product.price)}</span>
      <button class="danger" onclick="deleteProduct(${product.id})">حذف</button>
    </div>
  `).join('');
}
