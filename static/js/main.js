(function() {
  'use strict';

  // =========================================================================
  // CMS DYNAMIC DATA SYNCHRONIZATION (Instant Live Updates from Admin Dashboard)
  // =========================================================================
  let cmsPhrases = [
    'COMPUTATIONAL CHEMIST',
    'BS CHEMISTRY STUDENT',
    'MOLECULAR MODELING RESEARCHER',
    'THEORETICAL CHEMISTRY ENTHUSIAST'
  ];

    // =========================================================================
  // UNIVERSAL DYNAMIC COLOR ENGINE (Transforms EVERY Pink/Berry Element Logically)
  // =========================================================================
  function applyDynamicTheme(hexColor) {
    if (!hexColor || typeof hexColor !== 'string' || !hexColor.startsWith('#')) return;

    let clean = hexColor.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    if (clean.length !== 6) return;

    const r = parseInt(clean.substring(0, 2), 16) || 149;
    const g = parseInt(clean.substring(2, 4), 16) || 42;
    const b = parseInt(clean.substring(4, 6), 16) || 101;

    // Derived color calculations
    const shade = (percent) => {
      const factor = (100 + percent) / 100;
      const clamp = (v) => Math.min(255, Math.max(0, Math.round(v)));
      const nr = clamp(r * factor);
      const ng = clamp(g * factor);
      const nb = clamp(b * factor);
      return '#' + ((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1);
    };

    const darkHex = shade(-32);
    const lightHex = shade(25);
    const lighterHex = shade(48);

    const glowRgba = `rgba(${r}, ${g}, ${b}, 0.45)`;
    const softRgba = `rgba(${r}, ${g}, ${b}, 0.12)`;
    const subtleRgba = `rgba(${r}, ${g}, ${b}, 0.22)`;
    const borderRgba = `rgba(${r}, ${g}, ${b}, 0.4)`;
    const deepRgba = `rgba(${r}, ${g}, ${b}, 0.75)`;

    const root = document.documentElement;
    root.style.setProperty('--teal', hexColor);
    root.style.setProperty('--teal-dark', darkHex);
    root.style.setProperty('--teal-light', lightHex);
    root.style.setProperty('--teal-lighter', lighterHex);
    root.style.setProperty('--teal-glow', glowRgba);
    root.style.setProperty('--teal-soft', softRgba);
    root.style.setProperty('--teal-subtle', subtleRgba);
    root.style.setProperty('--section-berry-bg', hexColor);

    // High-priority dynamic CSS injection to override every hardcoded berry/pink element
    let styleEl = document.getElementById('dynamic-theme-accent-sheet');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-theme-accent-sheet';
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      :root {
        --teal: ${hexColor} !important;
        --teal-dark: ${darkHex} !important;
        --teal-light: ${lightHex} !important;
        --teal-lighter: ${lighterHex} !important;
        --teal-glow: ${glowRgba} !important;
        --teal-soft: ${softRgba} !important;
        --teal-subtle: ${subtleRgba} !important;
        --section-berry-bg: ${hexColor} !important;
      }

      /* =========================================================================
         SCREEN 7: THEORETICAL FRAMEWORK & METHODOLOGY (FULL COLOR TRANSFORMATION)
         ========================================================================= */
      section#methodology,
      section#methodology.section-berry {
        background: ${hexColor} !important;
        background-color: ${hexColor} !important;
      }

      section#methodology .method-step-num {
        color: ${hexColor} !important;
        background: #ffffff !important;
      }

      section#methodology .method-card:hover .method-step-num {
        background: #ffd166 !important;
        color: #060608 !important;
        box-shadow: 0 0 14px rgba(255, 209, 102, 0.8) !important;
      }

      section#methodology .method-card:hover {
        border-color: #ffffff !important;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${glowRgba} !important;
      }

      section#methodology .pill-framework {
        background: rgba(255, 255, 255, 0.2) !important;
        border-color: rgba(255, 255, 255, 0.8) !important;
      }

      section#methodology .pill-framework:hover {
        box-shadow: 0 6px 20px rgba(255, 255, 255, 0.35) !important;
      }

      section#methodology .methodology-note {
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25), 0 0 14px ${subtleRgba} !important;
      }

      /* =========================================================================
         SCREEN 3 & SCREEN 5: EDUCATION & CERTIFICATIONS BACKGROUNDS
         ========================================================================= */
      section#education.section-green,
      section#certifications.section-green {
        background: ${hexColor} !important;
        background-color: ${hexColor} !important;
      }

      /* =========================================================================
         SCREEN 1: HERO, PORTRAIT PICTURE GLOW, BUTTONS & AMBIENT RADIANCE
         ========================================================================= */
      .portrait-card {
        border-color: ${borderRgba} !important;
        box-shadow: 0 25px 60px -15px #000, 0 0 35px ${glowRgba} !important;
      }

      .hero-art:hover .portrait-card,
      .portrait-card:hover {
        border-color: ${hexColor} !important;
        box-shadow: 0 30px 70px -15px #000, 0 0 50px ${glowRgba} !important;
      }

      .about-visual .portrait-card {
        border-color: ${borderRgba} !important;
        box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.12), 0 0 25px ${softRgba} !important;
      }

      .about-visual:hover .portrait-card {
        border-color: ${hexColor} !important;
        box-shadow: 0 22px 50px -12px rgba(0, 0, 0, 0.2), 0 0 40px ${glowRgba} !important;
      }

      .status-chip {
        border-color: ${hexColor} !important;
        color: ${lightHex} !important;
        box-shadow: 0 0 15px ${softRgba} !important;
      }
      /* =========================================================================
         SCREEN 1: HERO, BUTTONS & AMBIENT RADIANCE
         ========================================================================= */
      .hero-title em {
        color: ${hexColor} !important;
        text-shadow: 0 0 35px ${glowRgba} !important;
      }

      .btn-primary,
      a.btn-primary {
        background: ${hexColor} !important;
        border-color: ${lightHex} !important;
        box-shadow: 0 4px 18px ${glowRgba} !important;
      }

      .btn-primary:hover,
      a.btn-primary:hover {
        background: ${lightHex} !important;
        box-shadow: 0 8px 25px ${deepRgba} !important;
      }

      body::before {
        background: radial-gradient(circle, ${subtleRgba} 0%, transparent 70%) !important;
      }

      /* =========================================================================
         SCREEN 2: ABOUT SCHOLAR ACCENTS
         ========================================================================= */
      #about .sec-subtitle {
        color: ${darkHex} !important;
      }

      .about-highlight-box {
        border-color: ${borderRgba} !important;
        box-shadow: 0 0 20px ${softRgba} !important;
      }

      /* =========================================================================
         SCREEN 4: RESEARCH JOURNEY 01 TO 03 MILESTONES
         ========================================================================= */
      #resume .t-node {
        background: linear-gradient(135deg, ${hexColor} 0%, ${lightHex} 100%) !important;
      }

      #resume .t-line {
        background: linear-gradient(180deg, ${hexColor} 0%, #ffd166 30%, ${lighterHex} 60%, ${hexColor} 100%) !important;
        box-shadow: 0 0 8px ${glowRgba} !important;
      }

      #resume .timeline-card.journey-item:hover .t-body {
        border-color: ${hexColor} !important;
        box-shadow: 0 8px 24px ${softRgba}, -4px 0 0 0 ${hexColor} !important;
      }

      #resume .journey-item .t-header .t-badge.active {
        background: ${hexColor} !important;
        color: #ffffff !important;
      }

      .sw-item:hover .sw-ico {
        color: ${lightHex} !important;
      }

      /* =========================================================================
         SCREEN 6: HALO-DERIVATIVES DOSSIER ACCENTS
         ========================================================================= */
      .card-accent-bar.c-teal {
        background: ${hexColor} !important;
      }

      .dossier-card:hover {
        border-color: ${borderRgba} !important;
        box-shadow: 0 16px 36px -6px ${glowRgba} !important;
      }

      /* =========================================================================
         SCREEN 8: FOOTER / CONNECT & COLLABORATE & TAGLINE COLOR SYNC
         ========================================================================= */
      footer#contact .footer-tagline {
        color: ${lightHex} !important;
      }

      footer#contact .tbc-tag,
      footer#contact .pill-contact {
        color: ${lightHex} !important;
        border: 1.5px solid ${hexColor} !important;
        background: ${softRgba} !important;
        box-shadow: 0 0 20px ${glowRgba} !important;
      }

      footer#contact .pill-contact:hover {
        border-color: ${lightHex} !important;
        box-shadow: 0 0 30px ${glowRgba} !important;
      }
      /* =========================================================================
         GLOBAL: NAVIGATION, SELECTION & SCROLLBARS
         ========================================================================= */
      .nav .links a.active {
        color: ${lightHex} !important;
      }

      ::selection {
        background: ${hexColor} !important;
        color: #ffffff !important;
      }

      ::-webkit-scrollbar-thumb {
        background: ${hexColor} !important;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${lightHex} !important;
      }
    `;
  }

function applyCmsData() {
    try {
      // 1. Theme Accent Color (Universal Persistent Synchronization)
      const persistentColor = localStorage.getItem('asim_theme_color');
      if (persistentColor) {
        applyDynamicTheme(persistentColor);
      }

      // Background server API check for cross-device persistence (local & PythonAnywhere)
      const themeEndpoints = ['/api/theme', 'https://safiulllah.pythonanywhere.com/api/theme'];
      themeEndpoints.forEach(ep => {
        try {
          fetch(ep)
            .then(res => res.json())
            .then(serverData => {
              if (serverData && serverData.theme_color) {
                localStorage.setItem('asim_theme_color', serverData.theme_color);
                applyDynamicTheme(serverData.theme_color);
              }
            }).catch(() => {});
        } catch(e){}
      });

      const raw = localStorage.getItem('asim_portfolio_cms_data');
      if (!raw) return;
      const data = JSON.parse(raw);

      if (!persistentColor && data.theme && data.theme.accentColor) {
        applyDynamicTheme(data.theme.accentColor);
      }
      if (data.theme && data.theme.docTitle) {
        document.title = data.theme.docTitle;
      }

      // 2. Profile & Hero (Screen 1)
      if (data.profile) {
        const titleEl = document.querySelector('.hero-title');
        if (titleEl && data.profile.name) {
          // Format name with stylized initial if desired
          const parts = data.profile.name.split(' ');
          if (parts.length > 1) {
            titleEl.innerHTML = `${parts[0]} <em>${parts[1][0]}</em>${parts[1].slice(1)}`;
          } else {
            titleEl.textContent = data.profile.name;
          }
        }
        const descEl = document.querySelector('.hero-desc');
        if (descEl && data.profile.bio) descEl.textContent = data.profile.bio;

        // Profile Avatar
        if (data.profile.avatar) {
          document.querySelectorAll('.portrait-img').forEach(img => {
            img.src = data.profile.avatar;
          });
        }

        // Typewriter phrases
        if (data.profile.typewriter) {
          const list = data.profile.typewriter.split(',').map(s => s.trim()).filter(Boolean);
          if (list.length > 0) cmsPhrases = list;
        }

        // Buttons
        const heroBtn1 = document.querySelector('.hero-actions a.btn-primary');
        if (heroBtn1 && data.profile.heroBtn1Text) {
          heroBtn1.innerHTML = `&#9654;&nbsp;&nbsp;${data.profile.heroBtn1Text}`;
          if (data.profile.heroBtn1Link) heroBtn1.href = data.profile.heroBtn1Link;
        }
        const heroBtn2 = document.querySelector('.hero-actions a.btn-ghost');
        if (heroBtn2 && data.profile.heroBtn2Text) {
          heroBtn2.innerHTML = `&#10515;&nbsp;&nbsp;${data.profile.heroBtn2Text}`;
          if (data.profile.heroBtn2Link) heroBtn2.href = data.profile.heroBtn2Link;
        }
      }

      // 3. About Section (Screen 2)
      if (data.about) {
        const subEl = document.querySelector('#about .sec-subtitle');
        if (subEl && data.about.secSubtitle) subEl.textContent = data.about.secSubtitle;

        const quoteEl = document.querySelector('#about .quote');
        if (quoteEl && data.about.quote) quoteEl.textContent = data.about.quote;

        // Specializations
        if (data.about.specializations) {
          const specContainer = document.querySelector('.specialization-pills');
          if (specContainer) {
            const pills = data.about.specializations.split(',').map(s => s.trim()).filter(Boolean);
            specContainer.innerHTML = pills.map(p => `<span class="spec-pill">${p}</span>`).join('');
          }
        }

        // Facts
        const facts = document.querySelectorAll('#about .fact');
        if (facts.length >= 3) {
          // Matric
          if (data.about.matricMarks) {
            const b = facts[0].querySelector('b');
            if (b) { b.textContent = data.about.matricMarks; b.dataset.target = data.about.matricMarks; }
            const sm = facts[0].querySelector('small');
            if (sm) sm.textContent = `Marks: ${data.about.matricMarks} / ${data.about.matricTotal || '1100'} • ${data.about.matricBoard || 'BISE DG Khan'}`;
          }
          // Inter
          if (data.about.interMarks) {
            const b = facts[1].querySelector('b');
            if (b) { b.textContent = data.about.interMarks; b.dataset.target = data.about.interMarks; }
            const sm = facts[1].querySelector('small');
            if (sm) sm.textContent = `Marks: ${data.about.interMarks} / ${data.about.interTotal || '1100'} • ${data.about.interBoard || 'BISE DG Khan'}`;
          }
          // CGPA
          if (data.about.cgpa) {
            const b = facts[2].querySelector('b');
            if (b) b.textContent = data.about.cgpa;
            const sm = facts[2].querySelector('small');
            if (sm) sm.textContent = `Current ${data.about.semester || '5th Semester'} / ${data.about.cgpaTotal || '4.00'}`;
          }
        }
      }

      // 4. Academic Timeline (Screen 3)
      if (data.education && Array.isArray(data.education) && data.education.length > 0) {
        const timelineList = document.querySelector('ol.timeline');
        if (timelineList) {
          timelineList.innerHTML = data.education.map((item, idx) => `
            <li class="timeline-item motion-reveal motion-stagger-${(idx % 3) + 1}">
              <div class="timeline-icon" aria-hidden="true">
                <i class="fas ${item.icon || 'fa-graduation-cap'}"></i>
              </div>
              <div class="timeline-card">
                <div class="timeline-info">
                  <span class="timeline-year">${item.year || ''}</span>
                  <h3>${item.degree || ''}</h3>
                  <div class="institute"><i class="fas fa-map-marker-alt"></i> ${item.institute || ''}</div>
                  <div class="desc">${item.desc || ''}</div>
                </div>
                <div class="timeline-score" aria-label="Score: ${item.score}">
                  <div class="num">${item.score}</div>
                  <div class="label">${item.scoreLabel || 'Score: ' + item.score}</div>
                </div>
              </div>
            </li>
          `).join('');
        }
      }

      // 5. Research Journey (Screen 4)
      if (data.journey && Array.isArray(data.journey) && data.journey.length > 0) {
        const journeyContainer = document.querySelector('#resume .timeline-pipeline');
        if (journeyContainer) {
          journeyContainer.innerHTML = data.journey.map(item => {
            const tags = (item.tags || '').split(',').map(t => t.trim()).filter(Boolean);
            return `
              <div class="timeline-card journey-item">
                <div class="t-spine">
                  <span class="t-node">${item.step}</span>
                  <span class="t-line"></span>
                </div>
                <div class="t-body">
                  <div class="t-header">
                    <span class="t-category">${item.category}</span>
                    <span class="t-badge ${item.step === '01' ? 'active' : ''}">${item.badge}</span>
                  </div>
                  <h3 class="t-title">${item.title}</h3>
                  <p class="t-desc">${item.desc}</p>
                  <div class="t-tags">
                    ${tags.map(t => `<span class="t-tag">${t}</span>`).join('')}
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // 6. Certifications & Achievements (Screen 5)
      if (data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0) {
        const certsGrid = document.querySelector('#certifications .certs-grid');
        if (certsGrid) {
          certsGrid.innerHTML = data.certifications.map((cert, idx) => `
            <article class="cert-card motion-reveal motion-stagger-${(idx % 3) + 1}">
              <div class="cert-body">
                <div class="cert-badge-row">
                  <span class="cert-id-tag">${cert.idTag || 'ACHIEVEMENT'}</span>
                </div>
                <h3>${cert.title || ''}</h3>
                <p class="cert-issuer"><i class="fas fa-university"></i> ${cert.issuer || ''}</p>
                <p class="cert-date"><i class="fas fa-star"></i> ${cert.date || ''}</p>
                <p style="font-size: 0.78rem; color: #475569; margin-top: 0.4rem; line-height: 1.45;">${cert.desc || ''}</p>
              </div>
            </article>
          `).join('');
        }
      }

      // 7. Research Projects / Halo Derivatives (Screen 6)
      if (data.compounds && Array.isArray(data.compounds) && data.compounds.length > 0) {
        const dossierGrid = document.querySelector('#originals .dossier-grid-3');
        if (dossierGrid) {
          dossierGrid.innerHTML = data.compounds.map((cmpd, idx) => {
            const chips = (cmpd.chips || '').split(',').map(c => c.trim()).filter(Boolean);
            return `
              <article class="dossier-card motion-reveal motion-stagger-${(idx % 3) + 1}">
                <div class="card-accent-bar ${cmpd.accent || 'c-teal'}"></div>
                <div class="dossier-top">
                  <div class="dossier-meta">
                    <span class="dossier-tag">${cmpd.tag || 'CMPD-0' + (idx+1)}</span>
                    <span class="dossier-id">${cmpd.status || 'ONGOING RESEARCH'}</span>
                  </div>
                  <div class="formula-tag">${cmpd.formula || ''}</div>
                  <h3>${cmpd.name || ''}</h3>
                </div>
                <p class="dossier-snippet">${cmpd.desc || ''}</p>
                <div class="dossier-benchmarks">
                  <div class="bm-box"><b>${cmpd.bm1Title || 'FMO / NBO'}</b><span>${cmpd.bm1Sub || 'Analysis'}</span></div>
                  <div class="bm-box highlight"><b>${cmpd.bm2Title || 'Dipole μ'}</b><span>${cmpd.bm2Sub || 'Polarity'}</span></div>
                </div>
                <div class="dossier-footer">
                  ${chips.map(c => `<span class="d-chip">${c}</span>`).join('')}
                </div>
              </article>
            `;
          }).join('');
        }
      }

      // 8. Methodology (Screen 7)
      if (data.methodology) {
        const pill = document.querySelector('#methodology .pill-framework');
        if (pill && data.methodology.pill) pill.textContent = data.methodology.pill;

        const title = document.querySelector('#methodology h2.section-title');
        if (title && data.methodology.title) {
          title.innerHTML = `Computational Research <span>Methodology</span>`;
        }

        const intro = document.querySelector('.methodology-intro');
        if (intro && data.methodology.intro) intro.textContent = data.methodology.intro;

        if (data.methodology.steps && Array.isArray(data.methodology.steps)) {
          const grid = document.querySelector('.methodology-grid-6');
          if (grid) {
            grid.innerHTML = data.methodology.steps.map(step => `
              <div class="method-card">
                <div class="method-card-head">
                  <span class="method-step-num">${step.num}</span>
                  <h4>${step.title}</h4>
                </div>
                <p>${step.desc}</p>
              </div>
            `).join('');
          }
        }

        const note = document.querySelector('.methodology-note span');
        if (note && data.methodology.note) {
          note.innerHTML = `<strong>Computational Details:</strong> ${data.methodology.note.replace('Computational Details:', '').trim()}`;
        }
      }

      // 9. Contact & Footer (Screen 8)
      if (data.contact) {
        const nameEl = document.querySelector('.tbc-name');
        if (nameEl && data.contact.name) nameEl.textContent = data.contact.name;

        const roleEl = document.querySelector('.tbc-role');
        if (roleEl && data.contact.role) roleEl.textContent = data.contact.role;

        const descEl = document.querySelector('.tbc-desc');
        if (descEl && data.contact.desc) descEl.textContent = data.contact.desc;

        if (data.contact.email) {
          const emailLink = document.querySelector('.tbc-actions a[href^="mailto:"]');
          if (emailLink) emailLink.href = `mailto:${data.contact.email}`;
        }

        const linkedinLink = document.querySelector('.tbc-actions a[href*="linkedin.com"]');
        if (linkedinLink && data.contact.linkedin) linkedinLink.href = data.contact.linkedin;

        const rgLink = document.querySelector('.tbc-actions a[href*="researchgate.net"]');
        if (rgLink && data.contact.researchgate) rgLink.href = data.contact.researchgate;

        const ghLink = document.querySelector('.tbc-actions a[href*="github.com"]');
        if (ghLink && data.contact.github) ghLink.href = data.contact.github;

        const taglineEl = document.querySelector('.footer-tagline');
        if (taglineEl && data.contact.tagline) taglineEl.innerHTML = data.contact.tagline.replace(/\n/g, '<br>');

        const copyEl = document.querySelector('.copyright');
        if (copyEl && data.contact.copyright) copyEl.innerHTML = data.contact.copyright;
      }

    } catch (err) {
      console.warn('Could not apply CMS data:', err);
    }
  }

  // Execute CMS live data sync
  applyCmsData();

  // =========================================================================
  // DOM Elements & Navigation
  // =========================================================================
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

  // ==========================================
  // Dynamic Typewriter Effect for Hero Subtitle
  // ==========================================
  const typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    const phrases = cmsPhrases;
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

  // ==========================================
  // UI/UX Motion Suite
  // ==========================================
  // 1. Scroll Reveal (IntersectionObserver)
  const revealElems = document.querySelectorAll('.motion-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02, rootMargin: '0px 0px 50px 0px' });
  revealElems.forEach(el => { revealObserver.observe(el); el.classList.add('is-inview'); });

  // 2. Animated Counters for facts (e.g., 1083, 824)
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

  // 3. Animated Progress Meters on Scroll
  const meterFills = document.querySelectorAll('.meter-fill');
  if (meterFills.length > 0) {
    const meterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetW = fill.style.width;
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
            fill.style.width = targetW;
          }, 150);
          meterObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.2 });
    meterFills.forEach(m => meterObserver.observe(m));
  }

})();
