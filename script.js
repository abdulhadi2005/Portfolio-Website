const body = document.body;
const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = [...document.querySelectorAll(".nav-link")];
const navTargets = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const revealItems = document.querySelectorAll(".reveal");
const skillsGrid = document.getElementById("skillsGrid");
const typedRole = document.getElementById("typedRole");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const canvas = document.getElementById("neuralCanvas");
const context = canvas.getContext("2d");

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: "-42% 0px -52% 0px",
  threshold: 0
});

navTargets.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("revealed");
    if (entry.target === skillsGrid) {
      skillsGrid.classList.add("revealed");
    }
    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.14
});

revealItems.forEach((item) => revealObserver.observe(item));

const roles = [
  "AI Student | AI Engineer",
  "Machine Learning Developer",
  "Computer Vision Builder",
  "Full-Stack AI Engineer"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

const typeRole = () => {
  const role = roles[roleIndex];
  typedRole.textContent = role.slice(0, charIndex);

  if (!deleting && charIndex < role.length) {
    charIndex += 1;
    window.setTimeout(typeRole, 68);
    return;
  }

  if (!deleting && charIndex === role.length) {
    deleting = true;
    window.setTimeout(typeRole, 1450);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    window.setTimeout(typeRole, 34);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  window.setTimeout(typeRole, 280);
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  typeRole();
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please complete all fields before sending.";
    return;
  }

  const subject = encodeURIComponent("Portfolio inquiry for Abdul Hadi");
  const bodyText = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:abdulhadi3049@gmail.com?subject=${subject}&body=${bodyText}`;
  formStatus.textContent = "Opening your email app with the message ready.";
  contactForm.reset();
});

let width = 0;
let height = 0;
let particles = [];

const particleCount = () => {
  if (window.innerWidth < 640) {
    return 34;
  }
  if (window.innerWidth < 1024) {
    return 52;
  }
  return 74;
};

const resetCanvas = () => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  particles = Array.from({ length: particleCount() }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.36,
    vy: (Math.random() - 0.5) * 0.36,
    radius: Math.random() * 1.6 + 0.8
  }));
};

const drawNetwork = () => {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(96, 245, 223, 0.64)";
  context.strokeStyle = "rgba(96, 245, 223, 0.12)";
  context.lineWidth = 1;

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) {
      particle.vx *= -1;
    }
    if (particle.y < 0 || particle.y > height) {
      particle.vy *= -1;
    }

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  });

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 138) {
        context.globalAlpha = 1 - distance / 138;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }
  }

  context.globalAlpha = 1;
  window.requestAnimationFrame(drawNetwork);
};

if (!reducedMotion) {
  resetCanvas();
  drawNetwork();
  window.addEventListener("resize", resetCanvas);
}
