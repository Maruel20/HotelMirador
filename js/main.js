document.addEventListener('DOMContentLoaded', () => {
  // 1. Insertar NAV
  fetch('../nav.html').then(r => r.text()).then(html => {
    document.getElementById('include-nav').innerHTML = html;
    
    // Marcar link activo
    const path = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(a => {
      const href = a.getAttribute('href');
      if(href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  });

  // 2. Insertar FOOTER
  fetch('../footer.html').then(r => r.text()).then(html => {
    document.getElementById('include-footer').innerHTML = html;
    
    // IMPORTANTE: Inicializar el mapa del footer ahora que el HTML existe
    if (window.initFooterMap) {
        window.initFooterMap();
    }
  });

  // 3. Botón Scroll Top
  const btn = document.getElementById('btnScrollTop');
  if (btn) {
    window.addEventListener('scroll', () => {
      btn.style.display = window.scrollY > 400 ? 'block' : 'none';
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// Cambiar color navbar al hacer scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
});