(function(){
  function setLastUpdated(){
    var el = document.getElementById('last-updated');
    if (!el) return;
    var now = new Date();
    var opts = { year: 'numeric', month: 'short', day: 'numeric' };
    el.textContent = now.toLocaleDateString(undefined, opts);
  }

  function setupScrollAnimations(){
    var items = Array.prototype.slice.call(document.querySelectorAll('.animate-on-scroll'));
    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){ entry.target.classList.add('in-view'); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
      items.forEach(function(it){ io.observe(it); });
    } else {
      // Fallback
      items.forEach(function(it){ it.classList.add('in-view'); });
    }
  }

  function setupBackToTop(){
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    function toggle(){
      if (window.scrollY > 240){ btn.classList.add('show'); } else { btn.classList.remove('show'); }
    }
    window.addEventListener('scroll', toggle, { passive: true });
    btn.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
    toggle();
  }

  function highlightActiveNav(){
    var link = document.getElementById('nav-roadmap-link');
    if (link){ link.classList.add('active'); link.setAttribute('aria-current','page'); }
  }

  function enhanceTOC(){
    var toc = document.querySelector('.toc');
    if (!toc) return;
    // Smooth scroll for TOC links
    toc.addEventListener('click', function(e){
      var t = e.target;
      if (t.tagName === 'A' && t.getAttribute('href').startsWith('#')){
        e.preventDefault();
        var id = t.getAttribute('href').slice(1);
        var sec = document.getElementById(id);
        if (sec){
          var y = sec.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
          history.replaceState(null, '', '#'+id);
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    setLastUpdated();
    setupScrollAnimations();
    setupBackToTop();
    highlightActiveNav();
    enhanceTOC();
  });
})();


