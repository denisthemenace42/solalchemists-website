(function(){
  function setLastUpdated(){
    var el = document.getElementById('last-updated');
    if (!el) return;
    var now = new Date();
    var opts = { year: 'numeric', month: 'short', day: 'numeric' };
    el.textContent = now.toLocaleDateString(undefined, opts);
  }

  // thumbnails removed per request

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

  function setupTypewriter(){
    var el = document.querySelector('.hero-subtitle');
    if (!el) return;
    var text = el.textContent || '';
    var ch = Math.max(text.length, 1);
    el.style.setProperty('--tw-width', ch + 'ch');
    var durationMs = Math.min(Math.max(ch * 80, 600), 4000);
    el.style.animation = 'typewriterReveal ' + durationMs + 'ms steps(' + ch + ') forwards, typewriterCaret 900ms steps(1) infinite';
  }

  // TOC removed per design simplification

  document.addEventListener('DOMContentLoaded', function(){
    setLastUpdated();
    setupScrollAnimations();
    setupBackToTop();
    highlightActiveNav();
    setupTypewriter();
    // thumbnails removed per request
    // no TOC
  });
})();


