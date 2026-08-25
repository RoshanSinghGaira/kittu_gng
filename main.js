/* =====================================================
   NIRVAN 26
   ROBOT SCROLL ANIMATION (LOCKED) + WEBSITE SCRIPTS
   Works directly from file:// or any web server.
   ===================================================== */

'use strict';

// ─────────────────────────────────────────────────────
// CANVAS & ROBOT ANIMATION (LOCKED SECTION)
// ─────────────────────────────────────────────────────
const totalFrames = 240;
const frames = [];
const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 1080;

let targetFrame = 0;
let currentFrame = 0;
const EASE = 0.1;
let rafId = null;
let loaded = false;

// ─────────────────────────────────────────────────────
// EVENT DATA — full details for modal + short desc for card (LOCKED)
// ─────────────────────────────────────────────────────
const EVENT_DATA = {
  hackathon: {
    num: '01',
    title: 'HACKATHON',
    desc: 'Put your problem-solving skills to the test in a fast-paced competitive programming challenge. Build, code, collaborate, and compete against talented teams while solving real-world problems under time constraints.',
    date: '12 October 2026',
    time: '10:00 AM – 6:00 PM',
    venue: 'Computer Lab 1',
    team: '2–4 members',
    eligibility: 'College students, 18–25 years',
    fee: '₹100',
    prize: '₹15,000',
    rules: [
      'Teams must consist of 2–4 members.',
      'Participants must bring their own laptops.',
      'Use of unauthorized external solutions is prohibited.',
      'All submissions must be made before the deadline.',
      'Judges\' decisions will be final.',
    ],
  },
  treasure: {
    num: '02',
    title: 'TREASURE HUNT',
    desc: 'A thrilling adventure combining logic, teamwork, observation, and problem-solving. Follow clues, overcome challenges, and race against other teams to uncover the ultimate treasure.',
    date: '13 October 2026',
    time: '11:00 AM – 2:00 PM',
    venue: 'GEHU Campus – Main Block',
    team: '3–5 members',
    eligibility: 'All college students',
    fee: '₹150 per team',
    prize: '₹10,000',
    rules: [
      'Each team must have 3–5 members.',
      'Teams must follow the clues in sequence.',
      'No outside assistance is permitted.',
      'Participants must follow campus safety guidelines.',
      'The first team to reach the final checkpoint wins.',
    ],
  },
  esports: {
    num: '03',
    title: 'E-SPORTS',
    desc: 'Experience the ultimate competitive gaming arena where strategy, teamwork, reflexes, and skill come together. Compete against fellow gamers, climb the leaderboard, and battle for victory.',
    date: '12 October 2026',
    time: '2:00 PM – 7:00 PM',
    venue: 'Gaming Arena – Block B',
    team: '1–5 members',
    eligibility: 'Students aged 17+',
    fee: '₹200 per team',
    prize: '₹20,000',
    rules: [
      'Players must register using their official gaming accounts.',
      'Cheating, hacks, scripts, or exploits are strictly prohibited.',
      'Players must report at the venue 30 minutes before their match.',
      'Match results verified by organizers are final.',
      'Any misconduct may result in immediate disqualification.',
    ],
  },
  ctf: {
    num: '04',
    title: 'CTF',
    desc: 'Put your cybersecurity skills to the test through a series of challenges covering cryptography, web security, forensics, reverse engineering, and more. Find the flags, crack the challenges, and prove your skills.',
    date: '13 October 2026',
    time: '9:30 AM – 4:30 PM',
    venue: 'Cyber Security Lab',
    team: '1–3 members',
    eligibility: 'College students with basic cybersecurity knowledge',
    fee: '₹100 per team',
    prize: '₹18,000',
    rules: [
      'Teams can have a maximum of 3 participants.',
      'Challenges must be solved within the competition environment.',
      'Attacking the event infrastructure is prohibited.',
      'Sharing flags or solutions with other teams is not allowed.',
      'The team with the highest score at the end wins.',
    ],
  },
  workshop: {
    num: '05',
    title: 'WORKSHOP',
    desc: 'An interactive learning experience designed to bridge the gap between theory and practical skills. Learn from experts, explore emerging technologies, and gain hands-on experience through engaging activities.',
    date: '12 October 2026',
    time: '10:30 AM – 1:00 PM',
    venue: 'Seminar Hall – Block A',
    team: 'Individual',
    eligibility: 'Open to all college students',
    fee: '₹50',
    prize: 'N/A',
    rules: [
      'Participants must register individually.',
      'Participants should arrive 15 minutes before the session.',
      'Attendees should carry a laptop if required for practical activities.',
      'Participants must follow instructions given by the workshop mentor.',
      'Certificates will be provided to all registered participants.',
    ],
  },
};

