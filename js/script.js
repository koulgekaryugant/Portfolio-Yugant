const loader = document.querySelector(".loader");
const navLinks = document.querySelectorAll(".nav-links a");
const navMenu = document.querySelector(".nav-links");
const menuToggle = document.querySelector(".menu-toggle");
const revealEls = document.querySelectorAll(".reveal");
const skillCards = document.querySelectorAll(".skill-card");
const typingText = document.querySelector("#typing-text");
const themeButtons = document.querySelectorAll(".theme-dot");
const identityCode = document.querySelector("#identity-code");
const codePanel = document.querySelector(".code-panel");
const codeRestore = document.querySelector(".code-restore");
const closeCodeButton = document.querySelector(".close-code");
const minimizeCodeButton = document.querySelector(".minimize-code");
const expandCodeButton = document.querySelector(".expand-code");
const cursorGlow = document.querySelector(".cursor-glow");
const projectCards = document.querySelectorAll(".project-card");
const projectDeepDive = document.querySelector("#project-deep-dive");
const assistant = document.querySelector(".ai-assistant");
const assistantToggle = document.querySelector(".assistant-toggle");
const assistantMessages = document.querySelector(".assistant-messages");
const assistantPromptButtons = document.querySelectorAll(".assistant-prompts button");
const avatarFrame = document.querySelector(".avatar-frame");
const avatarPhoto = document.querySelector(".avatar-photo");
const words = ["Developer", "AI Enthusiast", "Problem Solver"];
let particles = [];
let animationFrame;

const identitySnippet = `const developer = {
  name: "Yugant D Koulgekar",
  role: "Associate Developer",
  company: "Paexskin",
  journey: "Intern -> Full-Time",
  skills: ["Java", "Python", "Web Dev"]
};`;

const projectDetails = {
  voting: {
    title: "Online Voting System",
    repo: "https://github.com/koulgekaryugant/online-voting-system.git",
    problem: "Voting workflows need clear authentication, simple participation, and trustworthy result visibility.",
    solution: "Built a web platform with login flow, voting actions, and a results experience designed around secure participation.",
    tech: "PHP, HTML, CSS",
    outcome: "A practical voting system that demonstrates backend logic, user flow thinking, and secure workflow basics."
  },
  face: {
    title: "Face Recognition Attendance System",
    repo: "https://github.com/koulgekaryugant/face-recognition-attendance-system.git",
    problem: "Manual attendance is repetitive, slow, and error-prone in classroom or event environments.",
    solution: "Created a Python-based recognition flow that detects faces and automates attendance marking.",
    tech: "Python, AI/Computer Vision",
    outcome: "Won 2nd prize across multiple events and proved the value of automation in a real attendance use case."
  },
  proctor: {
    title: "Proctored Examination Tool",
    repo: "https://github.com/koulgekaryugant/proctored-examination-tool.git",
    problem: "Online exams need monitoring support to improve integrity without making the experience confusing.",
    solution: "Designed an exam platform with monitoring-oriented flows, frontend interactions, and SQL-backed data handling.",
    tech: "HTML, CSS, JavaScript, Python, SQL",
    outcome: "A full-stack exam utility focused on structured testing, integrity, and practical implementation."
  },
  edunitor: {
    title: "EduNitor",
    repo: "https://github.com/koulgekaryugant/EduNitor_WebApp.git",
    problem: "Educational teams need better monitoring, collaboration, and automation in one connected ecosystem.",
    solution: "Built a smart educational ecosystem that combines automated monitoring with collaborative workflows.",
    tech: "Web Development, Automation, Education Tech",
    outcome: "Recognized as Best Project of the Year and by Karnataka State Council SPP 48."
  }
};

const assistantAnswers = {
  about: "Yugant D Koulgekar is an Associate Developer at Paexskin Solutions Pvt. Ltd in Pune. His story stands out because he converted from Intern to Full-Time Developer through performance and ownership.",
  skills: "His toolkit covers Python, Java, PHP, HTML, CSS, JavaScript, Bootstrap, Angular, MySQL, PostgreSQL, MongoDB, AWS, Azure DevOps, Git, GitHub, Postman, Figma, WAMP, and SourceTree.",
  hire: "Hire him because he has real-world development exposure, a visible growth trajectory, strong debugging discipline, and a practical mindset for backend, frontend, automation, testing, and code reviews.",
  projects: "His projects include secure voting, AI-based attendance, proctored exams, and EduNitor, an award-winning smart education ecosystem recognized by Karnataka State Council SPP 48."
};

const particleHues = {
  prism: [190, 258, 325],
  aqua: [174, 199, 145],
  ember: [22, 318, 272]
};

// Page loader gives the first render a deliberate, premium-feeling entrance.
window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 650);
});

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = words[wordIndex];
  typingText.textContent = deleting
    ? current.slice(0, charIndex - 1)
    : current.slice(0, charIndex + 1);

  charIndex += deleting ? -1 : 1;

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(typeLoop, deleting ? 48 : 82);
}

typeLoop();

let identityIndex = 0;

function typeIdentityCode() {
  if (!identityCode) return;
  identityCode.textContent = identitySnippet.slice(0, identityIndex);
  identityIndex += 1;

  if (identityIndex <= identitySnippet.length) {
    setTimeout(typeIdentityCode, 24);
  }
}

