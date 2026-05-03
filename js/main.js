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

function loadScript(path) {
  if (document.querySelector(`script[src="${path}"]`)) return;
  const script = document.createElement('script');
  script.src = path;
  script.defer = true;
  document.body.appendChild(script);
}

function applyBrandCopy() {
  const brandText = document.querySelector('.brand span:last-child');
  const eyebrow = document.querySelector('.eyebrow');
  const heroTitle = document.querySelector('.hero h1');
  const heroLead = document.querySelector('.lead');
  const firstHeroButton = document.querySelector('.hero-actions .primary');
  const secondHeroButton = document.querySelector('.hero-actions .pill:not(.primary)');
  const sectionTitle = document.querySelector('#products .section-head h2');
  const sectionLead = document.querySelector('#products .section-head p');
  const footer = document.querySelector('footer');

  if (brandText) brandText.textContent = 'AmanCare';
  if (eyebrow) eyebrow.textContent = 'خصوصية. عناية. ثقة.';
  if (heroTitle) heroTitle.textContent = 'عناية شخصية بطلب خاص وآمن.';
  if (heroLead) heroLead.textContent = 'AmanCare تجربة هادئة لطلب منتجات العناية الشخصية بخصوصية عالية، عرض منظم، وسهولة تواصل مباشرة دون إحراج.';
  if (firstHeroButton) firstHeroButton.textContent = 'استعرض المنتجات';
  if (secondHeroButton) secondHeroButton.textContent = 'راجع السلة';
  if (sectionTitle) sectionTitle.textContent = 'منتجات مختارة بعناية';
  if (sectionLead) sectionLead.textContent = 'تصفح بهدوء، استخدم وضع الخصوصية عند الحاجة، وأرسل طلبك مباشرة بطريقة واضحة ومحترمة.';
  if (footer) footer.textContent = 'AmanCare / أمان كير © 2026 — عناية شخصية بتجربة أكثر خصوصية وراحة.';

  const trustTitles = document.querySelectorAll('.trust-box h3');
  const trustTexts = document.querySelectorAll('.trust-box p');

  if (trustTitles[0]) trustTitles[0].textContent = 'خصوصية افتراضية';
  if (trustTexts[0]) trustTexts[0].textContent = 'يمكنك تصفح المنتجات الحساسة بوضع خصوصية يخفي الصور والأسماء حتى تختار عرضها.';
  if (trustTitles[1]) trustTitles[1].textContent = 'تجربة راقية وهادئة';
  if (trustTexts[1]) trustTexts[1].textContent = 'ألوان دافئة وتفاصيل ناعمة تمنح الموقع طابعًا شخصيًا وآمنًا بدل الإحساس التجاري المباشر.';
  if (trustTitles[2]) trustTitles[2].textContent = 'تواصل مباشر';
  if (trustTexts[2]) trustTexts[2].textContent = 'أرسل طلبك أو استفسارك بسهولة عبر السلة أو المحادثة الداخلية داخل الموقع.';
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
  loadStylesheet('css/brand.css');
  loadStylesheet('css/privacy.css');
  loadStylesheet('css/product-card.css');
  loadStylesheet('css/product-modal.css');
  loadStylesheet('css/admin-upgrade.css');
  loadStylesheet('css/mobile-fixes.css');
  loadStylesheet('css/animations.css');
  loadStylesheet('css/chat-widget.css');
  applyBrandCopy();
  injectPrivacyControls();
  renderAll();
  loadScript('js/animations.js');
  loadScript('js/chat-widget.js');
}

bootApp();
