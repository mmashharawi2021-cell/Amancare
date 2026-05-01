function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    console.warn('Storage read failed:', key, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
  return Number(value || 0).toLocaleString('ar') + ' ' + AMANCARE_CONFIG.currency;
}

function showToast(message) {
  const element = document.getElementById('toast');
  if (!element) return;

  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2200);
}

function setTheme(themeName) {
  document.body.dataset.theme = themeName;
  localStorage.setItem(AMANCARE_CONFIG.storage.theme, themeName);
}
