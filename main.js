/* ═══════════════════════════════════════════════════════
   ROHIT ANAND PORTFOLIO — JAVASCRIPT
   Particles · Typing · Cursor · Scroll Effects · Tilt · Form
═══════════════════════════════════════════════════════ */

"use strict";

/* ────────────────────────────
   1. LOADER
──────────────────────────── */
(function initLoader() {
  const wrapper  = document.getElementById('loaderWrapper');
  const progress = document.getElementById('loaderProgress');
  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) { pct = 100; clearInterval(interval); }
    progress.style.width = pct + '%';
    if (pct === 100) {
      setTimeout(() => {
        wrapper.classList.add('hidden');
        document.body.style.overflow = '';
        startReveal();
      }, 400);
    }
  }, 80);
  document.body.style.overflow = 'hidden';
})();

/* ────────────────────────────
   2. CUSTOM CURSOR
──────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (window.innerWidth <= 768) { dot.style.display = 'none'; ring.style.display = 'none'; return; }

  let mx = -200, my = -200, rx = -200, ry = -200;
  let raf;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function updateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(updateRing);
  }
  updateRing();

  // Hover effect
  const hoverTargets = 'a, button, .skill-card, .project-card, .contact-link-card, .filter-btn, .timeline-content';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });
})();

/* ────────────────────────────
   3. PARTICLE CANVAS BACKGROUND
──────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -1000, y: -1000 };
  const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 110;
  const COLORS = ['rgba(0,180,216,', 'rgba(167,139,250,', 'rgba(244,114,182,', 'rgba(255,255,255,'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', () => { resize(); initParticlesList(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.r  = Math.random() * 2 + .5;
      this.alpha = Math.random() * .5 + .15;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulseSpeed = Math.random() * .02 + .005;
      this.pulseDelta = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulseDelta += this.pulseSpeed;
      this.currentAlpha = this.alpha + Math.sin(this.pulseDelta) * .1;
      // Mouse repel
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const force = (80 - dist) / 80;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
      }
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.currentAlpha + ')';
      ctx.fill();
    }
  }

  function initParticlesList() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const a = (1 - d / 110) * .15;
          ctx.strokeStyle = `rgba(0,180,216,${a})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

  resize();
  initParticlesList();
  loop();
})();

/* ────────────────────────────
   4. TYPING ANIMATION
──────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const words = ['C++ Developer', 'JavaScript Expert', 'Python Programmer', 'Full Stack Developer', 'Problem Solver', 'Open Source Contributor'];
  let wi = 0, ci = 0, deleting = false, pauseTimer = 0;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; pauseTimer = 0; setTimeout(type, 1800); return; }
      setTimeout(type, 70 + Math.random() * 40);
    } else {
      if (pauseTimer < 1) { pauseTimer++; setTimeout(type, 50); return; }
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 300); return; }
      setTimeout(type, 40);
    }
  }
  setTimeout(type, 1500);
})();

/* ────────────────────────────
   5. NAVBAR SCROLL BEHAVIOUR
──────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 50);
    if (backToTop) backToTop.classList.toggle('show', y > 400);

    // Active link highlight
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 160) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksEl.classList.toggle('open');
    });
    navLinksEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksEl.classList.remove('open');
      });
    });
  }
})();

/* ────────────────────────────
   6. SCROLL REVEAL ANIMATIONS
──────────────────────────── */
function startReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(() => el.classList.add('revealed'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));
}

