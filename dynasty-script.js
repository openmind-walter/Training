// ===========================
// NAVIGATION & HAMBURGER MENU
// ===========================

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===========================
// SCROLL ANIMATIONS (Intersection Observer)
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements (skip hero)
document.querySelectorAll('.fade-in').forEach(el => {
    if (!el.closest('#hero')) {
        fadeInObserver.observe(el);
    }
});

// ===========================
// CAROUSEL (Testimonials)
// ===========================

const carousel = document.getElementById('carousel');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

let currentSlide = 0;

function goToSlide(n) {
    const cards = document.querySelectorAll('.testimonial-card');
    if (n >= cards.length) currentSlide = 0;
    if (n < 0) currentSlide = cards.length - 1;

    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

prevBtn.addEventListener('click', () => {
    currentSlide--;
    goToSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
    currentSlide++;
    goToSlide(currentSlide);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        goToSlide(currentSlide);
    });
});

// Auto-rotate carousel every 8 seconds
setInterval(() => {
    currentSlide++;
    goToSlide(currentSlide);
}, 8000);

// Smooth carousel transitions
carousel.style.transition = 'transform 0.6s ease-in-out';

// ===========================
// FORM VALIDATION
// ===========================

const form = document.getElementById('reservationForm');
const nameInput = document.getElementById('guest-name');
const emailInput = document.getElementById('guest-email');
const phoneInput = document.getElementById('guest-phone');
const dateInput = document.getElementById('guest-date');
const timeInput = document.getElementById('guest-time');
const guestsInput = document.getElementById('guest-count');
const successMessage = document.getElementById('success-message');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

function setError(fieldKey, message) {
    const input = document.getElementById(fieldKey === 'name' ? 'guest-name' : 'guest-' + fieldKey);
    const errorSpan = document.getElementById('error-' + fieldKey);

    if (message) {
        input.classList.add('error');
        errorSpan.textContent = message;
        errorSpan.classList.add('show');
    } else {
        input.classList.remove('error');
        errorSpan.textContent = '';
        errorSpan.classList.remove('show');
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm() {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('input, select').forEach(el => {
        el.classList.remove('error');
    });
    document.querySelectorAll('.field-error').forEach(el => {
        el.classList.remove('show');
    });

    // Name validation
    if (!nameInput.value.trim()) {
        setError('name', 'Name is required');
        isValid = false;
    }

    // Email validation
    if (!emailInput.value.trim()) {
        setError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        setError('email', 'Please enter a valid email');
        isValid = false;
    }

    // Phone validation
    if (!phoneInput.value.trim()) {
        setError('phone', 'Phone number is required');
        isValid = false;
    }

    // Date validation
    if (!dateInput.value) {
        setError('date', 'Date is required');
        isValid = false;
    } else {
        const selectedDate = new Date(dateInput.value);
        const todayDate = new Date(today);
        if (selectedDate < todayDate) {
            setError('date', 'Please select today or a future date');
            isValid = false;
        }
    }

    // Time validation
    if (!timeInput.value) {
        setError('time', 'Time is required');
        isValid = false;
    }

    // Guests validation
    const guests = parseInt(guestsInput.value);
    if (!guestsInput.value) {
        setError('guests', 'Number of guests is required');
        isValid = false;
    } else if (guests < 1 || guests > 12) {
        setError('guests', 'Please enter 1-12 guests');
        isValid = false;
    }

    return isValid;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
        const guestName = nameInput.value;
        const guestCount = guestsInput.value;
        const reservationDate = dateInput.value;
        const reservationTime = timeInput.value;

        // Show success message
        successMessage.innerHTML = `✓ Thank you, ${guestName}! Your reservation for ${guestCount} guest(s) on ${reservationDate} at ${reservationTime} has been confirmed. We look forward to welcoming you to Dynasty!`;
        successMessage.classList.add('show');

        // Reset form
        form.reset();
        dateInput.setAttribute('min', today);

        // Hide success message after 8 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 8000);
    }
});

// Real-time validation feedback
emailInput.addEventListener('blur', () => {
    if (emailInput.value && !validateEmail(emailInput.value)) {
        setError('email', 'Please enter a valid email');
    } else {
        setError('email', '');
    }
});

dateInput.addEventListener('change', () => {
    if (dateInput.value) {
        const selectedDate = new Date(dateInput.value);
        const todayDate = new Date(today);
        if (selectedDate < todayDate) {
            setError('date', 'Please select today or a future date');
        } else {
            setError('date', '');
        }
    }
});

guestsInput.addEventListener('blur', () => {
    const guests = parseInt(guestsInput.value);
    if (guestsInput.value && (guests < 1 || guests > 12)) {
        setError('guests', 'Please enter 1-12 guests');
    } else {
        setError('guests', '');
    }
});

// ===========================
// SMOOTH SCROLL HEADER EFFECT
// ===========================

const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 50) {
        navbar.style.background = 'linear-gradient(180deg, rgba(13, 13, 13, 0.98) 0%, rgba(13, 13, 13, 0.95) 100%)';
        navbar.style.boxShadow = '0 2px 16px rgba(139, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'linear-gradient(180deg, rgba(13, 13, 13, 0.95) 0%, rgba(13, 13, 13, 0.8) 100%)';
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
});

// ===========================
// PARALLAX EFFECT (subtle, performance-aware)
// ===========================

const heroBackground = document.querySelector('.hero-background img');

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroBackground.style.transform = `scale(1.05) translateY(${scrollY * 0.5}px)`;
        }
    }, { passive: true });
}

// ===========================
// PREVENT MENU CLOSING ON SCROLL
// ===========================

document.addEventListener('scroll', () => {
    // Menu will only auto-close when a link is clicked, not on scroll
});
