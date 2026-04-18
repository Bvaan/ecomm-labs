// ─── SCROLL REVEAL ───
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

// ─── MOBILE MENU ───
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMenu() {
  mobileMenu.classList.remove('open');
}

// ─── CONTACT FORM ───
function submitForm() {
  const name = document.getElementById('fname').value;
  const email = document.getElementById('femail').value;
  const type = document.getElementById('ftype').value;
  if (!name || !email || !type) {
    alert('Please fill in your name, email, and service type.');
    return;
  }
  document.getElementById('successMsg').style.display = 'inline';
  document.getElementById('fname').value = '';
  document.getElementById('femail').value = '';
  document.getElementById('fphone').value = '';
  document.getElementById('ftype').value = '';
  document.getElementById('fmsg').value = '';
}

// ─── NAV SHRINK ON SCROLL ───
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(8,10,15,0.97)';
  } else {
    nav.style.background = 'rgba(8,10,15,0.85)';
  }
});

// ─── COUNTER ANIMATION ───
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1500;
  const step = target / (duration / 16);
  const interval = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(interval);
    }
    el.innerHTML = Math.floor(start) + '<span>' + suffix + '</span>';
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const nums = e.target.querySelectorAll('.num');
      animateCounter(nums[0], 30, '+');
      animateCounter(nums[1], 2, 'x');
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);