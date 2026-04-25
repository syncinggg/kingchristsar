
'use strict';

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((fill) => {
          const pct = fill.getAttribute('data-fill') || '0';
          setTimeout(() => {
            fill.style.width = pct + '%';
          }, 250);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

const skillsSection = document.querySelector('#skills');
if (skillsSection) skillObserver.observe(skillsSection);


const sections   = Array.from(document.querySelectorAll('section[id]'));
const dockItems  = Array.from(document.querySelectorAll('.dock-item[href^="#"]'));

const spyObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (!visible.length) return;

    const id = visible[0].target.getAttribute('id');
    dockItems.forEach((item) => {
      const isActive = item.getAttribute('href') === `#${id}`;
      item.classList.toggle('active', isActive);
    });
  },
  {
    threshold: 0,
    rootMargin: `-${42}px 0px -55% 0px`,
  }
);

sections.forEach((s) => spyObserver.observe(s));

document.querySelectorAll('.dock-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    const href = item.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    item.classList.add('tapped');
    item.addEventListener('animationend', () => item.classList.remove('tapped'), { once: true });
  });
});


const dockTrack = document.querySelector('.dock-track');
const dockIcons = Array.from(document.querySelectorAll('.dock-item .d-icon'));

function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches;
}

if (dockTrack && !isTouchDevice()) {
  dockTrack.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const MAX_DIST  = 96;   
    const MAX_SCALE = 1.38; 
    const MAX_LIFT  = 10;   

    dockIcons.forEach((icon) => {
      const rect   = icon.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist   = Math.abs(mouseX - center);
      const ratio  = Math.max(0, 1 - dist / MAX_DIST);
      const scale  = 1 + (MAX_SCALE - 1) * ratio;
      const lift   = MAX_LIFT * ratio;
      icon.style.transform = `scale(${scale.toFixed(3)}) translateY(-${lift.toFixed(2)}px)`;
    });
  });

  dockTrack.addEventListener('mouseleave', () => {
    dockIcons.forEach((icon) => {
      icon.style.transform = '';
    });
  });
}


const windowBar   = document.getElementById('windowBar');
let   lastScrollY = window.scrollY;
let   ticking     = false;

window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const current = window.scrollY;
        if (current > lastScrollY && current > 80) {
          windowBar.classList.add('hidden');
        } else {
          windowBar.classList.remove('hidden');
        }
        lastScrollY = current;
        ticking     = false;
      });
      ticking = true;
    }
  },
  { passive: true }
);


if (!isTouchDevice()) {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  let rafId = null;
  let tx1 = 0, ty1 = 0;
  let tx2 = 0, ty2 = 0;

  window.addEventListener('mousemove', (e) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const rx = (e.clientX / window.innerWidth  - 0.5); 
      const ry = (e.clientY / window.innerHeight - 0.5);

      tx1 = rx * 28;
      ty1 = ry * 28;
      tx2 = rx * -22;
      ty2 = ry * -22;

      if (orb1) orb1.style.transform = `translate(${tx1}px, ${ty1}px)`;
      if (orb2) orb2.style.transform = `translate(${tx2}px, ${ty2}px)`;
      if (orb3) orb3.style.transform = `translateX(-50%) translate(${rx * 14}px, ${ry * 14}px)`;

      rafId = null;
    });
  }, { passive: true });
}

const photoWrap = document.querySelector('.hero-photo-wrap');

if (photoWrap && !isTouchDevice()) {
  photoWrap.addEventListener('mousemove', (e) => {
    const rect  = photoWrap.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const rotX  = (-dy * 12).toFixed(2);
    const rotY  = ( dx * 12).toFixed(2);
    photoWrap.style.transform =
      `perspective(260px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
  });

  photoWrap.addEventListener('mouseleave', () => {
    photoWrap.style.transform = '';
  });
}


window.addEventListener('DOMContentLoaded', () => {
  // Trigger visible for elements already in viewport
  document.querySelectorAll('.reveal').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // slight delay to allow CSS animations to finish first
      setTimeout(() => el.classList.add('visible'), 50);
    }
  });
});


document.querySelectorAll('.cert-card').forEach((card, i) => {
  const colors = [
    'rgba(74, 168, 255, 0.07)',   // blue
    'rgba(167, 139, 250, 0.07)', // purple
    'rgba(39, 200, 64, 0.07)',   // green
  ];
  card.addEventListener('mouseenter', () => {
    card.style.background = colors[i % colors.length];
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

const tlRed = document.querySelector('.tl-red');
if (tlRed) {
  tlRed.addEventListener('click', () => {
    // Playful blink on "close"
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 350);
  });
}

const tlGreen = document.querySelector('.tl-green');
if (tlGreen) {
  tlGreen.title = 'You\'re viewing King\'s portfolio!';
}

function showCopyFeedback(el, original) {
  const val = el.querySelector('.ci-value');
  if (!val) return;
  const prev = val.textContent;
  val.textContent = '✓ Copied!';
  val.style.color = 'var(--green)';
  setTimeout(() => {
    val.textContent = prev;
    val.style.color = '';
  }, 1800);
}

document.querySelectorAll('.contact-item:not(.no-link)').forEach((item) => {
  item.addEventListener('click', (e) => {
    const val = item.querySelector('.ci-value');
    if (!val) return;
    const text = val.textContent.trim();
    // Only copy for phone / email, not website
    if (text.includes('@') || /^\d/.test(text)) {
      e.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => showCopyFeedback(item, text));
      }
    }
  });
});


const heroCvBtn = document.getElementById('heroCvBtn');
const fabCv     = document.getElementById('fabCv');

if (heroCvBtn && fabCv) {
  const fabObserver = new IntersectionObserver(
    ([entry]) => {
      fabCv.classList.toggle('fab-cv--visible', !entry.isIntersecting);
    },
    { threshold: 0.5 }
  );
  fabObserver.observe(heroCvBtn);
}
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.orb-1, .orb-2, .orb-3').forEach((el) => {
    el.style.animation = 'none';
  });
}
