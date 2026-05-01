function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem('amancare_theme', theme);
}

function toggleCart(force) {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.toggle('open', force);
}

function openAdmin() {
  const modal = document.getElementById('adminModal');
  if (modal) modal.classList.add('open');
}

function closeAdmin() {
  const modal = document.getElementById('adminModal');
  if (modal) modal.classList.remove('open');
}

setTheme(localStorage.getItem('amancare_theme') || 'blue');
