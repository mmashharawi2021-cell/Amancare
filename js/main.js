function loadPrivacyStyles() {
  if (document.querySelector('link[href="css/privacy.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'css/privacy.css';
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
  loadPrivacyStyles();
  injectPrivacyControls();
  renderAll();
}

bootApp();
