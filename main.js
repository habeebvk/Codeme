/* ==========================================================================
   AuraTech Solutions - Main Interactive JavaScript
   Canvas Animations, Dynamic Estimator, Live CRM/ERP Demo, Scroll Reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect
  const navbar = document.querySelector('.navbar') || document.querySelector('.navbar-inner');
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle & drawer handling
  const navToggle = document.getElementById('navToggle') || document.querySelector('.navbar-toggle') || document.querySelector('.mobile-toggle');
  const navMenu = document.getElementById('navMenu') || document.querySelector('.navbar-menu') || document.querySelector('.nav-links');
  const navOverlay = document.getElementById('navOverlay');

  const closeMobileMenu = () => {
    if (navToggle) navToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openMobileMenu = () => {
    if (navToggle) navToggle.classList.add('active');
    if (navMenu) navMenu.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.contains('active');
      if (isActive) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  // Mobile Accordion for dropdowns
  const dropdownItems = document.querySelectorAll('.nav-has-dropdown');
  dropdownItems.forEach((item) => {
    const link = item.querySelector('.custom-nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        // Only treat as accordion toggle on mobile screens (< 1040px)
        if (window.innerWidth <= 1040) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = item.classList.contains('is-open');
          // Close other open accordions
          dropdownItems.forEach((other) => {
            if (other !== item) other.classList.remove('is-open');
          });
          item.classList.toggle('is-open', !isOpen);
        }
      });
    }
  });

  // Close mobile menu when clicking normal links
  if (navMenu) {
    navMenu.querySelectorAll('a:not(.nav-has-dropdown > a)').forEach((a) => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 1040) {
          closeMobileMenu();
        }
      });
    });
  }

  // Close dropdowns on outside click or Escape key
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-has-dropdown')) {
      dropdownItems.forEach((item) => item.classList.remove('is-open'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      dropdownItems.forEach((item) => item.classList.remove('is-open'));
    }
  });

  // Theme toggle (light/dark) with persistence and icon syncing
  const themeToggle = document.getElementById('themeToggle') || document.getElementById('theme-toggle');
  
  // Check stored theme
  const savedTheme = localStorage.getItem('codeme_theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-mode');
      localStorage.setItem('codeme_theme', isLight ? 'light' : 'dark');
      window.dispatchEvent(new CustomEvent('themechange', { detail: { isLight } }));
    });
  }
  // 2. Interactive Canvas Particle Background
  initParticleCanvas();

  // 3. Tech Stack & Industry Vertical Filter Tabs
  initTechStackTabs();

  // 4. Live CRM & ERP Demo Widget Interactivity & Chart.js
  initDemoWidget();

  // 5. Interactive Scope & Cost Estimator Engine
  initCostEstimator();

  // 6. Portfolio Filtering & Modal Popup
  initPortfolioModal();

  // 7. FAQ Accordion
  initFaqAccordion();

  // 7b. Industries & Services Transform with AI Accordion
  initTransformAccordion();

  // 8. Contact Form Validation & Toast Notification
  initContactForm();

  // 9. Scroll Reveal Animation Observer
  initScrollReveal();
});

/* ==========================================================================
   1. Interactive Particle Canvas Constellation
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.size = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.5 ? '#6366f1' : '#06b6d4';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive force
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = '#6366f1';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ==========================================================================
   2. Live CRM & ERP Demo Widget
   ========================================================================== */
function initDemoWidget() {
  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  const tabContents = document.querySelectorAll('.demo-tab-content');
  let analyticsChartInstance = null;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
        if (targetId === 'tab-analytics' && !analyticsChartInstance) {
          renderAnalyticsChart();
        }
      }
    });
  });

  // Render initial chart if Chart.js is loaded
  if (typeof Chart !== 'undefined') {
    renderAnalyticsChart();
  } else {
    window.addEventListener('load', () => {
      if (typeof Chart !== 'undefined') renderAnalyticsChart();
    });
  }

  function renderAnalyticsChart() {
    const canvas = document.getElementById('analyticsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const gradientRevenue = ctx.createLinearGradient(0, 0, 0, 300);
    gradientRevenue.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
    gradientRevenue.addColorStop(1, 'rgba(99, 102, 241, 0)');

    const gradientDeals = ctx.createLinearGradient(0, 0, 0, 300);
    gradientDeals.addColorStop(0, 'rgba(6, 182, 212, 0.5)');
    gradientDeals.addColorStop(1, 'rgba(6, 182, 212, 0)');

    window.addEventListener('themechange', () => {
      if (analyticsChartInstance) {
        analyticsChartInstance.destroy();
        analyticsChartInstance = null;
        renderAnalyticsChart();
      }
    });

    const isLightMode = document.documentElement.classList.contains('light-mode');
    const legendColor = isLightMode ? '#334155' : '#94a3b8';
    const gridColor = isLightMode ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';
    const tickColor = isLightMode ? '#64748b' : '#64748b';

    analyticsChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'ERP Revenue Growth ($k)',
            data: [42, 58, 65, 82, 95, 110, 135, 160, 185, 210, 240, 290],
            borderColor: '#2563eb',
            backgroundColor: gradientRevenue,
            borderWidth: 3,
            fill: true,
            tension: 0.4
          },
          {
            label: 'CRM Active Qualified Deals',
            data: [20, 28, 35, 45, 52, 68, 80, 92, 105, 125, 140, 175],
            borderColor: '#06b6d4',
            backgroundColor: gradientDeals,
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: legendColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: tickColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: tickColor }
          }
        }
      }
    });
  }
}

