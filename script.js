document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('.nav');
  const menuButton = document.querySelector('.mobile-menu-btn');
  const menu = document.querySelector('.nav-links');
  const menuLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('section[id]')];

  const closeMenu = () => {
    menu.classList.remove('active');
    menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  };

  menuButton.addEventListener('click', () => {
    const open = !menu.classList.contains('active');
    menu.classList.toggle('active', open);
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menuLinks.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => event.key === 'Escape' && closeMenu());

  const reveals = document.querySelectorAll('.reveal, .reveal-group');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((element) => revealObserver.observe(element));
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        menuLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  let previousY = window.scrollY;
  let ticking = false;
  const updateScroll = () => {
    const currentY = window.scrollY;
    nav.classList.toggle('scrolled', currentY > 24);
    nav.style.transform = currentY > previousY && currentY > 180 && !menu.classList.contains('active') ? 'translateY(-100%)' : '';
    previousY = currentY;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) requestAnimationFrame(updateScroll);
    ticking = true;
  }, { passive: true });

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const heroLight = document.querySelector('.hero-light');
  if (finePointer.matches && !reducedMotion.matches && heroLight) {
    let frame;
    window.addEventListener('pointermove', (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 24;
        const y = (event.clientY / window.innerHeight - 0.5) * 18;
        heroLight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = null;
      });
    }, { passive: true });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
});
