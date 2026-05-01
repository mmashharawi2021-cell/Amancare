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

function renderFilters() {
  const filtersElement = document.getElementById('filters');

  filtersElement.innerHTML = getCategories().map((category) => {
    const activeClass = appState.filter === category.key ? 'active' : '';
    return `<button class="filter ${activeClass}" onclick="setFilter('${category.key}')">${category.label}</button>`;
  }).join('');
}

function renderProducts() {
  const gridElement = document.getElementById('productGrid');
  const visibleProducts = appState.filter === 'all'
    ? appState.products
    : appState.products.filter((product) => product.category === appState.filter);

  gridElement.innerHTML = visibleProducts.map((product) => `
    <article class="card">
      <div class="thumb">
        ${product.offer ? '<b class="offer">عرض</b>' : ''}
        <span>${product.icon || '💊'}</span>
      </div>
      <h3>${product.name}</h3>
      <p class="desc">${product.desc}</p>
      <div class="price">
        <b>${money(product.price)}</b>
        <button class="mini" onclick="addToCart(${product.id})">أضف</button>
      </div>
    </article>
  `).join('');
}