// ─────────────────────────────────────────────────────
// CARD TIMELINE (LOCKED)
// ─────────────────────────────────────────────────────
const CARD_TIMELINE = [
  {
    id: 'card-hackathon', event: 'hackathon', side: 'left',
    s0: 0.08, s1: 0.17, e0: 0.22, e1: 0.29,
    enterX: -130, enterY: 24, rot: -4, driftY: -9, driftDir: -1,
  },
  {
    id: 'card-treasure', event: 'treasure', side: 'right',
    s0: 0.29, s1: 0.38, e0: 0.43, e1: 0.50,
    enterX: 130, enterY: -20, rot: 4, driftY: 9, driftDir: 1,
  },
  {
    id: 'card-esports', event: 'esports', side: 'left',
    s0: 0.50, s1: 0.59, e0: 0.64, e1: 0.71,
    enterX: -130, enterY: 18, rot: -3.5, driftY: -6, driftDir: -1,
  },
  {
    id: 'card-ctf', event: 'ctf', side: 'right',
    s0: 0.71, s1: 0.80, e0: 0.84, e1: 0.91,
    enterX: 130, enterY: -24, rot: 3.5, driftY: 7, driftDir: -1,
  },
  {
    id: 'card-workshop', event: 'workshop', side: 'right',
    s0: 0.91, s1: 0.97, e0: 0.99, e1: 1.00,
    enterX: 130, enterY: 20, rot: 4, driftY: 9, driftDir: 1,
  },
];

// Cache DOM references
const cardEls = {};
const shimmerEls = {};
const shimmerRan = {};

CARD_TIMELINE.forEach(t => {
  const el = document.getElementById(t.id);
  cardEls[t.id] = el;
  shimmerEls[t.id] = el ? el.querySelector('.card-shimmer') : null;
  shimmerRan[t.id] = false;
});

