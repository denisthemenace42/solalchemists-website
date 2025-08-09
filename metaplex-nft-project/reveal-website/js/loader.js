(function () {
  // Ensure the overlay is present early
  function ensureLoader() {
    var existing = document.getElementById('page-loader');
    if (existing) return existing;

    var loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.className = 'page-loader';
    loader.setAttribute('aria-live', 'polite');
    loader.setAttribute('aria-label', 'Page loading');

    loader.innerHTML = '<div class="loader" aria-hidden="true"></div>' +
      '<div class="loader-text">Loading...</div>';

    // Insert as the first child of body
    if (document.body.firstChild) {
      document.body.insertBefore(loader, document.body.firstChild);
    } else {
      document.body.appendChild(loader);
    }
    return loader;
  }

  function hideLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.add('fade-out');
    // Remove from DOM after fade
    setTimeout(function () {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 450);
  }

  // Show as soon as DOM is parsed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureLoader);
  } else {
    ensureLoader();
  }

  // Hide when all assets are loaded
  window.addEventListener('load', hideLoader);

  // Failsafe: hide after 10s to avoid being stuck
  setTimeout(hideLoader, 10000);
})();


