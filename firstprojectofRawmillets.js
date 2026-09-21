(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const navLinks = $$('.nav-item');
  const sections = $$('main section[id], footer[id]');
  const mobileMenu = $('.mobile-menu');
  const mobileNav = $('.mobile-nav');
  const subscribeForm = $('#subscribe-form');
  const year = $('#year');
  const toast = $('#toast');

  const setActiveNav = () => {
    if (!sections.length || !navLinks.length) return;
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0]?.id || 'home';
    sections.forEach((section) => {
      if (y >= section.offsetTop) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', setActiveNav, { passive: true });
  window.addEventListener('resize', setActiveNav, { passive: true });
  setActiveNav();

  const closeMobileNav = () => {
    if (!mobileNav || !mobileMenu) return;
    mobileNav.classList.remove('open');
    mobileMenu.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-label', 'Open navigation');
    mobileMenu.textContent = '☰';
  };

  if (mobileMenu && mobileNav) {
    mobileMenu.addEventListener('click', () => {
      const open = !mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      mobileMenu.textContent = open ? '×' : '☰';
    });

    $$('.mobile-nav a').forEach((link) => link.addEventListener('click', closeMobileNav));
    document.addEventListener('click', (event) => {
      if (!mobileNav.classList.contains('open')) return;
      if (!mobileNav.contains(event.target) && !mobileMenu.contains(event.target)) closeMobileNav();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileNav();
    });
  }

  // Smooth anchor scrolling with a reduced-motion fallback.
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = $(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
      history.replaceState(null, '', href);
    });
  });

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3200);
  };

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = $('input[type="email"]', subscribeForm);
      if (!input) return;
      const email = input.value.trim();
      if (!email || !input.checkValidity()) {
        input.reportValidity();
        return;
      }
      showToast('Thank you — you’re connected with Raw Millets.');
      subscribeForm.reset();
    });
  }

  if (year) year.textContent = String(new Date().getFullYear());
})();
