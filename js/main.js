(function () {
  "use strict";

  /* ---------------------------------------------
     Signature "measure line" tick generation
  --------------------------------------------- */
  document.querySelectorAll(".measure-ticks").forEach(function (g) {
    const svgNS = "http://www.w3.org/2000/svg";
    for (let x = 0; x <= 1200; x += 40) {
      const isMajor = x % 200 === 0;
      const tick = document.createElementNS(svgNS, "line");
      tick.setAttribute("x1", x);
      tick.setAttribute("x2", x);
      tick.setAttribute("y1", isMajor ? 4 : 8);
      tick.setAttribute("y2", isMajor ? 20 : 16);
      tick.setAttribute("stroke", "#F1B507");
      tick.setAttribute("stroke-width", isMajor ? "2" : "1");
      tick.setAttribute("opacity", isMajor ? "0.9" : "0.4");
      g.appendChild(tick);
    }
  });

  /* ---------------------------------------------
     Scroll reveal (fade + translateY), staggered within
     each grid. Skipped entirely for reduced-motion users
     (CSS already shows everything at full opacity for them).
  --------------------------------------------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealSelector = ".service-card, .why-card, .process-step, .trust-item";
    const revealEls = Array.from(document.querySelectorAll(revealSelector));
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement.children).filter(function (c) {
          return c.matches(revealSelector);
        });
        const index = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(index * 80, 320) + "ms";
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll(".service-card, .why-card, .process-step, .trust-item")
      .forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------
     Sticky header scroll state
  --------------------------------------------- */
  const header = document.getElementById("siteHeader");
  function updateHeaderScrollState() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
  updateHeaderScrollState();

  /* ---------------------------------------------
     Mobile navigation drawer
  --------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("drawerOverlay");

  function openDrawer() {
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
  }
  navToggle.addEventListener("click", function () {
    const isOpen = drawer.classList.contains("is-open");
    isOpen ? closeDrawer() : openDrawer();
  });
  overlay.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeDrawer);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  /* ---------------------------------------------
     Gallery lightbox (curated, fixed set — no filtering)
  --------------------------------------------- */
  const galleryItems = document.querySelectorAll(".masonry-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let visibleItems = [];
  let currentIndex = 0;

  function getVisibleItems() {
    return Array.from(galleryItems);
  }

  function showLightbox(index) {
    visibleItems = getVisibleItems();
    if (!visibleItems.length) return;
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const img = item.querySelector("img");
    if (img) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
    }
    lightboxCaption.textContent = item.getAttribute("data-caption") || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () { lightbox.classList.add("is-visible"); });
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-visible");
    lightbox.setAttribute("aria-hidden", "true");
    setTimeout(function () { lightbox.classList.remove("is-open"); }, 220);
  }

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      visibleItems = getVisibleItems();
      const idx = visibleItems.indexOf(item);
      showLightbox(idx === -1 ? 0 : idx);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", function () { showLightbox(currentIndex - 1); });
  lightboxNext.addEventListener("click", function () { showLightbox(currentIndex + 1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") showLightbox(currentIndex + 1);
  });

  /* ---------------------------------------------
     Quote form validation + submission
  --------------------------------------------- */
  const form = document.getElementById("quoteForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMsg = document.getElementById("formSuccess");
  const errorMsg = document.getElementById("formError");

  const validators = {
    fullName: function (v) { return v.trim().length >= 2 ? "" : "Please enter your full name."; },
    phone: function (v) { return /^[0-9+()\s-]{7,}$/.test(v.trim()) ? "" : "Please enter a valid phone number."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."; },
    area: function (v) { return v.trim().length >= 2 ? "" : "Please tell us the project area."; },
    projectType: function (v) { return v ? "" : "Please select a project type."; }
  };

  function validateField(field) {
    const validator = validators[field.name];
    if (!validator) return true;
    const message = validator(field.value);
    const errorEl = document.getElementById("err-" + field.name);
    if (errorEl) errorEl.textContent = message;
    return !message;
  }

  Object.keys(validators).forEach(function (name) {
    const field = form.elements[name];
    if (field) {
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        if (document.getElementById("err-" + name).textContent) validateField(field);
      });
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot check — silently drop likely spam submissions client-side too
    // (the server also checks this independently, since JS can be bypassed).
    if (form.elements.companyWebsite.value) return;

    let isValid = true;
    Object.keys(validators).forEach(function (name) {
      const field = form.elements[name];
      if (field && !validateField(field)) isValid = false;
    });
    if (!isValid) {
      const firstError = form.querySelector(".field-error:not(:empty)");
      if (firstError) firstError.closest(".form-row, .form-row-split > div").querySelector("input,select").focus();
      return;
    }

    errorMsg.hidden = true;
    errorMsg.textContent = "";

    // Prevent duplicate submissions
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);

    fetch("/api/quote", {
      method: "POST",
      body: formData,
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.success) {
          form.hidden = true;
          successMsg.hidden = false;
          successMsg.focus && successMsg.focus();
        } else {
          const message = (result.data && result.data.error) ||
            "Something went wrong sending your request. Please call or WhatsApp us directly.";
          errorMsg.textContent = message;
          errorMsg.hidden = false;
          errorMsg.focus && errorMsg.focus();
          submitBtn.disabled = false;
          submitBtn.textContent = "Request My Quote";
        }
      })
      .catch(function () {
        errorMsg.textContent = "We couldn't reach the server. Please check your connection and try again, or call/WhatsApp us directly.";
        errorMsg.hidden = false;
        errorMsg.focus && errorMsg.focus();
        submitBtn.disabled = false;
        submitBtn.textContent = "Request My Quote";
      });
  });
})();