// ─────────────────────────────────────────────────────
// EASING FUNCTIONS (LOCKED)
// ─────────────────────────────────────────────────────
function easeOutCubic(t) {
  t = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  t = Math.max(0, Math.min(1, t));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─────────────────────────────────────────────────────
// CARD ANIMATION ENGINE (LOCKED)
// Three phases: in → hold → out
// ─────────────────────────────────────────────────────
function updateCards(sf) {
  CARD_TIMELINE.forEach(t => {
    const el = cardEls[t.id];
    if (!el) return;

    // ── Phase detection ──────────────────────────────
    let fadeInProg = 0;
    let holdProg = 0;
    let fadeOutProg = 0;
    let phase = 'none';

    if (sf >= t.s0 && sf < t.s1) {
      fadeInProg = (sf - t.s0) / (t.s1 - t.s0);
      phase = 'in';
    } else if (sf >= t.s1 && sf < t.e0) {
      holdProg = (sf - t.s1) / (t.e0 - t.s1);
      phase = 'hold';
    } else if (sf >= t.e0 && sf < t.e1) {
      fadeOutProg = (sf - t.e0) / (t.e1 - t.e0);
      phase = 'out';
    }

    // ── Opacity ──────────────────────────────────────
    let op = 0;
    if (phase === 'in') op = easeOutCubic(fadeInProg);
    if (phase === 'hold') op = 1;
    if (phase === 'out') op = 1 - easeInOutCubic(fadeOutProg);
    op = Math.max(0, Math.min(1, op));

    // ── Transform ────────────────────────────────────
    let slideX = 0;
    let slideY = 0;
    let rot = 0;
    let scale = 1;

    if (phase === 'in') {
      const p = easeOutCubic(fadeInProg);
      slideX = t.enterX * (1 - p);
      slideY = t.enterY * (1 - p);
      rot = t.rot * (1 - p);
      scale = 0.90 + 0.10 * p;
    } else if (phase === 'hold') {
      slideX = 0;
      slideY = holdProg * t.driftY * t.driftDir - 6;
      rot = 0;
      scale = 1;
    } else if (phase === 'out') {
      const p = easeInOutCubic(fadeOutProg);
      slideX = (-t.enterX * 0.45) * p;
      slideY = (t.driftY * t.driftDir) - 6 + (t.enterY * 0.35 * p);
      rot = (-t.rot * 0.55) * p;
      scale = 1 - 0.05 * p;
    }

    // ── Apply ─────────────────────────────────────────
    el.style.opacity = op;
    el.style.transform = [
      `translateY(calc(-50% + ${slideY.toFixed(2)}px))`,
      `translateX(${slideX.toFixed(2)}px)`,
      `scale(${scale.toFixed(4)})`,
      `rotateZ(${rot.toFixed(3)}deg)`,
    ].join(' ');

    // ── Pointer events ────────────────────────────────
    if (op > 0.1) {
      el.classList.add('card-active');
    } else {
      el.classList.remove('card-active');
    }

    // ── Shimmer — fires once at ~40% fade-in ─────────
    const shimEl = shimmerEls[t.id];
    if (shimEl && !shimmerRan[t.id] && phase === 'in' && fadeInProg >= 0.4) {
      shimmerRan[t.id] = true;
      shimEl.classList.remove('shimmer-run');
      void shimEl.offsetWidth; // force reflow
      shimEl.classList.add('shimmer-run');
    }
    if (phase === 'none') {
      shimmerRan[t.id] = false;
      if (shimEl) shimEl.classList.remove('shimmer-run');
    }
  });
}

// ─────────────────────────────────────────────────────
// SCROLL → FRACTION (Embedded Runway Precision)
// ─────────────────────────────────────────────────────
function getScrollFraction() {
  const scrollContainer = document.getElementById('scroll-container') || document.getElementById('events');
  if (!scrollContainer) {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
  }

  const rect = scrollContainer.getBoundingClientRect();
  const total = scrollContainer.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  const current = -rect.top;
  return Math.max(0, Math.min(1, current / total));
}

function onScroll() {
  const sf = getScrollFraction();

  if (loaded) {
    targetFrame = sf * (totalFrames - 1);
    if (rafId === null) {
      rafId = requestAnimationFrame(renderLoop);
    }
  }

  updateCards(sf);
  updateNavbar();
  highlightActiveNav();
}

// ─────────────────────────────────────────────────────
// RENDER LOOP — eased frame interpolation (LOCKED)
// ─────────────────────────────────────────────────────
function renderLoop() {
  const diff = targetFrame - currentFrame;

  if (Math.abs(diff) < 0.0008) {
    currentFrame = targetFrame;
    drawFrame(currentFrame);
    rafId = null;
    return;
  }

  currentFrame += diff * EASE;
  drawFrame(currentFrame);
  rafId = requestAnimationFrame(renderLoop);
}

// ─────────────────────────────────────────────────────
// DRAW FRAME — cross-fade between adjacent frames (LOCKED)
// ─────────────────────────────────────────────────────
function drawFrame(indexFloat) {
  const i0 = Math.floor(indexFloat);
  const i1 = Math.min(i0 + 1, totalFrames - 1);
  const mix = indexFloat - i0;

  const f0 = frames[i0];
  const f1 = frames[i1];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (f0 && f0.complete) {
    ctx.globalAlpha = 1;
    ctx.drawImage(f0, 0, 0, canvas.width, canvas.height);
  }

  if (mix > 0.002 && f1 && f1.complete) {
    ctx.globalAlpha = mix;
    ctx.drawImage(f1, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }
}

// ─────────────────────────────────────────────────────
// LOADING PROGRESS BAR (LOCKED)
// ─────────────────────────────────────────────────────
function drawLoadingBar(n, total) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bw = 360, bh = 2;
  const bx = (canvas.width - bw) / 2;
  const by = (canvas.height - bh) / 2;

  ctx.fillStyle = '#111';
  ctx.fillRect(bx, by, bw, bh);

  ctx.fillStyle = '#F97316';
  ctx.fillRect(bx, by, bw * (n / total), bh);
}

// ─────────────────────────────────────────────────────
// PRELOAD — all 240 frames (LOCKED)
// ─────────────────────────────────────────────────────
function preload() {
  let count = 0;
  drawLoadingBar(0, totalFrames);

  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const padded = String(i).padStart(3, '0');
    img.src = `frames/ezgif-frame-${padded}.jpg`;

    const onDone = () => {
      count++;
      drawLoadingBar(count, totalFrames);

      if (count === totalFrames) {
        loaded = true;
        const sf = getScrollFraction();
        currentFrame = sf * (totalFrames - 1);
        targetFrame = currentFrame;
        drawFrame(currentFrame);
      }
    };

    img.onload = onDone;
    img.onerror = onDone;
    frames.push(img);
  }
}

