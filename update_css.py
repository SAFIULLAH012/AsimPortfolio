import os

css_addition = """
/* Story order: 3 numbers first, card after on small/responsive screens */
@media (max-width: 991px) {
  #resume.section-white .story-grid,
  #resume .story-grid,
  .story-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 1.5rem !important;
  }
  #resume.section-white .timeline-pipeline,
  #resume .timeline-pipeline,
  .story-grid .timeline-pipeline {
    order: 1 !important;
    width: 100% !important;
  }
  #resume.section-white .unified-analytics-card,
  #resume .unified-analytics-card,
  .story-grid .unified-analytics-card {
    order: 2 !important;
    width: 100% !important;
    margin-top: 0.5rem !important;
  }
}

/* ==========================================================================
   SENIOR UI/UX MOTION SUITE & MICRO-INTERACTIONS (SCROLL & HOVER)
   ========================================================================== */

/* 1. KEYFRAME ANIMATIONS */
@keyframes portraitFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(0.35deg);
  }
}

@keyframes beaconRadar {
  0% {
    box-shadow: 0 0 0 0 rgba(149, 42, 101, 0.75);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(149, 42, 101, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(149, 42, 101, 0);
  }
}

@keyframes heroGlowPulse {
  0%, 100% {
    opacity: 0.45;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.06);
  }
}

/* 2. SCROLL REVEAL SYSTEM (HARDWARE ACCELERATED) */
.motion-reveal {
  opacity: 0;
  transform: translateY(28px) scale(0.985);
  filter: blur(4px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform, filter;
}

.motion-reveal.is-inview {
  opacity: 1 !important;
  transform: translateY(0) scale(1) !important;
  filter: blur(0) !important;
}

/* Cascading stagger delays */
.motion-stagger-1 { transition-delay: 0.08s !important; }
.motion-stagger-2 { transition-delay: 0.16s !important; }
.motion-stagger-3 { transition-delay: 0.24s !important; }
.motion-stagger-4 { transition-delay: 0.32s !important; }
.motion-stagger-5 { transition-delay: 0.40s !important; }
.motion-stagger-6 { transition-delay: 0.48s !important; }

/* 3. HERO & PORTRAIT MOTION */
.portrait-card {
  animation: portraitFloat 6.5s ease-in-out infinite;
  transform-origin: center bottom;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease;
}

.portrait-card:hover {
  transform: translateY(-8px) scale(1.02) !important;
  box-shadow: 0 25px 50px -12px rgba(149, 42, 101, 0.35), 0 0 30px rgba(149, 42, 101, 0.25) !important;
}

.beacon-dot, .sec-dot {
  animation: beaconRadar 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
}

/* 4. HOVER MICRO-INTERACTIONS ACROSS ALL CARDS */
.timeline-card,
.unified-analytics-card,
.cert-card,
.dossier-card,
.contact-card,
.scorecard,
.fact {
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.35s ease,
              background 0.35s ease !important;
}

/* Shimmer reflection sweep on hover */
.timeline-card::after,
.unified-analytics-card::after,
.cert-card::after,
.dossier-card::after,
.contact-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -130%;
  width: 70%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16), transparent);
  transform: skewX(-25deg);
  pointer-events: none;
  opacity: 0;
  transition: none;
}

.timeline-card:hover::after,
.unified-analytics-card:hover::after,
.cert-card:hover::after,
.dossier-card:hover::after,
.contact-card:hover::after {
  opacity: 1;
  left: 200%;
  transition: left 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

/* Lift and Berry Glow on Card Hover */
.timeline-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 14px 32px -6px rgba(149, 42, 101, 0.18), 0 0 0 1px rgba(149, 42, 101, 0.3) !important;
  border-color: rgba(149, 42, 101, 0.45) !important;
}

.unified-analytics-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 18px 40px -8px rgba(149, 42, 101, 0.16), 0 0 0 1px rgba(149, 42, 101, 0.32) !important;
  border-color: rgba(149, 42, 101, 0.45) !important;
}

.cert-card:hover {
  transform: translateY(-6px) scale(1.015) !important;
  box-shadow: 0 16px 36px -6px rgba(149, 42, 101, 0.28), 0 0 0 1px rgba(149, 42, 101, 0.5) !important;
  border-color: rgba(149, 42, 101, 0.6) !important;
}

.dossier-card:hover {
  transform: translateY(-6px) scale(1.015) !important;
  box-shadow: 0 18px 36px -6px rgba(149, 42, 101, 0.2), 0 0 0 1px rgba(149, 42, 101, 0.35) !important;
  border-color: rgba(149, 42, 101, 0.45) !important;
}

.contact-card:hover {
  transform: translateY(-5px) scale(1.02) !important;
  box-shadow: 0 16px 35px -6px rgba(149, 42, 101, 0.25), 0 0 0 1px rgba(149, 42, 101, 0.4) !important;
  border-color: rgba(149, 42, 101, 0.55) !important;
}

.fact:hover {
  transform: translateY(-4px) scale(1.02) !important;
  box-shadow: 0 12px 28px -6px rgba(149, 42, 101, 0.18), 0 0 0 1px rgba(149, 42, 101, 0.3) !important;
  border-color: rgba(149, 42, 101, 0.4) !important;
}

/* 5. PILL, CHIP & BADGE MICRO-INTERACTIONS */
.d-pill, .t-tag, .skill-chip, .cert-tag, .d-chip, .sw-chip, .tool-tag {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.25s ease,
              border-color 0.25s ease,
              box-shadow 0.25s ease,
              color 0.25s ease !important;
  cursor: default;
}

.d-pill:hover, .t-tag:hover, .skill-chip:hover, .cert-tag:hover, .d-chip:hover, .sw-chip:hover, .tool-tag:hover {
  transform: translateY(-2.5px) scale(1.04) !important;
  border-color: var(--teal) !important;
  box-shadow: 0 4px 12px rgba(149, 42, 101, 0.25) !important;
  color: var(--teal) !important;
}

/* 6. BUTTON & ACTION ELEVATION WITH GLOWING AURA */
.btn-primary, .btn-secondary, .btn-outline, .cv-button, .m-logo {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.25s ease !important;
}

.btn-primary:hover, .cv-button:hover {
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: 0 10px 25px rgba(149, 42, 101, 0.45), 0 0 20px rgba(149, 42, 101, 0.3) !important;
}

.btn-primary:active, .cv-button:active {
  transform: translateY(0) scale(0.97) !important;
}

.pill-contact:hover, .pill:hover {
  transform: translateY(-2px) scale(1.03) !important;
  box-shadow: 0 6px 20px rgba(149, 42, 101, 0.3) !important;
}

/* 7. EXPERTISE METER BARS WITH ULTRA-SMOOTH EASING */
.meter-row .m-bar {
  overflow: hidden;
  position: relative;
}

.meter-row .m-bar i {
  display: block;
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #952a65 0%, #b83a80 50%, #d4599e 100%) !important;
  transition: width 1.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 10px rgba(149, 42, 101, 0.45);
}
"""

for path in ["css/style.css", "static/css/style.css"]:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace old story-grid order rules with responsive media query version
    old_target = """.story-grid .timeline-pipeline {
  order: 1 !important;
}
.story-grid .unified-analytics-card {
  order: 2 !important;
}"""
    
    if old_target in content:
        content = content.replace(old_target, "")
    
    if "/* SENIOR UI/UX MOTION SUITE" not in content:
        content = content.rstrip() + "\n\n" + css_addition.strip() + "\n"

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {path} successfully!")
