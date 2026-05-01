const PRIVACY_KEY = 'amancare_privacy_mode';
const REVEAL_TIMEOUT_MS = 3500;
let revealTimer = null;

function readPrivacyMode() {
  const saved = localStorage.getItem(PRIVACY_KEY);
  return saved === null ? true : saved === 'true';
}

function savePrivacyMode(value) {
  localStorage.setItem(PRIVACY_KEY, String(value));
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
  revealTimer = setTimeout(() => {
    card.classList.remove('temporary-reveal');
  }, REVEAL_TIMEOUT_MS);
}

function clearTemporaryReveal() {
  clearTimeout(revealTimer);
  document.querySelectorAll('.temporary-reveal').forEach((card) => {
    card.classList.remove('temporary-reveal');
  });
}
