let editingProductId = null;

function openAdmin() {
  document.getElementById('adminModal').classList.add('open');
  patchAdminAccessCopy();
  enhanceAdminPanel();
}

function closeAdmin() {
  document.getElementById('adminModal').classList.remove('open');
}

function patchAdminAccessCopy() {
  const note = document.querySelector('#loginBox .login-note');
  const label = document.querySelector('label[for="adminPassword"]');
  const input = document.getElementById('adminPassword');
  const title = document.querySelector('#adminModal .drawer-head h2');

  if (title) title.textContent = 'لوحة إدارة AmanCare';
  if (note) note.textContent = 'أدخل رمز PIN للدخول إلى لوحة الإدارة.';
  if (label) label.textContent = 'رمز PIN';
  if (input) {
    input.placeholder = 'أدخل رمز PIN';
    input.inputMode = 'numeric';
    input.autocomplete = 'one-time-code';
  }
}

function loginAdmin() {
  patchAdminAccessCopy();
  const password = document.getElementById('adminPassword').value;

  if (password !== AMANCARE_CONFIG.adminPassword) {
    showToast('رمز PIN غير صحيح');
    return;
  }

  document.getElementById('loginBox').classList.add('hide');
  document.getElementById('adminPanel').classList.remove('hide');
  enhanceAdminPanel();
  renderAdmin();
  showToast('تم فتح لوحة الإدارة');
}

function enhanceAdminPanel() {
  patchAdminAccessCopy();
  const grid = document.querySelector('#adminPanel .admin-grid');
  if (!grid || document.getElementById('pOldPrice')) return;

  grid.insertAdjacentHTML('beforeend', `
    <div class="field">
      <label for="pOldPrice">السعر السابق</label>
      <input id="pOldPrice" type="number" placeholder="اختياري" />
    </div>
    <div class="field">
      <label for="pInStock">حالة التوفر</label>
      <select id="pInStock">
        <option value="true">متوفر</option>
        <option value="false">غير متوفر</option>
      </select>
    </div>
    <div class="field">
      <label for="pOffer">حالة العرض</label>
      <select id="pOffer">
        <option value="false">بدون عرض</option>
        <option value="true">عرض خاص</option>
      </select>
    </div>
    <div class="field">
      <label for="pSensitive">خصوصية المنتج</label>
      <select id="pSensitive">
        <option value="false">منتج عادي</option>
        <option value="true">منتج حساس</option>
      </select>
    </div>
  `);

  const primaryButton = document.querySelector('#adminPanel .pill.primary');
  if (primaryButton) primaryButton.id = 'saveProductButton';
}

function getProductFormData() {
  const category = document.getElementById('pCategory');
  const oldPriceValue = Number(document.getElementById('pOldPrice')?.value || 0);

  return {
    id: editingProductId || Date.now(),
    name: document.getElementById('pName').value.trim(),
    price: Number(document.getElementById('pPrice').value),
    oldPrice: oldPriceValue > 0 ? oldPriceValue : null,
    inStock: document.getElementById('pInStock')?.value !== 'false',
    offer: document.getElementById('pOffer')?.value === 'true',
    isSensitive: document.getElementById('pSensitive')?.value === 'true',
    category: category.value,
    categoryLabel: category.selectedOptions[0].textContent,
    icon: document.getElementById('pIcon').value.trim() || '💊',
    desc: document.getElementById('pDesc').value.trim() || 'منتج من AmanCare.'
  };
}

function saveProduct() {
  enhanceAdminPanel();
  const product = getProductFormData();

  if (!product.name || !product.price) {
    showToast('أدخل اسم المنتج والسعر');
    return;
  }

  if (editingProductId) {
    appState.products = appState.products.map((item) => item.id === editingProductId ? product : item);
    showToast('تم تعديل المنتج');
  } else {
    appState.products.unshift(product);
    showToast('تم حفظ المنتج');
  }

  writeStorage(AMANCARE_CONFIG.storage.products, appState.products);
  cancelEditProduct();
  renderAll();
  renderAdmin();
}

function editProduct(productId) {
  enhanceAdminPanel();
  const product = appState.products.find((item) => item.id === productId);
  if (!product) return;

  editingProductId = product.id;
  document.getElementById('pName').value = product.name || '';
  document.getElementById('pPrice').value = product.price || '';
  document.getElementById('pOldPrice').value = product.oldPrice || '';
  document.getElementById('pCategory').value = product.category || 'care';
  document.getElementById('pIcon').value = product.icon || '';
  document.getElementById('pDesc').value = product.desc || '';
  document.getElementById('pInStock').value = product.inStock === false ? 'false' : 'true';
  document.getElementById('pOffer').value = product.offer ? 'true' : 'false';
  document.getElementById('pSensitive').value = product.isSensitive ? 'true' : 'false';

  const button = document.getElementById('saveProductButton');
  if (button) button.textContent = 'حفظ التعديل';
  showToast('وضع التعديل مفعّل');
}

function cancelEditProduct() {
  editingProductId = null;
  clearProductForm();
  const button = document.getElementById('saveProductButton');
  if (button) button.textContent = 'إضافة المنتج';
}

function clearProductForm() {
  document.getElementById('pName').value = '';
  document.getElementById('pPrice').value = '';
  document.getElementById('pIcon').value = '';
  document.getElementById('pDesc').value = '';
  if (document.getElementById('pOldPrice')) document.getElementById('pOldPrice').value = '';
  if (document.getElementById('pInStock')) document.getElementById('pInStock').value = 'true';
  if (document.getElementById('pOffer')) document.getElementById('pOffer').value = 'false';
  if (document.getElementById('pSensitive')) document.getElementById('pSensitive').value = 'false';
}

function deleteProduct(productId) {
  if (!confirm('هل تريد حذف هذا المنتج؟')) return;

  appState.products = appState.products.filter((product) => product.id !== productId);
  appState.cart = appState.cart.filter((product) => product.id !== productId);
  writeStorage(AMANCARE_CONFIG.storage.products, appState.products);
  writeStorage(AMANCARE_CONFIG.storage.cart, appState.cart);
  renderAll();
  renderAdmin();
  showToast('تم حذف المنتج');
}

function resetProducts() {
  if (!confirm('هل تريد استعادة المنتجات الافتراضية؟')) return;

  appState.products = [...DEFAULT_PRODUCTS];
  appState.cart = [];
  writeStorage(AMANCARE_CONFIG.storage.products, appState.products);
  writeStorage(AMANCARE_CONFIG.storage.cart, appState.cart);
  cancelEditProduct();
  renderAll();
  renderAdmin();
  showToast('تمت استعادة المنتجات الافتراضية');
}

function renderAdmin() {
  enhanceAdminPanel();
  const adminProductsElement = document.getElementById('adminProducts');

  adminProductsElement.innerHTML = appState.products.map((product) => {
    const stock = product.inStock === false ? 'غير متوفر' : 'متوفر';
    const sensitive = product.isSensitive ? 'حساس' : 'عادي';
    const offer = product.offer ? 'عرض' : 'بدون عرض';

    return `
      <div class="admin-product upgraded-admin-product">
        <span>${product.icon} <b>${product.name}</b> — ${money(product.price)}<br><small>${stock} / ${offer} / ${sensitive}</small></span>
        <div class="admin-actions">
          <button class="pill" onclick="editProduct(${product.id})">تعديل</button>
          <button class="danger" onclick="deleteProduct(${product.id})">حذف</button>
        </div>
      </div>
    `;
  }).join('');
}
