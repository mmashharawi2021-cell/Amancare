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

function showProductDetails(productId) {
  const product = appState.products.find((item) => item.id === productId);
  if (!product) return;

  const stock = product.inStock ? 'متوفر' : 'غير متوفر حالياً';
  const oldPrice = product.oldPrice ? `\nالسعر السابق: ${money(product.oldPrice)}` : '';
  alert(`${product.name}\n\n${product.desc}\n\nالحالة: ${stock}\nالسعر الحالي: ${money(product.price)}${oldPrice}`);
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
    const stockClass = product.inStock ? 'in-stock' : 'out-stock';
    const stockLabel = product.inStock ? 'متوفر' : 'غير متوفر';
    const oldPrice = product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : '';
    const revealButton = product.isSensitive
      ? `<button class="reveal-btn" onclick="revealProductTemporarily(${product.id})">عرض المنتج</button>`
      : '';
    const addButton = product.inStock
      ? `<button class="mini" onclick="addToCart(${product.id})">أضف</button>`
      : `<button class="mini disabled" disabled>غير متوفر</button>`;

    return `
      <article class="card product-card ${sensitiveClass}" data-product-id="${product.id}">
        <div class="thumb sensitive-image">
          <div class="card-badges">
            ${product.offer ? '<b class="offer">عرض</b>' : ''}
            <b class="stock-badge ${stockClass}">${stockLabel}</b>
          </div>
          <span>${product.icon || '💊'}</span>
        </div>
        <h3 class="sensitive-title sensitive-content">${product.name}</h3>
        <p class="desc sensitive-desc sensitive-content">${product.desc}</p>
        <div class="price product-price">
          <div class="price-stack">
            ${oldPrice}
            <b>${money(product.price)}</b>
          </div>
          ${addButton}
        </div>
        <button class="details-btn" onclick="showProductDetails(${product.id})">تفاصيل المنتج</button>
        ${revealButton}
      </article>
    `;
  }).join('');
}