/* ────────────────────────────
   7. SKILL BAR ANIMATION
──────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar  = entry.target;
      const fill = bar.querySelector('.skill-bar-fill');
      const pct  = bar.getAttribute('data-width') || '0';
      fill.style.width = pct + '%';
      io.unobserve(bar);
    });
  }, { threshold: .4 });
  bars.forEach(b => io.observe(b));
})();

/* ────────────────────────────
   8. COUNTER ANIMATION
──────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      let current  = 0;
      const step   = Math.max(1, Math.ceil(target / 40));
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 50);
      io.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(c => io.observe(c));
})();

/* ────────────────────────────
   9. 3D TILT EFFECT ON CARDS
──────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) / (r.width  / 2);
      const dy  = (e.clientY - cy) / (r.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)';
      card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'transform .1s ease'; });
  });
})();

/* ────────────────────────────
   10. PROJECT FILTER
──────────────────────────── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      cards.forEach(c => {
        const cat = c.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          c.classList.remove('hidden');
          c.style.animation = 'fadeInUp .4s ease both';
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });
})();

/* ────────────────────────────
   11. CONTACT FORM — EmailJS + DB backup
──────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('formSubmitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formError');
  if (!form) return;

  // Initialise EmailJS if configured
  const cfg = (typeof PORTFOLIO_CONFIG !== 'undefined') ? PORTFOLIO_CONFIG : null;
  if (cfg && cfg.emailjs.isConfigured) {
    emailjs.init(cfg.emailjs.publicKey);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = document.getElementById('cfName').value.trim();
    const email   = document.getElementById('cfEmail').value.trim();
    const subject = document.getElementById('cfSubject').value.trim() || 'Portfolio Contact';
    const message = document.getElementById('cfMessage').value.trim();
    if (!name || !email || !message) return;

    // Hide any previous messages
    if (successMsg) successMsg.classList.remove('show');
    if (errorMsg)   errorMsg.classList.remove('show');

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    let emailSent = false;

    /* ── Try EmailJS (real email) ── */
    if (cfg && cfg.emailjs.isConfigured) {
      try {
        await emailjs.send(cfg.emailjs.serviceId, cfg.emailjs.templateId, {
          to_name:    'Rohit Anand',
          name:  name,
          email: email,
          title:    subject,
          message:    message,
          reply_to:   email
        });
        emailSent = true;
      } catch (err) {
        console.warn('EmailJS error:', err);
      }
    }

    /* ── Always save to DB as backup ── */
    try {
      await fetch('tables/contact_messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, sent_at: new Date().toISOString() })
      });
    } catch (_) { /* silent */ }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    form.reset();

    if (cfg && cfg.emailjs.isConfigured) {
      if (emailSent) {
        // Real email delivered
        showFormMsg(successMsg, '<i class="fas fa-check-circle"></i> Message sent! Rohit will reply within 24 hrs.');
      } else {
        // EmailJS failed but saved in DB
        showFormMsg(errorMsg, '<i class="fas fa-exclamation-triangle"></i> Delivery issue — but your message is saved. Rohit will see it!');
      }
    } else {
      // Not configured — saved to DB only, show notice
      showFormMsg(successMsg, '<i class="fas fa-check-circle"></i> Message saved! (Email not yet configured — set up EmailJS to also receive email alerts.)');
    }
  });

  function showFormMsg(el, html) {
    if (!el) return;
    el.innerHTML = html;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 7000);
  }
})();

/* ────────────────────────────
   12. SMOOTH ANCHOR SCROLLING
──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ────────────────────────────
   13. PARALLAX HERO GLOW
──────────────────────────── */
(function initParallax() {
  const g1 = document.querySelector('.glow-1');
  const g2 = document.querySelector('.glow-2');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (g1) g1.style.transform = `translateY(${y * .15}px)`;
    if (g2) g2.style.transform = `translateY(${-y * .1}px)`;
  }, { passive: true });
})();

