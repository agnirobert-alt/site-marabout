// ===== Configuration : remplacez par le vrai numéro WhatsApp (format international, sans + ni espaces) =====
const WHATSAPP_NUMBER = "33600000000";

const waLink = (text = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

document.querySelectorAll("[data-whatsapp]").forEach((a) => {
  a.href = waLink("Bonjour Maître, je souhaite prendre rendez-vous pour une consultation.");
});

document.getElementById("year").textContent = new Date().getFullYear();

// ----- Navigation : fond au scroll + menu mobile -----
const nav = document.querySelector(".nav");
const toggle = document.getElementById("navToggle");

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

form.addEventListener("submit", (e) => {
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
    `Bonjour Maître, je m'appelle ${d.get("prenom")}.\n` +
    `Accompagnement souhaité : ${d.get("service")}\n` +
    `Mode : ${d.get("mode")}\n` +
    `Téléphone : ${d.get("tel")}\n\n` +
    `${d.get("message")}`;

  msg.classList.remove("is-error");
  msg.textContent = "Merci ! WhatsApp va s'ouvrir avec votre message prêt à envoyer.";
  window.open(waLink(text), "_blank", "noopener");
  form.reset();
});
