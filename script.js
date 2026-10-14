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
  img.alt = `Portrait de ${SITE.nom}`;
  img.className = "about__photo";
  frame.append(img);
}

// ----- Témoignages -----
const quotes = document.getElementById("quotes");
if (quotes) {
  const list = SITE.temoignages || [];
  if (list.length) {
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
  } else if (SITE.enConstruction) {
    for (let i = 0; i < 3; i++) {
      const fig = document.createElement("figure");
      fig.className = "quote quote--empty";
      fig.innerHTML = "<blockquote>Témoignage à venir</blockquote><figcaption>Les avis de nos consultants seront publiés ici, avec leur accord.</figcaption>";
      quotes.append(fig);
    }
  } else {
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
