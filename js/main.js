const PRIVACY_KEY = 'amancare_privacy_mode';
let revealTimer = null;

function readPrivacyMode() {
  const saved = localStorage.getItem(PRIVACY_KEY);
  return saved === null ? true : saved === 'true';
}

function savePrivacyMode(value) {
  localStorage.setItem(PRIVACY_KEY, String(value));
}

function loadStylesheet(path) {
  if (document.querySelector(`link[href="${path}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;
  document.head.appendChild(link);
}

function injectPrivacyControls() {
  const actions = document.querySelector('.actions');
  if (!actions || document.getElementById('privacyToggle')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'privacy-actions';
  wrapper.innerHTML = `
    <button id="privacyToggle" class="privacy-toggle" onclick="togglePrivacyMode()" aria-pressed="true">
      <span>🔒</span>
      <span id="privacyLabel">الخصوصية مفعّلة</span>
    </button>
    <button class="hide-now" onclick="hideNow()">إخفاء الآن</button>
  `;
  actions.prepend(wrapper);
}

function applyPrivacyMode() {
  document.body.classList.toggle('privacy-on', appState.privacyMode);
  document.body.classList.toggle('privacy-off', !appState.privacyMode);
  updatePrivacyButtons();
}

function updatePrivacyButtons() {
  const label = document.getElementById('privacyLabel');
  const toggle = document.getElementById('privacyToggle');
  if (!label || !toggle) return;
  label.textContent = appState.privacyMode ? 'الخصوصية مفعّلة' : 'الخصوصية معطّلة';
  toggle.setAttribute('aria-pressed', String(appState.privacyMode));
}

function togglePrivacyMode() {
  appState.privacyMode = !appState.privacyMode;
  savePrivacyMode(appState.privacyMode);
  applyPrivacyMode();
  renderProducts();
  showToast(appState.privacyMode ? 'تم تفعيل وضع الخصوصية' : 'تم تعطيل وضع الخصوصية');
}

function hideNow() {
  appState.privacyMode = true;
  savePrivacyMode(true);
  clearTemporaryReveal();
  applyPrivacyMode();
  renderProducts();
  showToast('تم إخفاء المنتجات الحساسة');
}

function revealProductTemporarily(productId) {
  const card = document.querySelector(`[data-product-id="${productId}"]`);
  if (!card) return;
  card.classList.add('temporary-reveal');
  clearTimeout(revealTimer);
  revealTimer = setTimeout(() => card.classList.remove('temporary-reveal'), 3500);
}

function clearTemporaryReveal() {
  clearTimeout(revealTimer);
  document.querySelectorAll('.temporary-reveal').forEach((card) => card.classList.remove('temporary-reveal'));
}

const appState = {
  products: readStorage(AMANCARE_CONFIG.storage.products, DEFAULT_PRODUCTS),
  cart: readStorage(AMANCARE_CONFIG.storage.cart, []),
  filter: 'all',
  search: '',
  privacyMode: readPrivacyMode()
};

function renderAll() {
  renderFilters();
  renderProducts();
  renderCart();
  applyPrivacyMode();
}

function bootApp() {
  const savedTheme = localStorage.getItem(AMANCARE_CONFIG.storage.theme) || AMANCARE_CONFIG.defaultTheme;
  setTheme(savedTheme);
  loadStylesheet('css/privacy.css');
  loadStylesheet('css/product-card.css');
  injectPrivacyControls();
  renderAll();
}

bootApp();