// ─────────────────────────────────────────────────────
// EVENT MODAL (LOCKED)
// ─────────────────────────────────────────────────────
const modalOverlay = document.getElementById('event-modal');
const modalClose = document.getElementById('modal-close-btn');
const mNum = document.getElementById('modal-num');
const mTitle = document.getElementById('modal-event-title');
const mDesc = document.getElementById('modal-desc');
const mDate = document.getElementById('modal-date');
const mTime = document.getElementById('modal-time');
const mVenue = document.getElementById('modal-venue');
const mTeam = document.getElementById('modal-team');
const mEligibility = document.getElementById('modal-eligibility');
const mFee = document.getElementById('modal-fee');
const mPrize = document.getElementById('modal-prize');
const mRules = document.getElementById('modal-rules');
const btnEventModalRegister = document.getElementById('btn-register');

function openModal(key) {
  const d = EVENT_DATA[key];
  if (!d) return;

  mNum.textContent = d.num;
  mTitle.textContent = d.title;
  mDesc.textContent = d.desc;

  mDate.textContent = d.date;
  mTime.textContent = d.time;
  mVenue.textContent = d.venue;
  mTeam.textContent = d.team;
  mEligibility.textContent = d.eligibility;
  mFee.textContent = d.fee;
  mPrize.textContent = d.prize;

  mRules.innerHTML = '';
  d.rules.forEach(rule => {
    const li = document.createElement('li');
    li.textContent = rule;
    mRules.appendChild(li);
  });

  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('modal-open');
  document.body.classList.add('no-scroll');
  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.remove('modal-open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modalOverlay.classList.contains('modal-open')) closeModal();
    if (regModal && regModal.classList.contains('modal-open')) closeRegModal();
  }
});

// Card → modal
document.querySelectorAll('.event-card').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.event));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.event);
    }
  });
});

// Event Modal register button → opens quick register modal
if (btnEventModalRegister) {
  btnEventModalRegister.addEventListener('click', () => {
    closeModal();
    openRegModal();
  });
}

// ─────────────────────────────────────────────────────
// NAVBAR BEHAVIOR & ACTIVE SECTION HIGHLIGHTING
// ─────────────────────────────────────────────────────
const headerEl = document.getElementById('site-header');

function updateNavbar() {
  if (window.scrollY > 30) {
    headerEl.classList.add('scrolled');
  } else {
    headerEl.classList.remove('scrolled');
  }
}

function highlightActiveNav() {
  let currentSectionId = '';
  const scrollPos = window.scrollY + 180;

  document.querySelectorAll('section[id], div[id="events"], div[id="scroll-container"]').forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      currentSectionId = sec.getAttribute('id') === 'scroll-container' ? 'events' : sec.getAttribute('id');
    }
  });

  if (!currentSectionId && window.scrollY < 300) {
    currentSectionId = 'hero';
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
}

