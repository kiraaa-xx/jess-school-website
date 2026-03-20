// public/js/main.js — JESS Public Site JavaScript
document.addEventListener('DOMContentLoaded', () => {

  // Splash screen
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => splash.classList.add('done'), 2400);
    setTimeout(() => splash.remove(), 3200);
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // Dark mode toggle (remembers preference)
  const themeBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  let dark = localStorage.getItem('theme') === 'dark';
  if (dark) {
    root.setAttribute('data-theme', 'dark');
    if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      dark = !dark;
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      themeBtn.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
  }

  // Hamburger mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target))
        mobileMenu.classList.remove('open');
    });
  }

  // Scroll-in animations (re-animates on scroll up too)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 400), { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

});

// Counter animation — called from home.ejs
function animateCount(el, target) {
  if (!el) return;
  let n = 0;
  const step = Math.ceil(target / 60);
  const t = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n.toLocaleString();
    if (n >= target) clearInterval(t);
  }, 25);
}

// Close mobile menu — called from nav links
function closeMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.remove('open');
}
