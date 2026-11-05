(function() {
  'use strict';

  // DOM Elements
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  const watchAgain = document.getElementById('watchAgain');
  const sections = document.querySelectorAll('section[id], header[id], footer[id]');
  const navItems = document.querySelectorAll('.nav .links a');

  // Mobile navigation drawer toggle
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(anchor => {
      anchor.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }



  // Smooth return to top
  if (watchAgain) {
    watchAgain.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Active section tracker on scroll
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (currentId && item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  }, { passive: true });
})();
