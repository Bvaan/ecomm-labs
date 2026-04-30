const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function closeMenu() {
  document.body.classList.remove("nav-open");
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

function toggleMenu() {
  const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
  document.body.classList.toggle("nav-open", willOpen);
  navMenu.classList.toggle("is-open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
  navToggle.setAttribute("aria-label", willOpen ? "Close menu" : "Open menu");
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", toggleMenu);

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -60px",
    }
  );

  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.88) {
      item.classList.add("is-visible");
      return;
    }

    item.classList.add("will-reveal");
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const canvas = document.getElementById("particle-field");
const ctx = canvas.getContext("2d");
const particles = [];
let animationFrame;
let width = 0;
let height = 0;
let pixelRatio = 1;

function createParticles() {
  particles.length = 0;
  const count = Math.min(80, Math.max(34, Math.floor((width * height) / 28000)));

  for (let index = 0; index < count; index += 1) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.45,
      speed: Math.random() * 0.28 + 0.08,
      drift: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.42 + 0.14,
    });
  }
}

function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createParticles();
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += particle.drift;

    if (particle.y < -10) {
      particle.y = height + 10;
      particle.x = Math.random() * width;
    }

    if (particle.x < -10) {
      particle.x = width + 10;
    } else if (particle.x > width + 10) {
      particle.x = -10;
    }

    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius * 6
    );
    gradient.addColorStop(0, `rgba(201, 169, 110, ${particle.alpha})`);
    gradient.addColorStop(1, "rgba(201, 169, 110, 0)");

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(particle.x, particle.y, particle.radius * 6, 0, Math.PI * 2);
    ctx.fill();
  });

  animationFrame = window.requestAnimationFrame(drawParticles);
}

function startParticles() {
  if (reduceMotion.matches) {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  window.cancelAnimationFrame(animationFrame);
  drawParticles();
}

resizeCanvas();
startParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  startParticles();
});

reduceMotion.addEventListener("change", () => {
  if (reduceMotion.matches) {
    window.cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, width, height);
  } else {
    startParticles();
  }
});
