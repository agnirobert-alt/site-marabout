// Les informations du site (nom, numéros, horaires…) se modifient dans site-config.js
const SITE = window.SITE || {};

const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), SITE);
const waLink = (text = "") =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// ----- Remplissage des informations -----
document.querySelectorAll("[data-site]").forEach((el) => {
  const v = get(el.dataset.site);
  if (v) el.textContent = v;
});
document.querySelectorAll("[data-site-tel]").forEach((a) => {
  a.href = `tel:${(SITE.telephone || "").replace(/[^\d+]/g, "")}`;
});
document.querySelectorAll("[data-site-mail]").forEach((a) => {
  a.href = `mailto:${SITE.email}`;
});
document.querySelectorAll("[data-whatsapp]").forEach((a) => {
  a.href = waLink(`Bonjour ${SITE.nom}, je souhaite prendre rendez-vous pour une consultation.`);
});
// Horaires : tableau jour par jour, aujourd'hui mis en évidence
const hours = document.getElementById("hours");
if (hours && Array.isArray(SITE.horaires)) {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  hours.tBodies[0].replaceChildren(
    ...SITE.horaires.map(([jour, h]) => {
      const tr = document.createElement("tr");
      if (jour.toLowerCase() === today) tr.className = "is-today";
      const th = document.createElement("th");
      th.textContent = jour;
      const td = document.createElement("td");
      td.textContent = h;
      tr.append(th, td);
      return tr;
    })
  );
}
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// ----- Bandeau « site en construction » -----
if (SITE.enConstruction) {
  document.documentElement.classList.add("is-construction");
  const bar = document.createElement("div");
  bar.className = "construction";
  bar.setAttribute("role", "note");
  bar.textContent = "Site en cours de construction — certaines informations sont provisoires.";
  document.querySelector(".nav")?.prepend(bar);
} else {
  document.querySelectorAll("[data-construction]").forEach((el) => el.remove());
}

// ----- Photo du médium -----
const frame = document.getElementById("photoFrame");
if (frame && SITE.photo) {
  frame.classList.add("has-photo");
  frame.innerHTML = "";
  const img = document.createElement("img");
  img.src = SITE.photo;
  img.alt = `Consultation au cabinet ${SITE.cabinet}`;
  img.className = "about__photo";
  frame.append(img);
}

// ----- Témoignages -----
const quotes = document.getElementById("quotes");
if (quotes) {
  const list = SITE.temoignages || [];
  list.forEach((t) => {
    const fig = document.createElement("figure");
    fig.className = "quote";
    const bq = document.createElement("blockquote");
    bq.textContent = `« ${t.texte} »`;
    const cap = document.createElement("figcaption");
    const who = document.createElement("strong");
    who.textContent = t.auteur;
    cap.append(who, t.ville ? ` · ${t.ville}` : "");
    fig.append(bq, cap);
    quotes.append(fig);
  });
  // Pendant la construction, des emplacements complètent la rangée de 3
  const empty = SITE.enConstruction ? (3 - (list.length % 3)) % 3 || (list.length ? 0 : 3) : 0;
  for (let i = 0; i < empty; i++) {
    const fig = document.createElement("figure");
    fig.className = "quote quote--empty";
    fig.innerHTML = "<blockquote>Témoignage à venir</blockquote><figcaption>Les avis de nos consultants seront publiés ici, avec leur accord.</figcaption>";
    quotes.append(fig);
  }
  if (!list.length && !empty) {
    document.getElementById("temoignages")?.remove();
    document.querySelector('a[href="#temoignages"]')?.remove();
  }
}

// ----- Navigation : fond au scroll + menu mobile -----
const nav = document.querySelector(".nav");
const toggle = document.getElementById("navToggle");

if (toggle) {
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll("#navLinks a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

// ----- Apparition progressive des blocs -----
const revealTargets = document.querySelectorAll(
  ".section__head, .card, .step, .pledge, .quote, .about__visual, .about__text, .faq details, .contact__info, .form"
);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    io.observe(el);
  });
}

// ----- Formulaire : envoi de la demande par WhatsApp -----
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.type === "checkbox" ? field.checked : field.value.trim() !== "";
    field.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    msg.textContent = "Merci de compléter les champs requis.";
    msg.classList.add("is-error");
    return;
  }

  const d = new FormData(form);
  const text =
    `Bonjour ${SITE.nom}, je m'appelle ${d.get("prenom")}.\n` +
    `Accompagnement souhaité : ${d.get("service")}\n` +
    `Mode : ${d.get("mode")}\n` +
    `Téléphone : ${d.get("tel")}\n\n` +
    `${d.get("message")}`;

  msg.classList.remove("is-error");
  msg.textContent = "Merci ! WhatsApp va s'ouvrir avec votre message prêt à envoyer.";
  window.open(waLink(text), "_blank", "noopener");
  form.reset();
});