/* ==========================================================================
   3. Interactive Scope & Cost Estimator Engine
   ========================================================================== */
function initCostEstimator() {
  const serviceCards = document.querySelectorAll('.service-select-card');
  const featureCards = document.querySelectorAll('.feature-select-card');
  const timelineCards = document.querySelectorAll('.timeline-select-card');

  const estimatedPriceEl = document.getElementById('estimatedPrice');
  const estimatedTimeEl = document.getElementById('estimatedTime');
  const estimatorCta = document.getElementById('estimatorCta');

  let basePrice = 3500;
  let featureSum = 0;
  let timelineMultiplier = 1.0;
  let selectedService = 'Mobile App Development';

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      basePrice = parseInt(card.getAttribute('data-price')) || 3500;
      selectedService = card.getAttribute('data-name') || 'Mobile App Development';
      recalculate();
    });
  });

  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      recalculate();
    });
  });

  timelineCards.forEach(card => {
    card.addEventListener('click', () => {
      timelineCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      timelineMultiplier = parseFloat(card.getAttribute('data-multiplier')) || 1.0;
      recalculate();
    });
  });

  function recalculate() {
    featureSum = 0;
    featureCards.forEach(c => {
      if (c.classList.contains('selected')) {
        featureSum += parseInt(c.getAttribute('data-price')) || 0;
      }
    });

    const totalPrice = Math.round((basePrice + featureSum) * timelineMultiplier);
    animateCounter(estimatedPriceEl, totalPrice, '$');

    let baseWeeks = 4;
    if (basePrice >= 6000) baseWeeks = 8;
    if (basePrice >= 10000) baseWeeks = 12;
    const finalWeeks = Math.ceil(baseWeeks * (timelineMultiplier === 1.3 ? 0.6 : 1.0));
    estimatedTimeEl.textContent = `${finalWeeks} - ${finalWeeks + 2} Weeks`;
  }

  function animateCounter(el, targetValue, prefix = '') {
    if (!el) return;
    const currentVal = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
    const duration = 500;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.floor(currentVal + (targetValue - currentVal) * progress);
      el.textContent = `${prefix}${val.toLocaleString()}`;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (estimatorCta) {
    estimatorCta.addEventListener('click', () => {
      const msgInput = document.getElementById('contactMessage');
      const serviceInput = document.getElementById('contactServiceSelect');
      if (serviceInput) serviceInput.value = selectedService;
      if (msgInput) {
        msgInput.value = `Hi AuraTech Team, I used your project cost estimator for ${selectedService}. My estimated budget is around ${estimatedPriceEl.textContent}. I would like to schedule a detailed discovery call.`;
      }
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   4. Portfolio Modal Details
   ========================================================================== */
function initPortfolioModal() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const modalOverlay = document.getElementById('portfolioModal');
  const modalClose = document.getElementById('modalClose');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      portfolioCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.portfolio-title').textContent;
      const cat = card.querySelector('.portfolio-cat').textContent;

      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalCat').textContent = cat;
      document.getElementById('modalDesc').textContent = `Full case study breakdown for ${title}. We architected a scalable, high-performance platform delivering +180% efficiency gains and seamless customer engagement.`;
      
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }
}

/* ==========================================================================
   5. Contact Form Validation & Toast Notification
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('agencyContactForm');
  const toast = document.getElementById('toastMsg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();

      if (!name || !email) {
        showToast('Please fill out all required fields.', 'warning');
        return;
      }

      showToast('Thank you! Your project consultation request has been submitted.', 'success');
      form.reset();
    });
  }

  function showToast(msg, type = 'success') {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

/* ==========================================================================
   Tech Stack & Industry Vertical Matrix Tabs
   ========================================================================== */
function initTechStackTabs() {
  const tabBtns = document.querySelectorAll('.tech-tab-btn');
  const techCards = document.querySelectorAll('.tech-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-tech');
      techCards.forEach(card => {
        const cat = card.getAttribute('data-tech-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   FAQ Accordion Interactivity
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Industries & Services Transform with AI Accordion
   ========================================================================== */
function initTransformAccordion() {
  const transformCards = document.querySelectorAll('.transform-card');

  transformCards.forEach(card => {
    const header = card.querySelector('.transform-card-header');
    const toggleBtn = card.querySelector('.transform-toggle-btn');
    const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;

    if (!header) return;

    header.addEventListener('click', () => {
      const isAlreadyActive = card.classList.contains('active');

      // Close other accordion cards and update icons
      transformCards.forEach(c => {
        c.classList.remove('active');
        const btn = c.querySelector('.transform-toggle-btn');
        const icon = btn ? btn.querySelector('i') : null;
        if (icon) {
          icon.className = 'fa-solid fa-chevron-down';
        }
      });

      // Toggle clicked card
      if (!isAlreadyActive) {
        card.classList.add('active');
        if (toggleIcon) {
          toggleIcon.className = 'fa-solid fa-chevron-up';
        }
      }
    });
  });
}

/* ==========================================================================
   Scroll Reveal Observer
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.service-card, .transform-card, .portfolio-card, .section-header, .timeline-step, .tech-card, .estimator-step-card, .estimator-summary-card, .pricing-card, .faq-item, .why-card, .why-stats-banner, .why-quote-banner, .why-trust-bar, .about-bento-card, .about-split-content, .security-standard-card, .security-audit-card, .approach-visual-card, .approach-left-col');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
}
