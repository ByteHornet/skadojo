/* ==========================================================================
   SKA DOJO – site behaviour
   Content comes from window.SKA_CONFIG (js/config.js).
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.SKA_CONFIG || {};
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach(function (c) {
      if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function telHref(num) { return "tel:" + String(num).replace(/[^\d+]/g, ""); }

  /* Image with graceful fallback frame */
  function imageFrame(src, alt, label, cls, w, h) {
    var frame = el("div", { class: "img-frame " + (cls || ""), "data-label": label || "Photo placeholder" });
    if (src) {
      var img = el("img", { src: src, alt: alt || "", width: w || 800, height: h || 600, loading: "lazy", decoding: "async" });
      frame.appendChild(img);
    } else {
      frame.classList.add("is-missing");
    }
    return frame;
  }

  /* Mark frames whose images failed (or already failed before JS ran) */
  function watchImages(root) {
    $all(".img-frame img", root).forEach(function (img) {
      function miss() { img.parentNode.classList.add("is-missing"); }
      if (img.complete && img.naturalWidth === 0) miss();
      img.addEventListener("error", miss);
    });
  }

  function placeholderBadge() { return el("span", { class: "badge", text: "Placeholder" }); }

  /* ---------- mobile navigation ---------- */
  function initNav() {
    var toggle = $(".menu-toggle");
    var nav = $("#site-nav");
    if (!toggle || !nav) return;
    var desktop = window.matchMedia("(min-width: 1024px)");

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("is-locked", open);
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    function onChange() { if (desktop.matches) setOpen(false); }
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- active nav link ---------- */
  function initActiveNav() {
    var links = $all("[data-nav]");
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var ids = Object.keys(map).filter(function (id) { return document.getElementById(id); });
    if (!ids.length || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("is-current"); a.removeAttribute("aria-current"); });
          var a = map[en.target.id];
          if (a) { a.classList.add("is-current"); a.setAttribute("aria-current", "true"); }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ---------- hero carousel ---------- */
  function initHero() {
    var hero = $("#home");
    if (!hero) return;
    var slides = $all(".hero__slide", hero);
    var dots = $all("[data-hero-dot]", hero);
    var prev = $("[data-hero-prev]", hero);
    var next = $("[data-hero-next]", hero);
    var toggle = $("[data-hero-toggle]", hero);
    var live = $("#hero-live");
    var viewport = $(".hero__viewport", hero);
    if (slides.length < 2) {
      $all(".hero__controls", hero).forEach(function (c) { c.hidden = true; });
      return;
    }

    var index = 0, timer = null, userPaused = false, hoverPause = false, focusPause = false;
    var INTERVAL = 7000;

    function show(i, announce) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var on = n === index;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", String(!on));
        // inert keeps hidden slides' links out of tab order
        if ("inert" in s) s.inert = !on;
        $all("a, button", s).forEach(function (c) { c.tabIndex = on ? 0 : -1; });
        if (on) {
          $all("img[loading='lazy']", s).forEach(function (im) { im.loading = "eager"; });
        }
      });
      dots.forEach(function (d, n) {
        d.classList.toggle("is-active", n === index);
        if (n === index) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
      if (announce && live) live.textContent = "Slide " + (index + 1) + " of " + slides.length;
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (reducedMotion.matches || userPaused || hoverPause || focusPause) return;
      timer = setInterval(function () { show(index + 1, false); }, INTERVAL);
    }

    if (prev) prev.addEventListener("click", function () { show(index - 1, true); start(); });
    if (next) next.addEventListener("click", function () { show(index + 1, true); start(); });
    dots.forEach(function (d) {
      d.addEventListener("click", function () { show(parseInt(d.getAttribute("data-hero-dot"), 10), true); start(); });
    });

    if (toggle) {
      if (reducedMotion.matches) { userPaused = true; }
      function syncToggle() {
        toggle.textContent = userPaused ? "Play" : "Pause";
        toggle.setAttribute("aria-label", userPaused ? "Start automatic slide rotation" : "Pause automatic slide rotation");
      }
      syncToggle();
      toggle.addEventListener("click", function () { userPaused = !userPaused; syncToggle(); start(); });
    }

    hero.addEventListener("mouseenter", function () { hoverPause = true; start(); });
    hero.addEventListener("mouseleave", function () { hoverPause = false; start(); });
    hero.addEventListener("focusin", function () { focusPause = true; start(); });
    hero.addEventListener("focusout", function () { focusPause = false; start(); });

    // Swipe
    var startX = null, startY = null;
    viewport.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }, { passive: true });
    viewport.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        show(dx < 0 ? index + 1 : index - 1, true);
        start();
      }
    }, { passive: true });

    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    var rmChange = function () { if (reducedMotion.matches) userPaused = true; start(); };
    if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", rmChange);

    show(0, false);
    start();
  }

  /* ---------- config-driven content ---------- */
  function renderHeroEvent() {
    var box = $("#hero-event");
    var fe = CFG.featuredEvent;
    if (!box || !fe) return;
    $(".hero-event__label", box).textContent = fe.label || "Upcoming Event";
    $(".hero-event__title", box).textContent = fe.title || "";
    $(".hero-event__meta", box).textContent = [fe.date, fe.location].filter(Boolean).join(" · ");
    var link = $("[data-hero-event-link]");
    if (link && fe.href) link.setAttribute("href", fe.href);
  }

  function renderPrograms() {
    var grid = $("#program-grid");
    var programs = CFG.programs || [];
    if (!grid) return;
    var anyPlaceholder = false;
    programs.forEach(function (p) {
      anyPlaceholder = anyPlaceholder || !!p.placeholder;
      var planBtn;
      if (p.planUrl) {
        planBtn = el("a", { class: "btn btn--dark", href: p.planUrl, text: "Buy Plan" });
      } else {
        planBtn = el("button", { class: "btn btn--dark", type: "button", "aria-disabled": "true", disabled: true, text: "Buy Plan" });
      }
      var meta = el("dl", { class: "meta" }, [
        el("div", {}, [el("dt", { text: "Level" }), el("dd", { text: p.level || "" })]),
        el("div", {}, [el("dt", { text: "Instructor" }), el("dd", { text: p.instructor || "" })]),
        el("div", {}, [el("dt", { text: "Branch" }), el("dd", { text: p.branch || "" })]),
        el("div", {}, [el("dt", { text: "Schedule" }), el("dd", { text: p.schedule || "" })])
      ]);
      var actions = el("div", { class: "card__actions" }, [
        el("a", { class: "btn btn--primary", href: "#trial", "data-trial": "", "data-program": p.id, "aria-label": "Get a Free Trial – " + p.name, text: "Get a Free Trial" }),
        planBtn,
        p.planUrl ? null : el("p", { class: "plan-note", text: "Plans not yet available online" })
      ]);
      var card = el("article", { class: "card" }, [
        p.placeholder ? placeholderBadge() : null,
        (function () { var f = imageFrame(p.image, p.alt, p.name + " photo", "card__media", 800, 600); return f; })(),
        el("div", { class: "card__body" }, [
          el("h3", { class: "card__title", text: p.name }),
          el("p", { class: "card__text", text: p.description }),
          meta,
          actions
        ])
      ]);
      grid.appendChild(card);
    });
    var note = $("#program-note");
    if (note && anyPlaceholder) note.hidden = false;
    watchImages(grid);
  }

  function renderInstructors() {
    var grid = $("#instructor-grid");
    var list = CFG.instructors || [];
    if (!grid) return;
    var anyPlaceholder = false;
    list.forEach(function (p) {
      anyPlaceholder = anyPlaceholder || !!p.placeholder;
      grid.appendChild(el("article", { class: "instructor" }, [
        p.placeholder ? placeholderBadge() : null,
        imageFrame(p.image, "Portrait of " + p.name, "Portrait placeholder", "instructor__media", 640, 800),
        el("div", { class: "instructor__body" }, [
          el("p", { class: "instructor__rank", text: p.rank }),
          el("h3", { class: "instructor__name", text: p.name }),
          el("p", { class: "instructor__title", text: p.title }),
          el("p", { class: "instructor__bio", text: p.bio })
        ])
      ]));
    });
    var note = $("#instructor-note");
    if (note && anyPlaceholder) note.hidden = false;
    watchImages(grid);
  }

  function renderTestimonials() {
    var grid = $("#testimonial-grid");
    var list = CFG.testimonials || [];
    if (!grid) return;
    var anyPlaceholder = false;
    list.forEach(function (t) {
      anyPlaceholder = anyPlaceholder || !!t.placeholder;
      grid.appendChild(el("figure", { class: "quote" }, [
        t.placeholder ? el("span", { class: "badge", text: "Placeholder" }) : null,
        el("blockquote", { text: t.quote }),
        el("figcaption", {}, [el("strong", { text: t.name }), el("span", { text: t.role })])
      ]));
    });
    var note = $("#testimonial-note");
    if (note && anyPlaceholder) note.hidden = false;
  }

  function renderEvents() {
    var grid = $("#event-grid");
    var events = CFG.events || [];
    if (!grid) return;
    if (!events.length) {
      grid.appendChild(el("div", { class: "event event--empty" }, [
        el("p", { text: "New events will be announced soon. Contact the dojo to ask about upcoming gradings, seminars and tournaments." })
      ]));
    }
    if (events.length > 1) grid.classList.add("has-many");
    events.forEach(function (ev) {
      grid.appendChild(el("article", { class: "event" }, [
        ev.placeholder ? placeholderBadge() : null,
        imageFrame(ev.image, ev.title, "Event photo placeholder", "event__media", 800, 500),
        el("div", { class: "event__body" }, [
          el("p", { class: "event__type", text: ev.type }),
          el("h3", { class: "event__title", text: ev.title }),
          el("p", { text: ev.date }),
          el("p", { text: ev.venue }),
          el("p", { class: "card__text", text: ev.description }),
          ev.status ? el("span", { class: "event__status", text: ev.status }) : null,
          el("a", { class: "btn btn--outline", href: ev.href || "#trial", text: "Learn More", "aria-label": "Learn more about " + ev.title })
        ])
      ]));
    });
    var all = $("#events-all");
    if (all && CFG.eventsPageUrl) {
      $("#events-all-link").setAttribute("href", CFG.eventsPageUrl);
      all.hidden = false;
    }
    watchImages(grid);
  }

  function renderBranches() {
    var wrap = $("#branch-grid");
    var branches = CFG.branches || [];
    if (!wrap) return;
    if (branches.length === 1) wrap.classList.add("branches--single");
    branches.forEach(function (b) {
      var phone = b.phone || (CFG.contact && CFG.contact.phone) || "";
      var actions = el("div", { class: "branch__actions" }, [
        b.directionsUrl
          ? el("a", { class: "btn btn--dark", href: b.directionsUrl, target: "_blank", rel: "noopener noreferrer", text: "Get Directions" })
          : el("span", { class: "plan-note", text: "Directions link not yet configured" }),
        b.mapUrl ? el("a", { class: "btn btn--outline", href: b.mapUrl, target: "_blank", rel: "noopener noreferrer", text: "View Map" }) : null,
        phone ? el("a", { class: "btn btn--outline", href: telHref(phone), text: "Call " + phone }) : null
      ]);
      wrap.appendChild(el("article", { class: "branch" }, [
        b.placeholder ? placeholderBadge() : null,
        el("div", {}, [
          el("h3", { class: "branch__name", text: b.name }),
          el("address", { text: b.address })
        ]),
        el("dl", { class: "meta" }, [
          el("div", {}, [el("dt", { text: "Classes" }), el("dd", { text: b.schedule })]),
          el("div", {}, [el("dt", { text: "Phone" }), el("dd", { text: phone || "[Contact number to be added]" })])
        ]),
        actions
      ]));
    });
  }

  function renderFaq() {
    var wrap = $("#faq-list");
    var faqs = CFG.faqs || [];
    if (!wrap) return;
    var buttons = [];
    faqs.forEach(function (f, i) {
      var bid = "faq-btn-" + i, pid = "faq-panel-" + i;
      var btn = el("button", { class: "faq__btn", type: "button", id: bid, "aria-expanded": "false", "aria-controls": pid }, [
        el("span", { text: f.q }),
        el("span", { class: "faq__icon", "aria-hidden": "true" })
      ]);
      var panel = el("div", { class: "faq__panel", id: pid, role: "region", "aria-labelledby": bid, hidden: true }, [
        el("p", { text: f.a })
      ]);
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      });
      buttons.push(btn);
      wrap.appendChild(el("div", { class: "faq__item" }, [el("h3", { class: "faq__q" }, [btn]), panel]));
    });
    // Arrow / Home / End keyboard navigation between questions
    wrap.addEventListener("keydown", function (e) {
      var i = buttons.indexOf(document.activeElement);
      if (i === -1) return;
      var target = null;
      if (e.key === "ArrowDown") target = buttons[(i + 1) % buttons.length];
      else if (e.key === "ArrowUp") target = buttons[(i - 1 + buttons.length) % buttons.length];
      else if (e.key === "Home") target = buttons[0];
      else if (e.key === "End") target = buttons[buttons.length - 1];
      if (target) { e.preventDefault(); target.focus(); }
    });
  }

  function renderFooter() {
    var contact = CFG.contact || {};
    var progList = $("#footer-programs");
    if (progList) {
      (CFG.programs || []).forEach(function (p) {
        progList.appendChild(el("li", {}, [el("a", { href: "#programs", text: p.name })]));
      });
    }
    var addr = $("#footer-contact");
    if (addr) {
      (CFG.branches || []).forEach(function (b) {
        addr.appendChild(el("span", { text: b.name + " – " + b.address }));
      });
      addr.appendChild(contact.phone ? el("a", { href: telHref(contact.phone), text: contact.phone }) : el("span", { text: "[Phone to be added]" }));
      addr.appendChild(contact.email ? el("a", { href: "mailto:" + contact.email, text: contact.email }) : el("span", { text: "[Email to be added]" }));
    }
    var social = $("#footer-social");
    if (social) {
      var names = { instagram: "Instagram", facebook: "Facebook", youtube: "YouTube" };
      Object.keys(CFG.social || {}).forEach(function (k) {
        if (CFG.social[k]) {
          social.appendChild(el("li", {}, [el("a", { href: CFG.social[k], target: "_blank", rel: "noopener noreferrer", text: names[k] || k })]));
        }
      });
    }
    var year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ---------- trial form ---------- */
  function initTrialForm() {
    var form = $("#trial-form");
    if (!form) return;
    var programSel = $("#f-program");
    var branchSel = $("#f-branch");
    var ageSel = $("#f-age");
    var guardianField = $("#guardian-field");
    var status = $("#form-status");
    var submitBtn = $("#form-submit");

    (CFG.programs || []).forEach(function (p) {
      programSel.appendChild(el("option", { value: p.id, text: p.name }));
    });
    (CFG.branches || []).forEach(function (b) {
      branchSel.appendChild(el("option", { value: b.id, text: b.name }));
    });
    if ((CFG.branches || []).length === 1) branchSel.value = CFG.branches[0].id;

    // Preselect program from card buttons
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-program]");
      if (a && programSel) programSel.value = a.getAttribute("data-program");
    });

    ageSel.addEventListener("change", function () {
      var minor = ageSel.value === "child" || ageSel.value === "teen";
      guardianField.hidden = !minor;
      if (!minor) clearError($("#f-guardian"));
    });

    function setError(input, msg) {
      var field = input.closest(".field");
      var err = $("#" + input.getAttribute("aria-describedby"));
      if (field) field.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      if (err) err.textContent = msg;
    }
    function clearError(input) {
      var field = input.closest(".field");
      var err = $("#" + input.getAttribute("aria-describedby"));
      if (field) field.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
      if (err) err.textContent = "";
    }

    var rules = {
      "f-name": function (v) { return v.trim().length < 2 ? "Please enter your full name." : ""; },
      "f-age": function (v) { return !v ? "Please select an age group." : ""; },
      "f-guardian": function (v) {
        var minor = ageSel.value === "child" || ageSel.value === "teen";
        return minor && v.trim().length < 2 ? "A parent or guardian name is required for students under 18." : "";
      },
      "f-phone": function (v) {
        var digits = v.replace(/[^\d]/g, "");
        if (!v.trim()) return "Please enter a phone number.";
        return !/^[\d\s()+\-.]+$/.test(v) || digits.length < 7 || digits.length > 15 ? "Enter a valid phone number (7–15 digits)." : "";
      },
      "f-email": function (v) {
        return v.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Enter a valid email address or leave it blank." : "";
      },
      "f-program": function (v) { return !v ? "Please choose a program." : ""; },
      "f-branch": function (v) { return !v ? "Please choose a branch." : ""; }
    };

    function validateField(input) {
      if (input.id === "f-consent") {
        if (!input.checked) { setError(input, "Please agree to the Privacy Policy to continue."); return false; }
        clearError(input); return true;
      }
      var rule = rules[input.id];
      if (!rule) return true;
      var msg = rule(input.value);
      if (msg) { setError(input, msg); return false; }
      clearError(input);
      return true;
    }

    var fields = $all("#f-name, #f-age, #f-guardian, #f-phone, #f-email, #f-program, #f-branch, #f-consent", form);
    fields.forEach(function (input) {
      input.addEventListener("blur", function () { if (input.closest(".field").classList.contains("has-error") || input.value) validateField(input); });
      input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") validateField(input); });
      input.addEventListener("change", function () { if (input.getAttribute("aria-invalid") === "true") validateField(input); });
    });

    function showStatus(kind, msg) {
      status.className = "form__status is-" + kind;
      status.textContent = msg;
      status.focus();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form__status";
      status.textContent = "";

      var firstBad = null;
      fields.forEach(function (input) {
        if (input.id === "f-guardian" && guardianField.hidden) return;
        if (!validateField(input) && !firstBad) firstBad = input;
      });
      if (firstBad) {
        showStatus("error", "Please fix the highlighted fields and try again.");
        firstBad.focus();
        return;
      }
      // Honeypot: silently stop obvious bots
      if ($("#f-website").value) return;

      var data = {
        name: $("#f-name").value.trim(),
        ageGroup: ageSel.value,
        guardian: guardianField.hidden ? "" : $("#f-guardian").value.trim(),
        phone: $("#f-phone").value.trim(),
        email: $("#f-email").value.trim(),
        program: programSel.value,
        branch: branchSel.value,
        session: $("#f-date").value.trim(),
        message: $("#f-message").value.trim()
      };

      if (!CFG.trialEndpoint) {
        // Static prototype: validate only. NOTHING is sent anywhere.
        showStatus("info", "Your details look complete, but this website is not yet connected to a booking system, so nothing has been sent to the dojo. Please contact the dojo directly to request your trial class.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      fetch(CFG.trialEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        guardianField.hidden = true;
        showStatus("success", "Thank you. Your trial request has been submitted. The dojo will contact you using the details provided.");
      }).catch(function () {
        showStatus("error", "Sorry, your request could not be sent. Please try again or contact the dojo directly.");
      }).then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request Free Trial";
      });
    });
  }

  /* ---------- WhatsApp ---------- */
  function initWhatsApp() {
    var btn = $("#whatsapp-btn");
    var num = CFG.contact && CFG.contact.whatsapp ? String(CFG.contact.whatsapp).replace(/\D/g, "") : "";
    if (!btn || !num) return; // stays hidden until a number is configured
    var msg = encodeURIComponent((CFG.contact && CFG.contact.whatsappMessage) || "");
    btn.href = "https://wa.me/" + num + (msg ? "?text=" + msg : "");
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.removeAttribute("aria-disabled");
    btn.hidden = false;
  }

  /* ---------- back to top ---------- */
  function initToTop() {
    var btn = $("#to-top");
    if (!btn) return;
    var ticking = false;
    function update() {
      btn.hidden = window.scrollY < 900;
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    });
    update();
  }

  /* ---------- init ---------- */
  function init() {
    renderHeroEvent();
    renderPrograms();
    renderInstructors();
    renderTestimonials();
    renderEvents();
    renderBranches();
    renderFaq();
    renderFooter();
    initNav();
    initActiveNav();
    initHero();
    initTrialForm();
    initWhatsApp();
    initToTop();
    watchImages(document);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