// ----- Onglets des services -----
const tabBtns = [...document.querySelectorAll(".tabs__btn")];
const selectTab = (btn, focus) => {
  tabBtns.forEach((b) => {
    const on = b === btn;
    b.setAttribute("aria-selected", String(on));
    b.tabIndex = on ? 0 : -1;
    document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
  });
  if (focus) btn.focus();
  btn.scrollIntoView({ block: "nearest", inline: "nearest" });
};
tabBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => selectTab(btn));
  btn.addEventListener("keydown", (e) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (step) selectTab(tabBtns[(i + step + tabBtns.length) % tabBtns.length], true);
  });
});

// ----- Boutons « Commander / Réserver » : message WhatsApp prérempli -----
document.querySelectorAll("[data-order]").forEach((a) => {
  const verb = a.dataset.verb === "Commander" ? "commander" : "des informations sur";
  a.href = waLink(`Bonjour ${SITE.nom}, je souhaite ${verb} : ${a.dataset.order}.`);
});

// ----- Bouton « Partager mon témoignage » -----
document.querySelectorAll("[data-share]").forEach((a) => {
  a.href = waLink(
    `Bonjour ${SITE.nom}, je souhaite partager mon témoignage.\n\n` +
      "Mon témoignage : \n\n" +
      "Prénom ou initiales à afficher : \n" +
      "Ville : \n\n" +
      "J'accepte que ce témoignage soit publié sur le site du cabinet."
  );
});

// ----- Diaporama de l'accueil -----
const slider = document.getElementById("slider");
const slides = SITE.diaporama || [];
if (slider && slides.length) {
  const DURATION = 5500;
  const track = document.getElementById("sliderTrack");
  const dotsBox = slider.querySelector(".slider__dots");
  const bar = slider.querySelector(".slider__progress span");
  const pad = (n) => String(n).padStart(2, "0");
  slider.style.setProperty("--slide-ms", `${DURATION}ms`);

  track.replaceChildren(
    ...slides.map((s, i) => {
      const fig = document.createElement("figure");
      fig.className = "slider__slide";
      fig.setAttribute("role", "group");
      fig.setAttribute("aria-roledescription", "diapositive");
      fig.setAttribute("aria-label", `${i + 1} sur ${slides.length}`);
      const img = document.createElement("img");
      img.src = s.image;
      img.alt = s.titre;
      img.width = 900;
      img.height = 1200;
      if (i) img.loading = "lazy";
      const cap = document.createElement("figcaption");
      cap.className = "slider__caption";
      const count = document.createElement("span");
      count.className = "slider__count";
      count.textContent = `${pad(i + 1)} / ${pad(slides.length)}`;
      const h = document.createElement("h3");
      h.textContent = s.titre;
      const p = document.createElement("p");
      p.textContent = s.texte;
      cap.append(count, h, p);
      fig.append(img, cap);
      return fig;
    })
  );
  const figs = [...track.children];
  const dots = slides.map((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "slider__dot";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", s.titre);
    b.addEventListener("click", () => go(i, true));
    dotsBox.append(b);
    return b;
  });

  let current = 0;
  let timer = null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function go(i, manual) {
    current = (i + slides.length) % slides.length;
    figs.forEach((f, k) => f.classList.toggle("is-active", k === current));
    dots.forEach((d, k) => d.setAttribute("aria-selected", String(k === current)));
    if (manual) restart();
  }
  function restart() {
    clearInterval(timer);
    bar.classList.remove("is-running");
    if (reduced || slides.length < 2) return;
    void bar.offsetWidth; // relance l'animation de la barre
    bar.classList.add("is-running");
    timer = setInterval(() => {
      go(current + 1);
      bar.classList.remove("is-running");
      void bar.offsetWidth;
      bar.classList.add("is-running");
    }, DURATION);
  }
  const pause = () => { clearInterval(timer); slider.classList.add("is-paused"); };
  const resume = () => { slider.classList.remove("is-paused"); restart(); };

  if (slides.length > 1) {
    slider.querySelectorAll(".slider__arrow").forEach((b) => (b.hidden = false));
    slider.querySelector(".slider__arrow--prev").addEventListener("click", () => go(current - 1, true));
    slider.querySelector(".slider__arrow--next").addEventListener("click", () => go(current + 1, true));
    slider.addEventListener("mouseenter", pause);
    slider.addEventListener("mouseleave", resume);
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(current + 1, true);
      if (e.key === "ArrowLeft") go(current - 1, true);
    });
    // Balayage au doigt sur mobile
    let startX = null;
    slider.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    slider.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1), true);
      startX = null;
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));
  } else {
    dotsBox.hidden = true;
  }
  go(0);
  restart();
}
