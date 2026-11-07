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

  function applyCmsData() {
    try {
      const raw = localStorage.getItem('asim_portfolio_cms_data');
      if (!raw) return;
      const data = JSON.parse(raw);

      // 1. Theme Accent Color
      if (data.theme && data.theme.accentColor) {
        document.documentElement.style.setProperty('--teal', data.theme.accentColor);
        document.documentElement.style.setProperty('--teal-glow', data.theme.accentColor + '40');
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
  revealElems.forEach(el => revealObserver.observe(el));

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

})();
