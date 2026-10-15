// Ciel étoilé scintillant superposé à tout le site (ne bloque aucun clic).
(() => {
  const canvas = document.createElement("canvas");
  canvas.className = "sky";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COLORS = ["255,255,255", "255,244,214", "233,196,106"];
  let stars = [];
  let shooting = null;
  let w = 0, h = 0, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(150, (w * h) / 9000));
    stars = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      // Une étoile sur 4 est une grande étoile brillante à 4 branches
      big: i % 4 === 0,
      r: i % 4 === 0 ? 2 + Math.random() * 1.8 : 0.8 + Math.random() * 1.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 0.4 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.04,
    }));
  }

  function drawStar(s, a) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.shadowColor = `rgba(${s.color},1)`;
    ctx.shadowBlur = s.big ? 24 : 10;
    ctx.fillStyle = `rgb(${s.color})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    if (s.big) {
      // Rayons lumineux en croix
      const len = s.r * (7 + 5 * a);
      const grad = (x1, y1, x2, y2) => {
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, `rgba(${s.color},0)`);
        g.addColorStop(0.5, `rgba(${s.color},${a})`);
        g.addColorStop(1, `rgba(${s.color},0)`);
        return g;
      };
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = grad(s.x - len, s.y, s.x + len, s.y);
      ctx.beginPath(); ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y); ctx.stroke();
      ctx.strokeStyle = grad(s.x, s.y - len, s.x, s.y + len);
      ctx.beginPath(); ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len); ctx.stroke();
    }
    ctx.restore();
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    const time = t / 1000;
    for (const s of stars) {
      const tw = (Math.sin(time * s.speed + s.phase) + 1) / 2; // 0 → 1
      const a = s.big ? 0.45 + 0.55 * tw * tw : 0.35 + 0.65 * tw;
      if (!reduced) {
        s.y += s.drift;
        if (s.y < -5) s.y = h + 5;
        if (s.y > h + 5) s.y = -5;
      }
      drawStar(s, reduced ? 0.6 : a);
    }
    // Étoile filante occasionnelle
    if (!reduced) {
      if (!shooting && Math.random() < 0.005) {
        shooting = { x: Math.random() * w * 0.7 + w * 0.15, y: Math.random() * h * 0.35, life: 0 };
      }
      if (shooting) {
        shooting.life += 1;
        const p = shooting.life / 55;
        const x = shooting.x + p * 260, y = shooting.y + p * 120;
        const g = ctx.createLinearGradient(x - 90, y - 42, x, y);
        g.addColorStop(0, "rgba(255,244,214,0)");
        g.addColorStop(1, `rgba(255,244,214,${0.9 * (1 - p)})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x - 90, y - 42); ctx.lineTo(x, y); ctx.stroke();
        if (p >= 1) shooting = null;
      }
    }
    if (!reduced) raf = requestAnimationFrame(frame);
  }

  let raf = null;
  resize();
  window.addEventListener("resize", () => { resize(); if (reduced) frame(0); });
  document.addEventListener("visibilitychange", () => {
    if (reduced) return;
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(frame);
  });
  raf = requestAnimationFrame(frame);
})();
