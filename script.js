const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    primaryNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Open navigation menu" : "Close navigation menu");
    primaryNav.classList.toggle("is-open", !expanded);
  });

  primaryNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const slideElements = Array.from(document.querySelectorAll(".hero-slide"));
const dotsContainer = document.querySelector(".carousel-dots");
const slideCaption = document.querySelector("#slide-caption");
const carousel = document.querySelector(".hero-photo-shell");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeSlide = 0;
let carouselTimer;

function showSlide(index) {
  if (!slideElements.length) return;
  activeSlide = (index + slideElements.length) % slideElements.length;
  slideElements.forEach((slide, slideIndex) => {
    const active = slideIndex === activeSlide;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  if (slideCaption) slideCaption.textContent = slideElements[activeSlide].dataset.caption || "";
  dotsContainer?.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
    dot.setAttribute("aria-current", String(dotIndex === activeSlide));
  });
}

if (dotsContainer && slideElements.length) {
  slideElements.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Show photo ${index + 1} of ${slideElements.length}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restartCarousel();
    });
    dotsContainer.append(dot);
  });

  document.querySelector(".carousel-prev")?.addEventListener("click", () => {
    showSlide(activeSlide - 1);
    restartCarousel();
  });
  document.querySelector(".carousel-next")?.addEventListener("click", () => {
    showSlide(activeSlide + 1);
    restartCarousel();
  });

  function startCarousel() {
    if (!reducedMotion && !document.hidden && !carouselTimer && !carousel?.matches(":hover") && !carousel?.contains(document.activeElement)) {
      carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 5500);
    }
  }
  function stopCarousel() {
    window.clearInterval(carouselTimer);
    carouselTimer = undefined;
  }
  function restartCarousel() {
    stopCarousel();
    startCarousel();
  }

  carousel?.addEventListener("mouseenter", stopCarousel);
  carousel?.addEventListener("mouseleave", startCarousel);
  carousel?.addEventListener("focusin", stopCarousel);
  carousel?.addEventListener("focusout", startCarousel);
  document.addEventListener("visibilitychange", () => document.hidden ? stopCarousel() : startCarousel());
  showSlide(0);
  startCarousel();
}

const galleryPhotos = [
  { src: "./assets/gallery-school-1.jpg", title: "Learning at the table", category: "school", group: "School life" },
  { src: "./assets/gallery-school-2.jpg", title: "A quiet moment with a book", category: "school", group: "School life" },
  { src: "./assets/gallery-school-3.jpg", title: "A classroom moment", category: "school", group: "School life" },
  { src: "./assets/gallery-school-4.jpg", title: "Time together in class", category: "school", group: "School life" },
  { src: "./assets/gallery-school-5.jpg", title: "Friends at school", category: "school", group: "School life" },
  { src: "./assets/gallery-school-6.jpg", title: "Ready for a school day", category: "school", group: "School life" },
  { src: "./assets/gallery-school-7.jpg", title: "A proud school portrait", category: "school", group: "School life" },
  { src: "./assets/gallery-school-8.jpg", title: "Growing with confidence", category: "school", group: "School life" },
  { src: "./assets/gallery-graduation-1.jpg", title: "Celebrating together", category: "graduation", group: "Graduation" },
  { src: "./assets/gallery-graduation-2.jpg", title: "A proud graduation day", category: "graduation", group: "Graduation" },
  { src: "./assets/gallery-graduation-3.jpg", title: "Sharing a milestone", category: "graduation", group: "Graduation" },
  { src: "./assets/gallery-graduation-4.jpg", title: "Smiles after the ceremony", category: "graduation", group: "Graduation" },
  { src: "./assets/gallery-event-1.jpg", title: "A special day at school", category: "events", group: "School events" },
  { src: "./assets/gallery-event-2.jpg", title: "Celebrating with friends", category: "events", group: "School events" },
  { src: "./assets/gallery-event-3.jpg", title: "A day to remember", category: "events", group: "School events" },
  { src: "./assets/gallery-event-4.jpg", title: "Making happy memories", category: "events", group: "School events" }
];

