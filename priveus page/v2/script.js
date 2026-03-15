// script.js - Handles firm name, preloader, smooth scroll, mailto contact

const firmName = "PortEX Trading";

/* ---------- Insert firm name in placeholders ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const spots = ["firm-name", "firm-name-hero", "firm-name-about", "firm-name-footer"];

  spots.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = firmName;
  });

  const preText = document.getElementById("preloader-text");
  if (preText && preText.textContent.trim() === "") {
    preText.textContent = firmName;
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

/* ---------- Preloader: wait until window load then fade out ---------- */
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  if (!pre) return;
  pre.style.opacity = "0";
  pre.setAttribute("aria-hidden", "true");
  setTimeout(() => (pre.style.display = "none"), 5);
});

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById("nav-toggle");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const nav = document.getElementById("main-nav");
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    if (!nav) return;
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
  });
}

/* ---------- Smooth scrolling for internal links ---------- */
document.querySelectorAll('a[data-scroll], button[data-scroll]').forEach(el => {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    const targetID = (this.getAttribute("href") || this.dataset.value || "").replace("#", "");
    if (!targetID) return;

    const target = document.getElementById(targetID);
    if (!target) return;

    const offset = 70;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: targetPosition, behavior: "smooth" });

    const nav = document.getElementById("main-nav");
    if (nav && window.innerWidth < 720) nav.style.display = "none";
  });
});

/* ---------- Navbar hide/show on scroll direction ---------- */
let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");
let scrollTimeout;

if (navbar) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove blur background on scroll
    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Instantly show navbar when scrolling up
    if (scrollTop < lastScrollTop) {
      navbar.style.top = "0";
      clearTimeout(scrollTimeout);
    } else if (scrollTop > lastScrollTop + 90) {
      // Hide navbar only after scrolling down more than 150px
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        navbar.style.top = "-80px";
      }, 1); // small delay for smoother UX
    }

    lastScrollTop = Math.max(scrollTop, 0);
  });
}


// Navbar transparency and blur effect on scroll
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ---------- Scroll spy: highlight active nav link ---------- */
const sections = document.querySelectorAll("main section[id]");

function onScrollSpy() {
  const offset = 80;
  const scrollPos = window.pageYOffset;
  let current = null;

  sections.forEach(sec => {
    const top = sec.offsetTop - offset;
    if (scrollPos >= top) current = sec.id;
  });

  if (current) {
    document.querySelectorAll(".nav-links a").forEach(a => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("active", href === `#${current}`);
    });
  }
}

window.addEventListener("scroll", onScrollSpy);
window.addEventListener("resize", onScrollSpy);
onScrollSpy();

/* ---------- Back to top button ---------- */
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.pageYOffset > 300 ? "block" : "none";
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Contact form: use mailto: to open email client ---------- */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = (document.getElementById("name") || {}).value?.trim() || "";
    const email = (document.getElementById("email") || {}).value?.trim() || "";
    const phone = (document.getElementById("phone") || {}).value?.trim() || "";
    const message = (document.getElementById("message") || {}).value?.trim() || "";
    const statusEl = document.getElementById("form-status");

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.textContent = "Please fill in required fields.";
        statusEl.style.color = "salmon";
      }
      return;
    }

    const to = "info@portextrading.com";
    const subject = encodeURIComponent(`${firmName} - Inquiry from ${name}`);
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "---",
      `Message: ${message}`
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    if (statusEl) {
      statusEl.textContent = "Opening your mail client...";
      statusEl.style.color = "lightgreen";
    }

    contactForm.reset();
  });
}
