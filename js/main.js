const appState = {
  products: readStorage(AMANCARE_CONFIG.storage.products, DEFAULT_PRODUCTS),
  cart: readStorage(AMANCARE_CONFIG.storage.cart, []),
  filter: 'all'
};

function renderAll() {
  renderFilters();
  renderProducts();
  renderCart();
}

function bootApp() {
  const savedTheme = localStorage.getItem(AMANCARE_CONFIG.storage.theme) || AMANCARE_CONFIG.defaultTheme;
  setTheme(savedTheme);
  renderAll();
}

bootApp();