setTimeout(typeIdentityCode, 900);

function setCodeWindow(open) {
  if (!codePanel || !codeRestore) return;
  codePanel.classList.toggle("closed", !open);
  codeRestore.classList.toggle("visible", !open);
}

closeCodeButton?.addEventListener("click", () => setCodeWindow(false));
minimizeCodeButton?.addEventListener("click", () => setCodeWindow(false));
codeRestore?.addEventListener("click", () => setCodeWindow(true));
expandCodeButton?.addEventListener("click", () => {
  if (!codePanel) return;
  codePanel.classList.add("focused");
  setTimeout(() => codePanel.classList.remove("focused"), 750);
});

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === theme);
  });
  createParticles();
}

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme && particleHues[savedTheme]) {
  applyTheme(savedTheme);
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.theme));
});

// Mobile navigation mirrors the desktop anchor flow and closes after selection.
menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Reveal sections and fill skill meters only when they become visible.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");

    if (entry.target.classList.contains("skill-card")) {
      const bar = entry.target.querySelector(".skill-bar span");
      bar.style.width = `${entry.target.dataset.level}%`;
    }
  });
}, { threshold: 0.18 });

revealEls.forEach((el) => revealObserver.observe(el));
skillCards.forEach((el) => revealObserver.observe(el));

const sections = document.querySelectorAll("section[id]");
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach((section) => activeObserver.observe(section));

// Lightweight card tilt and cursor glow for project-card micro-interactions.
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = ((y / rect.height) - 0.5) * -12;

    card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

function renderProjectDetails(projectKey) {
  const detail = projectDetails[projectKey];
  if (!detail || !projectDeepDive) return;

  projectCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.project === projectKey);
  });

  projectDeepDive.classList.remove("open");
  projectDeepDive.innerHTML = `
    <div class="deep-header">
      <div>
        <span class="deep-topline">Project Deep Dive</span>
        <h3>${detail.title}</h3>
      </div>
      <a class="repo-link" href="${detail.repo}" target="_blank" rel="noreferrer">Open GitHub Repo</a>
    </div>
    <div class="deep-grid">
      <div class="deep-cell"><strong>Problem</strong><p>${detail.problem}</p></div>
      <div class="deep-cell"><strong>Solution</strong><p>${detail.solution}</p></div>
      <div class="deep-cell"><strong>Tech Stack</strong><p>${detail.tech}</p></div>
      <div class="deep-cell"><strong>Outcome</strong><p>${detail.outcome}</p></div>
    </div>
  `;
  window.requestAnimationFrame(() => projectDeepDive.classList.add("open"));
  projectDeepDive.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

projectCards.forEach((card) => {
  card.addEventListener("click", () => renderProjectDetails(card.dataset.project));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      renderProjectDetails(card.dataset.project);
    }
  });
});

if (assistantToggle) {
  assistantToggle.addEventListener("click", () => {
    const isOpen = assistant.classList.toggle("open");
    assistantToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function appendAssistantMessage(text, type) {
  const message = document.createElement("p");
  message.className = `${type}-message`;
  message.textContent = text;
  assistantMessages.appendChild(message);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

assistantPromptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.question;
    appendAssistantMessage(button.textContent, "user");
    setTimeout(() => appendAssistantMessage(assistantAnswers[key], "bot"), 220);
  });
});

window.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.transform = `translate3d(${event.clientX - 110}px, ${event.clientY - 110}px, 0)`;
});

if (avatarFrame && avatarPhoto) {
  avatarFrame.addEventListener("mousemove", (event) => {
    const rect = avatarFrame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    avatarPhoto.style.setProperty("--avatar-x", `${x}px`);
    avatarPhoto.style.setProperty("--avatar-y", `${y}px`);
    avatarFrame.style.transform = `rotateX(${-y * 0.35}deg) rotateY(${x * 0.35}deg) scale(1.045)`;
  });

  avatarFrame.addEventListener("mouseleave", () => {
    avatarPhoto.style.setProperty("--avatar-x", "0px");
    avatarPhoto.style.setProperty("--avatar-y", "0px");
    avatarFrame.style.transform = "";
  });
}

// Magnetic buttons add tactility without requiring animation libraries.
document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

// The form posts to FormSubmit so messages reach the portfolio inbox without a custom backend.
document.querySelector(".contact-form").addEventListener("submit", (event) => {
  const status = event.currentTarget.querySelector(".form-status");
  status.textContent = "Sending message to Yugant...";
});

const canvas = document.querySelector("#particle-canvas");
const ctx = canvas.getContext("2d");

// Particle network renders the subtle AI/tech background requested for the portfolio.
function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function createParticles() {
  const count = Math.min(90, Math.floor(window.innerWidth / 18));
  const hues = particleHues[document.body.dataset.theme] || particleHues.prism;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size: Math.random() * 1.8 + 0.6,
    hue: hues[Math.floor(Math.random() * hues.length)]
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${particle.hue}, 88%, 68%, 0.65)`;
    ctx.fill();

    for (let next = index + 1; next < particles.length; next++) {
      const other = particles[next];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(125, 211, 252, ${0.12 * (1 - distance / 120)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  animationFrame = requestAnimationFrame(drawParticles);
}

function initParticles() {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  createParticles();
  drawParticles();
}

window.addEventListener("resize", initParticles);
initParticles();