/* ────────────────────────────
   14. DYNAMIC GRADIENT CURSOR TRAIL (subtle)
──────────────────────────── */
(function initGlowTrail() {
  if (window.innerWidth <= 768) return;
  const MAX_DOTS = 12;
  const trails = [];
  for (let i = 0; i < MAX_DOTS; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; width:${5 + i * .4}px; height:${5 + i * .4}px;
      border-radius:50%; pointer-events:none; z-index:9990;
      background: radial-gradient(circle, rgba(0,180,216,${.3 - i * .025}), transparent);
      transform:translate(-50%,-50%);
      transition: left ${i * 25}ms ease, top ${i * 25}ms ease;
    `;
    document.body.appendChild(el);
    trails.push(el);
  }
  let tx = -200, ty = -200;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function updateTrail() {
    trails.forEach(el => { el.style.left = tx + 'px'; el.style.top = ty + 'px'; });
    requestAnimationFrame(updateTrail);
  }
  updateTrail();
})();

/* ────────────────────────────
   15. SKILL CARD GLOW ON HOVER
──────────────────────────── */
(function initCardGlow() {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
})();

/* ────────────────────────────
   16. FLOATING BADGE PARALLAX
──────────────────────────── */
(function initBadgeParallax() {
  const badges = document.querySelectorAll('.float-badge');
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    badges.forEach((b, i) => {
      const depth = .01 + i * .005;
      const dx = (e.clientX - cx) * depth;
      const dy = (e.clientY - cy) * depth;
      b.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  });
})();

/* ────────────────────────────
   17. SECTION NAV PROGRESS BAR
──────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:2px; z-index:9999;
    background:linear-gradient(90deg,#00b4d8,#a78bfa);
    transition: width .1s ease; pointer-events:none;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / docH * 100) + '%';
  }, { passive: true });
})();

/* ────────────────────────────
   18. CSS KEYFRAME INJECTION
──────────────────────────── */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .glass-card {
      --mouse-x: 50%; --mouse-y: 50%;
    }
    .glass-card::after {
      content:''; position:absolute; inset:0; border-radius: inherit;
      background: radial-gradient(
        200px circle at var(--mouse-x) var(--mouse-y),
        rgba(255,255,255,.04), transparent 70%
      );
      pointer-events: none; opacity: 0;
      transition: opacity .3s;
    }
    .glass-card:hover::after { opacity: 1; }
  `;
  document.head.appendChild(style);
})();

console.log('%c🚀 Rohit Anand Portfolio', 'font-size:20px; font-weight:800; background: linear-gradient(135deg,#00b4d8,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; padding:4px;');
console.log('%cHello recruiter! 👋 Feel free to inspect the code.', 'color:#94a3b8; font-size:12px;');

/* ────────────────────────────
   19. CV DOWNLOAD — smart handler
──────────────────────────── */
(function initCVDownload() {
  const btn = document.getElementById('downloadCv');
  if (!btn) return;

  const cfg = (typeof PORTFOLIO_CONFIG !== 'undefined') ? PORTFOLIO_CONFIG : null;
  const cvPath = cfg ? cfg.cv.path : 'Rohit_Anand_CV.pdf';

  // Set correct href
  btn.setAttribute('href', cvPath);
  btn.setAttribute('download', cvPath);

  btn.addEventListener('click', async function(e) {
    // Check if CV actually exists before downloading
    try {
      const res = await fetch(cvPath, { method: 'HEAD' });
      if (!res.ok) {
        e.preventDefault();
        showCVNotReadyToast();
      } else {
        // File exists — animate button
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing…';
        btn.style.pointerEvents = 'none';
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-check"></i> Downloading!';
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.pointerEvents = '';
          }, 2000);
        }, 800);
      }
    } catch(_) {
      e.preventDefault();
      showCVNotReadyToast();
    }
  });

  function showCVNotReadyToast() {
    // Remove any existing toast
    const old = document.getElementById('cvToast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.id = 'cvToast';
    toast.innerHTML = `
      <i class="fas fa-file-pdf"></i>
      <div>
        <strong>CV not uploaded yet</strong>
        <span>Upload <code>Rohit_Anand_CV.pdf</code> to the root folder.</span>
      </div>
      <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    toast.style.cssText = `
      position:fixed; bottom:90px; right:28px; z-index:9999;
      background:rgba(11,11,31,0.95); border:1px solid rgba(167,139,250,0.4);
      backdrop-filter:blur(16px); border-radius:14px;
      padding:14px 18px; display:flex; align-items:flex-start; gap:12px;
      max-width:320px; box-shadow:0 8px 32px rgba(0,0,0,0.5);
      animation: slideInRight .3s cubic-bezier(.22,1,.36,1);
      font-family: 'Inter', sans-serif;
    `;
    toast.querySelector('i.fa-file-pdf').style.cssText = 'color:#a78bfa;font-size:1.4rem;margin-top:2px;flex-shrink:0;';
    toast.querySelector('div').style.cssText = 'flex:1;display:flex;flex-direction:column;gap:3px;';
    toast.querySelector('strong').style.cssText = 'color:#f1f5f9;font-size:.9rem;';
    toast.querySelector('span').style.cssText = 'color:#94a3b8;font-size:.8rem;';
    toast.querySelector('span code').style.cssText = 'color:#00b4d8;background:rgba(0,180,216,.1);padding:1px 5px;border-radius:4px;';
    toast.querySelector('button').style.cssText = 'background:none;border:none;color:#475569;cursor:pointer;font-size:.85rem;padding:2px;';
    document.body.appendChild(toast);

    // Inject slide-in animation if not present
    if (!document.getElementById('toastStyle')) {
      const s = document.createElement('style');
      s.id = 'toastStyle';
      s.textContent = '@keyframes slideInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}';
      document.head.appendChild(s);
    }
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 6000);
  }
})();

/* ────────────────────────────
   20. SETUP BANNER + MODAL
──────────────────────────── */
(function initSetupUI() {
  const banner      = document.getElementById('setupBanner');
  const closeBtn    = document.getElementById('setupClose');
  const guideBtn    = document.getElementById('setupGuideBtn');
  const modal       = document.getElementById('setupModal');
  const modalClose  = document.getElementById('modalClose');
  const modalDone   = document.getElementById('modalDone');
  const cfg         = (typeof PORTFOLIO_CONFIG !== 'undefined') ? PORTFOLIO_CONFIG : null;

  // Hide banner if already fully configured
  if (cfg && cfg.emailjs.isConfigured) {
    if (banner) banner.style.display = 'none';
  }

  // Close banner
  if (closeBtn && banner) {
    closeBtn.addEventListener('click', () => {
      banner.style.animation = 'slideUpBanner .3s ease forwards';
      setTimeout(() => banner.remove(), 300);
    });
  }

  // Open modal
  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (guideBtn)   guideBtn.addEventListener('click',  e => { e.preventDefault(); openModal(); });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalDone)  modalDone.addEventListener('click',  closeModal);
  if (modal)      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // Inject banner + modal animation styles
  const s = document.createElement('style');
  s.textContent = '@keyframes slideUpBanner{to{transform:translateY(-100%);opacity:0}}';
  document.head.appendChild(s);
})();
