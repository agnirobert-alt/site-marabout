// Les informations du site (nom, numéros, horaires…) se modifient dans site-config.js
const SITE = window.SITE || {};

const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), SITE);
const waLink = (text = "") =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// ----- Remplissage des informations -----
document.querySelectorAll("[data-site]").forEach((el) => {
  const v = get(el.dataset.site);
  if (v) el.textContent = v;
  // Information non renseignée : on masque toute la ligne qui la contient
  else if (v === "") el.closest("[data-line]")?.remove();
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
  // Emplacements « Témoignage à venir » seulement tant qu'aucun avis n'est publié
  const empty = SITE.enConstruction && !list.length ? 3 : 0;
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

// ----- Formulaire : demande envoyée par e-mail (FormSubmit) + ouverture de WhatsApp -----
// Protections : validation stricte, piège anti-robots, délai minimal, anti-doublon.
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");
const pageLoadedAt = Date.now();
const COOLDOWN_MS = 60_000; // une demande par minute maximum
let sending = false;
let lastSentAt = 0;
let lastSignature = "";

const clean = (v, max) => String(v || "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const cleanMultiline = (v, max) => String(v || "").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim().slice(0, max);
const PHONE_RE = /^\+?[0-9][0-9 ().-]{6,22}$/;
const allowed = (select) => [...select.options].map((o) => o.value || o.textContent);

const showMsg = (text, isError) => {
  msg.textContent = text;
  msg.classList.toggle("is-error", !!isError);
};

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (sending) return;

  const d = new FormData(form);
  const data = {
    prenom: clean(d.get("prenom"), 60),
    tel: clean(d.get("tel"), 25),
    service: clean(d.get("service"), 80),
    mode: clean(d.get("mode"), 40),
    message: cleanMultiline(d.get("message"), 2000),
  };

  // Piège anti-robots rempli, ou formulaire soumis trop vite : on ignore sans le dire au robot
  if (d.get("_honey") || Date.now() - pageLoadedAt < 3000) {
    showMsg("Merci ! Votre demande a bien été prise en compte.");
    form.reset();
    return;
  }

  // Validation champ par champ
  const errors = [];
  const mark = (name, ok) => form.elements[name]?.classList.toggle("is-invalid", !ok);
  const check = (name, ok, label) => { mark(name, ok); if (!ok) errors.push(label); };
  check("prenom", data.prenom.length >= 2, "votre prénom");
  check("tel", PHONE_RE.test(data.tel), "un numéro de téléphone valide");
  check("message", data.message.length >= 10, "votre situation (au moins 10 caractères)");
  check("service", allowed(form.elements.service).includes(data.service), "le type d'accompagnement");
  check("mode", allowed(form.elements.mode).includes(data.mode), "le mode de consultation");
  const consent = form.elements.consent.checked;
  mark("consent", consent);
  if (!consent) errors.push("votre accord pour être recontacté(e)");

  if (errors.length) {
    showMsg(`Merci d'indiquer ${errors.join(", ")}.`, true);
    return;
  }

  // Anti-doublon : même demande ou envoi trop rapproché
  const signature = [data.prenom, data.tel, data.message].join("|").toLowerCase();
  if (signature === lastSignature || Date.now() - lastSentAt < COOLDOWN_MS) {
    showMsg("Votre demande a déjà été envoyée. Le cabinet vous répondra très vite.", true);
    return;
  }

  const text =
    `Bonjour ${SITE.nom}, je m'appelle ${data.prenom}.
` +
    `Accompagnement souhaité : ${data.service}
` +
    `Mode : ${data.mode}
` +
    `Téléphone : ${data.tel}

` +
    `${data.message}`;

  sending = true;
  lastSentAt = Date.now();
  lastSignature = signature;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;

  // 1. Envoi automatique par e-mail au cabinet
  const emailSent = SITE.email
    ? fetch(`https://formsubmit.co/ajax/${SITE.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Nouvelle demande — ${data.prenom} (${data.service})`,
          _template: "table",
          _captcha: "false",
          _honey: "",
          Prénom: data.prenom,
          Téléphone: data.tel,
          Accompagnement: data.service,
          Mode: data.mode,
          Message: data.message,
        }),
        keepalive: true,
      }).then((r) => r.ok).catch(() => false)
    : Promise.resolve(false);

  // Signale la demande (utilisé par le Pixel Meta s'il est activé)
  document.dispatchEvent(new CustomEvent("site:lead", { detail: { service: data.service } }));

  // 2. WhatsApp s'ouvre tout de suite (avant tout délai, pour ne pas être bloqué par le navigateur)
  window.open(waLink(text), "_blank", "noopener");
  showMsg("Envoi de votre demande…");
  emailSent.then((ok) => {
    showMsg(ok
      ? "Merci ! Votre demande a bien été envoyée au cabinet. Vous pouvez aussi l'envoyer sur WhatsApp."
      : "Merci ! Envoyez votre message dans WhatsApp pour finaliser votre demande.");
    if (ok) form.reset();
    else lastSignature = ""; // échec de l'e-mail : le client pourra réessayer
    sending = false;
    setTimeout(() => (button.disabled = false), COOLDOWN_MS);
  });
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

// ----- Bande de photos défilante de l'accueil -----
const heroTrack = document.getElementById("heroTrack");
const photos = SITE.diaporama || [];
if (heroTrack && photos.length) {
  const tile = (p, clone) => {
    const fig = document.createElement("figure");
    fig.className = "hero__tile";
    if (clone) fig.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.src = p.image;
    img.alt = clone ? "" : p.titre;
    img.width = 900;
    img.height = 1200;
    const cap = document.createElement("figcaption");
    const t = document.createElement("strong");
    t.textContent = p.titre;
    const s = document.createElement("span");
    s.textContent = p.texte;
    cap.append(t, s);
    fig.append(img, cap);
    return fig;
  };
  // Une « série » répète les photos jusqu'à couvrir au moins 6 vignettes ;
  // la bande contient 2 séries identiques pour boucler sans saut.
  const perSet = Math.max(6, photos.length);
  const set = Array.from({ length: perSet }, (_, i) => photos[i % photos.length]);
  heroTrack.replaceChildren(
    ...set.map((p, i) => tile(p, i >= photos.length)),
    ...set.map((p) => tile(p, true))
  );
  heroTrack.style.setProperty("--tiles", perSet);
  heroTrack.classList.add("is-running");
}
