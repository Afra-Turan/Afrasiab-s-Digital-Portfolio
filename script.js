// ─── Smooth scroll helper ───────────────────────────────────────────
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// ─── Mobile hamburger menu ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMenu() {
  mobileMenu.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ─── Active nav link highlight on scroll ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightNavLink() {
  let currentSection = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNavLink);

// ─── Scroll-triggered fade-in animations ───────────────────────────
const fadeEls = document.querySelectorAll(
  '.skill-card, .exp-card, .info-row, .contact-card'
);

fadeEls.forEach((el) => {
  el.classList.add('fade-in');
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeEls.forEach((el) => observer.observe(el));

// ─── Sticky nav border on scroll ───────────────────────────────────
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.borderBottomColor = 'rgba(108, 99, 255, 0.35)';
  } else {
    nav.style.borderBottomColor = 'rgba(108, 99, 255, 0.18)';
  }
});

// ─── Animated stat counters ─────────────────────────────────────────
function animateCounter(el, target, suffix) {
  let count = 0;
  const duration = 1200;
  const steps = 40;
  const increment = target / steps;
  const interval = duration / steps;

  const timer = setInterval(() => {
    count += increment;
    if (count >= target) {
      count = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(count) + suffix;
  }, interval);
}

const statVals = document.querySelectorAll('.stat-val');

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        const hasPlus = raw.includes('+');
        const num = parseInt(raw.replace('+', ''));
        el.textContent = '0';
        animateCounter(el, num, hasPlus ? '+' : '');
        statObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statVals.forEach((el) => statObserver.observe(el));

// ─── Current year in footer ─────────────────────────────────────────
const footerYear = document.querySelector('footer span');
if (footerYear) {
  const year = new Date().getFullYear();
  footerYear.textContent = 'Built with care · ' + year;
}

// ─── Formspree contact form ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.field-error').forEach((el) => el.classList.remove('show'));
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select')
      .forEach((el) => el.classList.remove('error'));

    // Validate fields
    let valid = true;

    const name = document.getElementById('name');
    if (!name.value.trim()) {
      document.getElementById('nameError').classList.add('show');
      name.classList.add('error');
      valid = false;
    }

    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      document.getElementById('emailError').classList.add('show');
      email.classList.add('error');
      valid = false;
    }

    const message = document.getElementById('message');
    if (!message.value.trim()) {
      document.getElementById('messageError').classList.add('show');
      message.classList.add('error');
      valid = false;
    }

    if (!valid) return;

    // Show spinner
    const submitBtn     = document.getElementById('submitBtn');
    const submitText    = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitSpinner.style.display = 'inline-block';

    // Send to Formspree
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        document.getElementById('contactFormCard').style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      } else {
        alert('Something went wrong. Please try again.');
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitSpinner.style.display = 'none';
      }
    } catch (err) {
      alert('Network error. Please check your connection and try again.');
      submitBtn.disabled = false;
      submitText.style.display = 'inline';
      submitSpinner.style.display = 'none';
    }
  });
}