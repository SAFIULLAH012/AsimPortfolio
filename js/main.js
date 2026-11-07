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

  // ======================
  // ==========================================
  // Dynamic Typewriter Effect for Hero Subtitle
  // ==========================================
  const typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    const phrases = [
      'COMPUTATIONAL CHEMIST',
      'BS CHEMISTRY STUDENT',
      'MOLECULAR MODELING RESEARCHER',
      'THEORETICAL CHEMISTRY ENTHUSIAST'
    ];
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = true;
    const typeSpeed = 70;
    const deleteSpeed = 35;
    const holdDelay = 2200;

    function tick() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typewriterEl.textContent = currentPhrase.substring(0, charIndex);
      } else {
        charIndex++;
        typewriterEl.textContent = currentPhrase.substring(0, charIndex);
      }

      let delta = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delta = holdDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delta = 350;
      }

      setTimeout(tick, delta);
    }

    setTimeout(tick, holdDelay);
  }

  // UI/UX Motion Suite
  // ======================

  // 1. Scroll Reveal (IntersectionObserver)
  const revealElems = document.querySelectorAll('.motion-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElems.forEach(el => revealObserver.observe(el));

  // 2. Animated Counters for facts (e.g., 600+, 100%)
  const counterElems = document.querySelectorAll('.fact b[data-target]');
  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const duration = 1400; // ms
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const eased = Math.min(progress / duration, 1);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counterElems.forEach(el => counterObserver.observe(el));

  // 3. Expertise Meter Bar Animation
  const meterBars = document.querySelectorAll('.meter-row .m-bar i[data-perc]');
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const perc = entry.target.dataset.perc;
        entry.target.style.width = perc;
        meterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  meterBars.forEach(bar => {
    bar.style.width = '0%';
    meterObserver.observe(bar);
  });

})();