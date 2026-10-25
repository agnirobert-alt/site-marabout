// Pixel Meta (Facebook) — chargé UNIQUEMENT après l'accord du visiteur.
// L'identifiant du Pixel se règle dans site-config.js (metaPixelId).
(() => {
  const SITE = window.SITE || {};
  const PIXEL_ID = String(SITE.metaPixelId || "").trim();
  if (!/^\d{10,20}$/.test(PIXEL_ID)) return; // pas d'identifiant valide : rien n'est chargé

  const KEY = "cookie-consent"; // "yes" | "no"
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch { /* navigation privée */ } },
    clear() { try { localStorage.removeItem(KEY); } catch { /* rien */ } },
  };

  // --- Chargement du Pixel (code officiel Meta, déplacé dans ce fichier) ---
  let loaded = false;
  function loadPixel() {
    if (loaded) return;
    loaded = true;
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }
  const track = (event, params) => { if (loaded && window.fbq) window.fbq("track", event, params || {}); };

  // --- Événements utiles pour les publicités ---
  // Clic vers WhatsApp ou appel téléphonique = « Contact »
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (/wa\.me|whatsapp/i.test(a.href) || a.hasAttribute("data-whatsapp")) {
      track("Contact", { content_name: a.dataset.order || "WhatsApp" });
    } else if (href.startsWith("tel:")) {
      track("Contact", { content_name: "Appel" });
    }
  }, true);
  // Formulaire de demande envoyé = « Lead » (prospect)
  document.addEventListener("site:lead", (e) => {
    track("Lead", { content_name: (e.detail && e.detail.service) || "Demande" });
  });

  // --- Bandeau de consentement ---
  function showBanner() {
    if (document.getElementById("cookieBanner")) return;
    const box = document.createElement("div");
    box.id = "cookieBanner";
    box.className = "cookie";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Préférences de cookies");
    const p = document.createElement("p");
    p.textContent = "Nous utilisons le Pixel Meta (Facebook) pour mesurer l'efficacité de nos publicités. Acceptez-vous ces cookies de mesure ?";
    const link = document.createElement("a");
    link.href = "confidentialite.html";
    link.textContent = "En savoir plus";
    p.append(" ", link);
    const actions = document.createElement("div");
    actions.className = "cookie__actions";
    const no = document.createElement("button");
    no.type = "button";
    no.className = "btn btn--ghost btn--sm";
    no.textContent = "Refuser";
    const yes = document.createElement("button");
    yes.type = "button";
    yes.className = "btn btn--gold btn--sm";
    yes.textContent = "Accepter";
    no.addEventListener("click", () => { store.set("no"); box.remove(); });
    yes.addEventListener("click", () => { store.set("yes"); box.remove(); loadPixel(); });
    actions.append(no, yes);
    box.append(p, actions);
    document.body.append(box);
  }

  // Bouton « Modifier mes choix » (page Confidentialité)
  document.querySelectorAll("[data-cookie-reset]").forEach((b) => {
    b.hidden = false;
    b.addEventListener("click", () => { store.clear(); showBanner(); });
  });

  const choice = store.get();
  if (choice === "yes") loadPixel();
  else if (choice !== "no") showBanner();
})();