const galleryGrid = document.querySelector("#gallery-grid");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");

function renderGallery(filter = "all") {
  if (!galleryGrid) return;
  galleryGrid.replaceChildren();
  galleryPhotos.filter((photo) => filter === "all" || photo.category === filter).forEach((photo) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item";
    button.dataset.category = photo.category;
    button.setAttribute("aria-label", `Enlarge photo: ${photo.title}, ${photo.group}`);

    const image = document.createElement("img");
    image.src = photo.src || `https://lh3.googleusercontent.com/d/${photo.id}=w900`;
    image.alt = photo.title;
    image.loading = "lazy";
    image.decoding = "async";

    const caption = document.createElement("span");
    caption.className = "gallery-caption";
    const group = document.createElement("small");
    group.textContent = photo.group;
    const title = document.createElement("strong");
    title.textContent = photo.title;
    caption.append(group, title);
    button.append(image, caption);
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage || typeof lightbox.showModal !== "function") return;
      lightboxImage.src = image.src.replace("=w900", "=w1800");
      lightboxImage.alt = photo.title;
      if (lightboxCaption) lightboxCaption.textContent = `${photo.title} · ${photo.group}`;
      lightbox.showModal();
    });
    galleryGrid.append(button);
  });
}

renderGallery();
document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      const selected = chip === button;
      chip.classList.toggle("is-selected", selected);
      chip.setAttribute("aria-pressed", String(selected));
    });
    renderGallery(button.dataset.filter || "all");
  });
});

document.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox?.close());
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener("close", () => {
  lightboxImage?.removeAttribute("src");
});

function createMailto(subject, lines) {
  return `mailto:primechoicekidscare@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

const enquiryForm = document.querySelector("#enquiry-form");
const enquiryStatus = document.querySelector("#enquiry-status");
enquiryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  const formData = new FormData(enquiryForm);
  const mailto = createMailto("Enquiry for Prime Choice Kids Care", [
    `Parent / guardian: ${formData.get("parentName")}`,
    `Child: ${formData.get("childName")}`,
    `Child's age: ${formData.get("childAge")}`,
    `Parent's email: ${formData.get("email")}`,
    `Phone number: ${formData.get("phone")}`,
    `Program of interest: ${formData.get("program")}`,
    "",
    "Message:",
    String(formData.get("message") || "")
  ]);
  enquiryStatus.replaceChildren();
  const message = document.createElement("span");
  message.textContent = "Your enquiry is ready. Choose the link below to open your email app, then press Send. This website has not sent or stored it.";
  const link = document.createElement("a");
  link.href = mailto;
  link.textContent = "Open email app to send your enquiry";
  link.setAttribute("aria-label", "Open your email app to send your enquiry to Prime Choice Kids Care");
  enquiryStatus.append(message, document.createElement("br"), link);
});

document.querySelectorAll(".service-enquiry").forEach((button) => {
  button.addEventListener("click", () => {
    const programSelect = enquiryForm?.elements.namedItem("program");
    if (programSelect) {
      const option = Array.from(programSelect.options).find((item) => item.text === button.dataset.program);
      if (option) programSelect.value = option.value;
    }
    document.querySelector("#enquiry")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    window.setTimeout(() => enquiryForm?.elements.namedItem("parentName")?.focus({ preventScroll: true }), reducedMotion ? 0 : 450);
  });
});

const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);
  const link = document.createElement("a");
  link.href = createMailto("Message for Prime Choice Kids Care", [
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    "",
    String(data.get("message") || "")
  ]);
  link.textContent = "Open your email app to send this message";
  contactStatus.replaceChildren(link);
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

const backToTop = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => {
  backToTop?.classList.toggle("is-visible", window.scrollY > 500);
}, { passive: true });
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}
