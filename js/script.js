/**
 * ===================================================================
 * 🌸 BIRTHDAY SURPRISE CELEBRATION SCRIPTS
 * 🎂 Full-Screen Welcome Screen, Countdown, Melody & Interactions
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initWelcomeScreen();
  initFloatingElements();
  initPetals();
  initCountdown();
  initCakeInteractions();
  initConfettiButtons();
  initMusicSynthesis();
  initFloatingMusicPill();
});

/* -------------------------------------------------------------------
 * 💌 Full-Screen Welcome Screen & Surprise Reveal
 * ------------------------------------------------------------------- */
function initWelcomeScreen() {
  const welcomeScreen = document.getElementById('welcomeScreen');
  const openBtn = document.getElementById('openSurpriseBtn');
  const replayBtn = document.getElementById('replaySurpriseBtn');

  if (!welcomeScreen || !openBtn) return;

  // Prevent background scrolling while welcome screen is active
  document.body.style.overflow = 'hidden';

  openBtn.addEventListener('click', () => {
    // 1. Trigger celebration burst (confetti + hearts)
    triggerSurpriseCelebration();

    // 2. Start happy birthday melody on interaction
    startBirthdayMelody();

    // 3. Smooth reveal transition
    welcomeScreen.classList.add('revealed');
    document.body.style.overflow = ''; // Unlock scrolling

    // 4. Smooth scroll to top of celebration
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  });

  // Replay intro function
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      welcomeScreen.classList.remove('revealed');
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function triggerSurpriseCelebration() {
  // Fire dual confetti from left and right
  triggerConfetti(window.innerWidth * 0.25, window.innerHeight * 0.5);
  triggerConfetti(window.innerWidth * 0.75, window.innerHeight * 0.5);
  setTimeout(() => {
    triggerConfetti(window.innerWidth * 0.5, window.innerHeight * 0.3);
  }, 400);
}

/* -------------------------------------------------------------------
 * 🌸 Floating Flower Petals Generator
 * ------------------------------------------------------------------- */
function initPetals() {
  const container = document.getElementById('welcomePetals');
  if (!container) return;

  const petals = ['🌸', '🌺', '🌷', '✨', '💐', '💖'];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement('div');
    el.className = 'welcome-petal';
    el.innerText = petals[Math.floor(Math.random() * petals.length)];
    el.style.left = `${Math.random() * 95}%`;
    el.style.animationDuration = `${7 + Math.random() * 8}s`;
    el.style.animationDelay = `${Math.random() * 8}s`;
    el.style.fontSize = `${1.1 + Math.random() * 1.3}rem`;
    container.appendChild(el);
  }
}

/* -------------------------------------------------------------------
 * ⏳ Birthday Countdown Timer
 * ------------------------------------------------------------------- */