// ─────────────────────────────────────────────────────
// MOBILE MENU TOGGLE
// ─────────────────────────────────────────────────────
const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
const mobileDrawer = document.getElementById('mobile-drawer');

if (mobileToggleBtn && mobileDrawer) {
  mobileToggleBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.remove('open');
      mobileToggleBtn.classList.remove('open');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileDrawer.classList.add('open');
      mobileToggleBtn.classList.add('open');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileToggleBtn.classList.remove('open');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ─────────────────────────────────────────────────────
// SCHEDULE DAY 1 / DAY 2 TABS
// ─────────────────────────────────────────────────────
const tabDay1 = document.getElementById('tab-day1');
const tabDay2 = document.getElementById('tab-day2');
const panelDay1 = document.getElementById('panel-day1');
const panelDay2 = document.getElementById('panel-day2');

function switchDayTab(day) {
  if (day === 1) {
    tabDay1.classList.add('active');
    tabDay1.setAttribute('aria-selected', 'true');
    tabDay2.classList.remove('active');
    tabDay2.setAttribute('aria-selected', 'false');

    panelDay1.classList.add('active');
    panelDay2.classList.remove('active');
  } else {
    tabDay2.classList.add('active');
    tabDay2.setAttribute('aria-selected', 'true');
    tabDay1.classList.remove('active');
    tabDay1.setAttribute('aria-selected', 'false');

    panelDay2.classList.add('active');
    panelDay1.classList.remove('active');
  }
}

if (tabDay1 && tabDay2) {
  tabDay1.addEventListener('click', () => switchDayTab(1));
  tabDay2.addEventListener('click', () => switchDayTab(2));
}

// ─────────────────────────────────────────────────────
// QUICK REGISTRATION MODAL
// ─────────────────────────────────────────────────────
const regModal = document.getElementById('quick-register-modal');
const regModalClose = document.getElementById('reg-modal-close-btn');
const regForm = document.getElementById('registration-form');
const regSuccessBox = document.getElementById('reg-success-box');
const btnCloseSuccess = document.getElementById('btn-close-success');

const registerTriggers = [
  document.getElementById('btn-open-register'),
  document.getElementById('hero-btn-register'),
  document.getElementById('cta-btn-register'),
  document.getElementById('mobile-btn-register'),
];

function openRegModal() {
  if (!regModal) return;
  regModal.setAttribute('aria-hidden', 'false');
  regModal.classList.add('modal-open');
  document.body.classList.add('no-scroll');
  if (regForm) regForm.style.display = 'block';
  if (regSuccessBox) regSuccessBox.style.display = 'none';
  const nameInput = document.getElementById('reg-fullname');
  if (nameInput) nameInput.focus();
}

function closeRegModal() {
  if (!regModal) return;
  regModal.classList.remove('modal-open');
  regModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

registerTriggers.forEach(btn => {
  if (btn) {
    btn.addEventListener('click', openRegModal);
  }
});

if (regModalClose) {
  regModalClose.addEventListener('click', closeRegModal);
}

if (regModal) {
  regModal.addEventListener('click', e => {
    if (e.target === regModal) closeRegModal();
  });
}

if (regForm) {
  regForm.addEventListener('submit', e => {
    e.preventDefault();
    regForm.style.display = 'none';
    if (regSuccessBox) regSuccessBox.style.display = 'block';
  });
}

if (btnCloseSuccess) {
  btnCloseSuccess.addEventListener('click', () => {
    closeRegModal();
    if (regForm) regForm.reset();
  });
}

// ─────────────────────────────────────────────────────
// BOOT — register listeners before preload completes (LOCKED)
// ─────────────────────────────────────────────────────
updateCards(getScrollFraction());
updateNavbar();
highlightActiveNav();

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
  onScroll();
  if (window.lucide) window.lucide.createIcons();
}, { passive: true });

preload();
