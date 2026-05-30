/* =========================================================
   script.js — Maison Lumière
   ========================================================= */

/* ---- Theme Toggle ---- */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const updateThemeUI = () => {
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  themeToggle.setAttribute('aria-pressed', currentTheme === 'light');
};

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);
  updateThemeUI();
});

updateThemeUI();

/* ---- Nav: scroll behavior ---- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- Nav: mobile hamburger ---- */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ---- IntersectionObserver: fade-in on scroll ---- */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => {
  if (!el.closest('#hero')) {
    fadeObserver.observe(el);
  }
});

/* ---- Testimonial Carousel ---- */
const track    = document.getElementById('carousel-track');
const dots     = document.querySelectorAll('.dot');
const prevBtn  = document.getElementById('prev-btn');
const nextBtn  = document.getElementById('next-btn');
const total    = dots.length;
let current    = 0;
let autoTimer  = null;

function goToSlide(index) {
  current = (index + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((dot, i) => {
    const active = i === current;
    dot.classList.toggle('active', active);
    dot.setAttribute('aria-pressed', String(active));
  });
}

function startAuto() {
  autoTimer = setInterval(() => goToSlide(current + 1), 5000);
}

function resetAuto() {
  clearInterval(autoTimer);
  startAuto();
}

prevBtn.addEventListener('click', () => { goToSlide(current - 1); resetAuto(); });
nextBtn.addEventListener('click', () => { goToSlide(current + 1); resetAuto(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index, 10));
    resetAuto();
  });
});

startAuto();

/* ---- Reservation Form ---- */
const form        = document.getElementById('reservation-form');
const formSuccess = document.getElementById('form-success');
const successMsg  = document.getElementById('success-message');
const dateInput   = document.getElementById('date');

// Prevent past-date selection
const todayISO = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', todayISO);

function setError(fieldKey, message) {
  const errorEl = document.getElementById(`error-${fieldKey}`);
  const inputId = fieldKey === 'name' ? 'full-name' : fieldKey;
  const inputEl = document.getElementById(inputId);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.add('error');
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
  document.querySelectorAll('input.error, select.error').forEach(el => el.classList.remove('error'));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatDisplayDate(isoDate) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

function formatDisplayTime(value) {
  const [h, m] = value.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const name   = document.getElementById('full-name').value.trim();
  const email  = document.getElementById('email').value.trim();
  const phone  = document.getElementById('phone').value.trim();
  const guests = parseInt(document.getElementById('guests').value, 10);
  const date   = document.getElementById('date').value;
  const time   = document.getElementById('time').value;

  let valid = true;

  if (!name) {
    setError('name', 'Please enter your full name.');
    valid = false;
  }

  if (!email) {
    setError('email', 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setError('email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!phone) {
    setError('phone', 'Please enter your phone number.');
    valid = false;
  }

  if (!guests || guests < 1 || guests > 20) {
    setError('guests', 'Please enter a number between 1 and 20.');
    valid = false;
  }

  if (!date) {
    setError('date', 'Please select a preferred date.');
    valid = false;
  } else if (date < todayISO) {
    setError('date', 'Please select a date from today onwards.');
    valid = false;
  }

  if (!time) {
    setError('time', 'Please select a preferred time.');
    valid = false;
  }

  if (!valid) return;

  const guestWord = guests === 1 ? 'guest' : 'guests';
  successMsg.textContent =
    `Thank you, ${name}! Your reservation request for ${guests} ${guestWord} ` +
    `on ${formatDisplayDate(date)} at ${formatDisplayTime(time)} has been received.`;

  form.hidden = true;
  formSuccess.hidden = false;
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  form.reset();
});

/* ---- Contact Form ---- */
const contactForm    = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
const contactSuccessMsg = document.getElementById('contact-success-message');

function setContactError(fieldKey, message) {
  const errorEl = document.getElementById(`error-${fieldKey}`);
  const inputEl = document.getElementById(fieldKey);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.add('error');
}

function clearContactErrors() {
  document.querySelectorAll('#contact-form .field-error').forEach(el => { el.textContent = ''; });
  document.querySelectorAll('#contact-form input.error, #contact-form select.error, #contact-form textarea.error').forEach(el => el.classList.remove('error'));
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearContactErrors();

  const name    = document.getElementById('contact-name').value.trim();
  const email   = document.getElementById('contact-email').value.trim();
  const phone   = document.getElementById('contact-phone').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('contact-message').value.trim();

  let valid = true;

  if (!name) {
    setContactError('contact-name', 'Please enter your full name.');
    valid = false;
  }

  if (!email) {
    setContactError('contact-email', 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setContactError('contact-email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!subject) {
    setContactError('subject', 'Please select a subject.');
    valid = false;
  }

  if (!message) {
    setContactError('contact-message', 'Please enter your message.');
    valid = false;
  } else if (message.length < 10) {
    setContactError('contact-message', 'Please enter at least 10 characters.');
    valid = false;
  }

  if (!valid) return;

  contactSuccessMsg.textContent =
    `Thank you, ${name}! We've received your message and will get back to you shortly.`;

  contactForm.hidden = true;
  contactSuccess.hidden = false;
  contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  contactForm.reset();
});
