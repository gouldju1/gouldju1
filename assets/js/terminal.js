/**
 * terminal.js — Justin Gould portfolio
 * Typed text · Scroll-reveal · Hamburger nav · Smooth scroll · Active nav
 */

(function () {
  'use strict';

  // ============================================================
  // 1. TYPED TEXT — cycles taglines in the hero
  // ============================================================
  var taglines = [
    'AI & Data Engineering Leader',
    'Technical Leader @ Eli Lilly & Company',
    'Architecture · Agents · Cloud · Computer Vision · NLP · MLOps · GenAI',
  ];

  var tlIndex   = 0;
  var charIndex = 0;
  var isErasing = false;
  var typeTimer = null;

  function typeStep() {
    var el = document.getElementById('typed-tagline');
    if (!el) return;

    var current = taglines[tlIndex];

    if (!isErasing) {
      charIndex += 1;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isErasing = true;
        typeTimer = setTimeout(typeStep, 2400);
        return;
      }
      typeTimer = setTimeout(typeStep, 68);
    } else {
      charIndex -= 1;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isErasing = false;
        tlIndex = (tlIndex + 1) % taglines.length;
      }
      typeTimer = setTimeout(typeStep, 38);
    }
  }

  // ============================================================
  // 2. SCROLL-REVEAL — IntersectionObserver for sections & cards
  // ============================================================
  function initReveal() {
    // Respect prefers-reduced-motion
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.reveal-section, .reveal-card').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    // Stagger cards within each grid
    document.querySelectorAll('.card-grid').forEach(function (grid) {
      Array.from(grid.children).forEach(function (card, i) {
        card.style.setProperty('--card-index', i);
        observer.observe(card);
      });
    });

    // Observe section-level reveals
    document.querySelectorAll('.reveal-section').forEach(function (el) {
      observer.observe(el);
    });

    // Education cards (outside .card-grid)
    document.querySelectorAll('.edu-card.reveal-card').forEach(function (el) {
      observer.observe(el);
    });

    // Any remaining reveal-cards not inside .card-grid (e.g. cert cards)
    document.querySelectorAll('.reveal-card:not(.card-grid .reveal-card):not(.edu-card)').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============================================================
  // 3. HAMBURGER NAV
  // ============================================================
  function initNav() {
    var toggle  = document.querySelector('.nav-toggle');
    var nav     = document.querySelector('.site-nav');
    var links   = document.querySelector('.nav-links');

    if (!toggle || !nav || !links) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('nav-open');
      links.classList.toggle('is-open');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('nav-open') && !nav.contains(e.target)) {
        nav.classList.remove('nav-open');
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // ============================================================
  // 4. SMOOTH SCROLL — anchor links
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================================
  // 5. ACTIVE NAV LINK
  // ============================================================
  function initActiveNav() {
    var path = window.location.pathname.replace(/\/$/, '');
    document.querySelectorAll('.nav-link').forEach(function (link) {
      var href = (link.getAttribute('href') || '').replace(/\/$/, '');
      if (!href || href.startsWith('http') || href.startsWith('//')) return;
      // Match exact or if current path ends with the link's last segment
      var segment = href.split('/').filter(Boolean).pop() || '';
      if (path === href || (segment && path.toLowerCase().endsWith(segment.toLowerCase()))) {
        link.classList.add('active');
      }
    });
  }

  // ============================================================
  // INIT on DOMContentLoaded
  // ============================================================
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initNav();
    initSmoothScroll();
    initActiveNav();

    // Start typed text after a short delay for polish
    var typedEl = document.getElementById('typed-tagline');
    if (typedEl) {
      setTimeout(typeStep, 700);
    }
  });

})();