function initCountdown() {
  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minutesEl = document.getElementById('countdownMinutes');
  const secondsEl = document.getElementById('countdownSeconds');
  const bannerEl = document.getElementById('countdownBanner');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Set the target date: Current or upcoming birthday
  const now = new Date();
  let targetYear = now.getFullYear();
  // Target birthday: e.g. Oct 4 or upcoming date
  let birthdayDate = new Date(targetYear, now.getMonth(), now.getDate(), 23, 59, 59);

  // If today is the birthday!
  function updateTimer() {
    const current = new Date();
    const diff = birthdayDate - current;

    if (diff <= 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minutesEl.innerText = '00';
      secondsEl.innerText = '00';
      if (bannerEl) bannerEl.classList.add('active');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minutesEl.innerText = String(minutes).padStart(2, '0');
    secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* -------------------------------------------------------------------
 * 🎈 Floating Pastel Balloons, Hearts and Sparkles
 * ------------------------------------------------------------------- */
function initFloatingElements() {
  const container = document.getElementById('floatingContainer');
  if (!container) return;

  const icons = ['💗', '✨', '🌸', '🎈', '💖', '⭐', '🎂', '💜'];

  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.className = 'floating-item';
    el.innerText = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = `${Math.random() * 96}%`;
    el.style.animationDelay = `${Math.random() * 12}s`;
    el.style.animationDuration = `${10 + Math.random() * 10}s`;
    el.style.fontSize = `${1.2 + Math.random() * 1.5}rem`;
    container.appendChild(el);
  }
}

/* -------------------------------------------------------------------
 * 🎂 Interactive Cake with Blowable Candles
 * ------------------------------------------------------------------- */
function initCakeInteractions() {
  const cake = document.getElementById('interactiveCake');
  const candle = document.getElementById('cakeCandle');
  const promptText = document.getElementById('cakePrompt');

  if (!cake || !candle) return;

  let isBlown = false;

  cake.addEventListener('click', () => {
    if (!isBlown) {
      candle.classList.add('blown');
      isBlown = true;
      if (promptText) {
        promptText.innerHTML = '🎉 Make a Wish! May all your dreams come true, Leela Akka! 🌟';
        promptText.style.background = '#dcfce7';
        promptText.style.color = '#15803d';
      }
      triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.7);
    } else {
      candle.classList.remove('blown');
      isBlown = false;
      if (promptText) {
        promptText.innerText = '✨ Click the cake to blow the candle! ✨';
        promptText.style.background = 'var(--lavender-100)';
        promptText.style.color = 'var(--lavender-deep)';
      }
    }
  });
}

/* -------------------------------------------------------------------
 * 🎊 Confetti & Heart Particles Explosion
 * ------------------------------------------------------------------- */
function triggerConfetti(originX, originY) {
  const count = 70;
  const colors = ['#f472b6', '#c084fc', '#fde047', '#60a5fa', '#fbcfe8', '#e9d5ff', '#fff', '#fda4af'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${originX || window.innerWidth / 2}px`;
    particle.style.top = `${originY || window.innerHeight / 2}px`;
    particle.style.width = `${7 + Math.random() * 9}px`;
    particle.style.height = `${7 + Math.random() * 9}px`;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = Math.random() > 0.4 ? '50%' : '2px';
    particle.style.zIndex = '999999';
    particle.style.pointerEvents = 'none';

    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 260;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 80;

    const anim = particle.animate([
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${destX}px, ${destY}px) scale(0.5) rotate(${Math.random() * 900}deg)`, opacity: 0 }
    ], {
      duration: 1300 + Math.random() * 700,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    });

    anim.onfinish = () => particle.remove();
  }
}

function initConfettiButtons() {
  const btn = document.getElementById('showerLoveBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      triggerConfetti(e.clientX, e.clientY);
    });
  }
}

/* -------------------------------------------------------------------
 * 🎵 Soft Ambient Happy Birthday Melody (Web Audio API Synthesizer)
 * Pure JS sound synthesizer without external audio files!
 * ------------------------------------------------------------------- */
let audioCtx = null;
let isPlayingMelody = false;
let melodyTimeout = null;

function startBirthdayMelody() {
  if (isPlayingMelody) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  isPlayingMelody = true;
  updateMusicUI(true);
  playHappyBirthdayNotes();
}

function toggleBirthdayMelody() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (isPlayingMelody) {
    isPlayingMelody = false;
    clearTimeout(melodyTimeout);
    updateMusicUI(false);
  } else {
    isPlayingMelody = true;
    updateMusicUI(true);
    playHappyBirthdayNotes();
  }
}

function updateMusicUI(isPlaying) {
  const musicBtn = document.getElementById('musicToggleBtn');
  const floatingPill = document.getElementById('floatingMusicPill');
  const disc = document.getElementById('musicDisc');

  if (musicBtn) {
    musicBtn.innerHTML = isPlaying ? '⏸ Pause Melody' : '🎵 Play Birthday Melody';
  }
  if (floatingPill) {
    const textEl = floatingPill.querySelector('.music-text');
    if (textEl) textEl.innerText = isPlaying ? 'Playing Birthday Song 🎶' : 'Play Music 🎵';
  }
  if (disc) {
    if (isPlaying) disc.classList.add('spinning');
    else disc.classList.remove('spinning');
  }
}

