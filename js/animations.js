function markRevealItems() {
  const staticItems = document.querySelectorAll('#products, #trust, #order, .trust-box, .cta, .product-toolbar');
  staticItems.forEach((item) => item.classList.add('reveal-item'));

  const cards = document.querySelectorAll('#productGrid .card');
  cards.forEach((card, index) => {
    card.classList.add('reveal-item');
    card.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
  });
}

function isAlreadyInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

function setupRevealObserver() {
  const items = document.querySelectorAll('.reveal-item:not(.is-visible)');

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -20px 0px'
  });

  items.forEach((item) => {
    if (isAlreadyInViewport(item)) {
      item.classList.add('is-visible');
      return;
    }
    observer.observe(item);
  });
}

function refreshAnimations() {
  markRevealItems();
  setupRevealObserver();
}

function patchProductRenderForAnimations() {
  if (window.__amancareAnimationsPatched || typeof window.renderProducts !== 'function') return;

  const originalRenderProducts = window.renderProducts;
  window.renderProducts = function patchedRenderProducts() {
    originalRenderProducts.apply(this, arguments);
    window.requestAnimationFrame(refreshAnimations);
  };

  window.__amancareAnimationsPatched = true;
}

function initAmanCareAnimations() {
  patchProductRenderForAnimations();
  refreshAnimations();
}

window.addEventListener('load', initAmanCareAnimations);
setTimeout(initAmanCareAnimations, 250);
