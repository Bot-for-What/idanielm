// ============================================
// REGISTER GSAP PLUGINS
// ============================================
gsap.registerPlugin(ScrollTrigger);

// ============================================
// PANEL "POP" ENTRANCE ANIMATION
// Each section panel animates in like a page
// popping open as it enters the viewport.
// ============================================
const panels = document.querySelectorAll(".panel-inner");

panels.forEach((panel) => {
  gsap.to(panel, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.9,
    ease: "back.out(1.4)", // slight overshoot = "pop" feel
    scrollTrigger: {
      trigger: panel,
      start: "top 80%",   // starts animating when panel top hits 80% of viewport
      end: "top 30%",
      toggleActions: "play none none reverse",
    },
  });
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const progressBar = document.getElementById("scroll-progress");

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgressBar);
updateProgressBar();

// ============================================
// SECTION NAV DOT SYNC
// Highlights the nav dot matching the section
// currently in view, and supports click-to-jump.
// ============================================
const sections = document.querySelectorAll(".panel");
const navDots = document.querySelectorAll(".nav-dot");

sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => setActiveDot(section.dataset.section),
    onEnterBack: () => setActiveDot(section.dataset.section),
  });
});

function setActiveDot(sectionId) {
  navDots.forEach((dot) => {
    dot.classList.toggle("active", dot.dataset.section === sectionId);
  });
}

// ============================================
// SUBTLE PARALLAX ON FIXED BACKGROUND
// Background shifts very slightly as you scroll,
// reinforcing depth without breaking the "fixed" illusion.
// ============================================
const fixedBg = document.getElementById("fixed-bg");

gsap.to(fixedBg, {
  backgroundPosition: "50% 20%",
  ease: "none",
  scrollTrigger: {
    trigger: "#main-content",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
});

// ============================================
// SKILL CHIP STAGGER (small delight on skills section)
// ============================================
gsap.from(".skill-chip", {
  opacity: 0,
  y: 20,
  duration: 0.5,
  stagger: 0.06,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#skills-grid",
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
});

// ============================================
// PROJECT CARD STAGGER
// ============================================
gsap.from(".project-card", {
  opacity: 0,
  y: 30,
  duration: 0.6,
  stagger: 0.12,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#project-cards",
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
});