function initMusicSynthesis() {
  const musicBtn = document.getElementById('musicToggleBtn');
  if (musicBtn) {
    musicBtn.addEventListener('click', toggleBirthdayMelody);
  }
}

function initFloatingMusicPill() {
  const pill = document.getElementById('floatingMusicPill');
  if (pill) {
    pill.addEventListener('click', toggleBirthdayMelody);
  }
}

function playTone(freq, duration) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle'; // Warm, soft musical tone
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playHappyBirthdayNotes() {
  if (!isPlayingMelody) return;

  // Happy Birthday in C Major notes and timings
  const notes = [
    { f: 261.63, d: 0.35 }, // C4
    { f: 261.63, d: 0.25 }, // C4
    { f: 293.66, d: 0.6 },  // D4
    { f: 261.63, d: 0.6 },  // C4
    { f: 349.23, d: 0.6 },  // F4
    { f: 329.63, d: 1.1 },  // E4

    { f: 261.63, d: 0.35 }, // C4
    { f: 261.63, d: 0.25 }, // C4
    { f: 293.66, d: 0.6 },  // D4
    { f: 261.63, d: 0.6 },  // C4
    { f: 392.00, d: 0.6 },  // G4
    { f: 349.23, d: 1.1 },  // F4

    { f: 261.63, d: 0.35 }, // C4
    { f: 261.63, d: 0.25 }, // C4
    { f: 523.25, d: 0.6 },  // C5
    { f: 440.00, d: 0.6 },  // A4
    { f: 349.23, d: 0.6 },  // F4
    { f: 329.63, d: 0.6 },  // E4
    { f: 293.66, d: 0.9 },  // D4

    { f: 466.16, d: 0.35 }, // Bb4
    { f: 466.16, d: 0.25 }, // Bb4
    { f: 440.00, d: 0.6 },  // A4
    { f: 349.23, d: 0.6 },  // F4
    { f: 392.00, d: 0.6 },  // G4
    { f: 349.23, d: 1.4 }   // F4
  ];

  let currentTime = 0;
  notes.forEach((note) => {
    setTimeout(() => {
      if (isPlayingMelody) playTone(note.f, note.d);
    }, currentTime * 1000);
    currentTime += note.d + 0.12;
  });

  melodyTimeout = setTimeout(() => {
    if (isPlayingMelody) {
      playHappyBirthdayNotes(); // Loop melody
    }
  }, (currentTime + 1) * 1000);
}

// Helper to open photo destination guide modal or alert
window.showFolderInstructions = function() {
  alert(
    "📸 WHERE YOUR SISTER'S PHOTOS ARE STORED:\n\n" +
    "All 6 photos are loaded from:\n" +
    "F:\\Python_Practice\\first\\assets\\photos\\\n\n" +
    "Files:\n" +
    "• photo1.jpg (First photo.jpeg)\n" +
    "• photo2.jpg (Second photo.jpeg)\n" +
    "• photo3.jpg (Third photo.jpeg)\n" +
    "• photo4.jpg (Fourth photo.jpeg)\n" +
    "• photo5.jpg (Fifth photo.jpeg)\n" +
    "• photo6.jpg (Sixth photo.jpeg)\n\n" +
    "You can also click '➕ Add Photo' anytime to add more photos directly!"
  );
};

// Helper to toggle full collage grid view
window.toggleGridView = function() {
  const grid = document.getElementById('gridCollapsible');
  const btn = document.getElementById('gridToggleBtn');
  if (!grid) return;
  if (grid.style.display === 'none' || grid.style.display === '') {
    grid.style.display = 'block';
    if (btn) btn.innerHTML = '<span>🖼️</span> Hide Collage View';
    grid.scrollIntoView({ behavior: 'smooth' });
  } else {
    grid.style.display = 'none';
    if (btn) btn.innerHTML = '<span>🖼️</span> View Collage View';
  }
};

