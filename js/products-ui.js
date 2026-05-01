function getCategories() {
  const categories = appState.products.map((product) => ({
    key: product.category,
    label: product.categoryLabel
  }));

  const unique = [];
  const used = new Set();

  categories.forEach((category) => {
    if (!used.has(category.key)) {
      used.add(category.key);
      unique.push(category);
    }
  });

  return [{ key: 'all', label: 'الكل' }, ...unique];
}

function setFilter(category) {
  appState.filter = category;
  renderFilters();
  renderProducts();
}

function setSearch(value) {
  appState.search = value.trim().toLowerCase();
  renderProducts();
}

function renderFilters() {
  const filtersElement = document.getElementById('filters');

  filtersElement.innerHTML = getCategories().map((category) => {
    const activeClass = appState.filter === category.key ? 'active' : '';
    return `<button class="filter ${activeClass}" onclick="setFilter('${category.key}')">${category.label}</button>`;
  }).join('');
}

function getVisibleProducts() {
  return appState.products.filter((product) => {
    const matchesCategory = appState.filter === 'all' || product.category === appState.filter;
    const searchableText = `${product.name} ${product.desc} ${product.categoryLabel}`.toLowerCase();
    const matchesSearch = !appState.search || searchableText.includes(appState.search);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const gridElement = document.getElementById('productGrid');
  const visibleProducts = getVisibleProducts();

  if (!visibleProducts.length) {
    gridElement.innerHTML = '<div class="empty-products">لا توجد منتجات مطابقة للبحث الحالي.</div>';
    return;
  }

  gridElement.innerHTML = visibleProducts.map((product) => {
    const sensitiveClass = product.isSensitive ? 'is-sensitive' : '';
    const revealButton = product.isSensitive
      ? `<button class="reveal-btn" onclick="revealProductTemporarily(${product.id})">عرض المنتج</button>`
      : '';

    return `
      <article class="card ${sensitiveClass}" data-product-id="${product.id}">
        <div class="thumb sensitive-image">
          ${product.offer ? '<b class="offer">عرض</b>' : ''}
          <span>${product.icon || '💊'}</span>
        </div>
        <h3 class="sensitive-title sensitive-content">${product.name}</h3>
        <p class="desc sensitive-desc sensitive-content">${product.desc}</p>
        <div class="price">
          <b>${money(product.price)}</b>
          <button class="mini" onclick="addToCart(${product.id})">أضف</button>
        </div>
        ${revealButton}
      </article>
    `;
  }).join('');
}
