/** Soft gradient placeholder if a local photo is missing */
function placeholderDataUri(label) {
  const hues = {
    hero: ["#ffb09a", "#e87a6a"],
    finale: ["#f0a08c", "#c45a5a"],
  };
  const pair = hues[label] || ["#ffc4b4", "#d9786c"];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${pair[0]}"/>
          <stop offset="100%" stop-color="${pair[1]}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#g)"/>
      <circle cx="620" cy="180" r="90" fill="rgba(255,255,255,0.18)"/>
      <circle cx="140" cy="820" r="140" fill="rgba(90,30,40,0.12)"/>
      <text x="50%" y="48%" text-anchor="middle" fill="rgba(58,28,34,0.55)"
        font-family="Georgia, serif" font-size="42">Add photo</text>
      <text x="50%" y="54%" text-anchor="middle" fill="rgba(58,28,34,0.4)"
        font-family="sans-serif" font-size="22">${label}</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function setImageWithFallback(imgEl, src, label) {
  if (!imgEl) return;
  imgEl.src = src;
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = placeholderDataUri(label);
  };
}

function markActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll(".site-nav a[data-nav], .bottom-nav a[data-nav]").forEach((link) => {
    const isActive = link.dataset.nav === page;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Build ambient romantic layer: floating hearts, balloons + soft sparkles */
function initRomanceLayer() {
  const ambient = document.querySelector(".ambient");
  if (!ambient || prefersReducedMotion()) return;

  const layer = document.createElement("div");
  layer.className = "romance-layer";
  ambient.appendChild(layer);

  const page = document.body.dataset.page || "home";
  const heartCount = page === "finale" ? 18 : page === "quiz" ? 12 : 14;
  const balloonCount = page === "finale" ? 12 : page === "home" ? 10 : 8;
  const sparkleCount = page === "finale" ? 16 : 10;
  const balloonTones = ["rose", "blush", "wine", "gold", "mint"];

  for (let i = 0; i < heartCount; i += 1) {
    const heart = document.createElement("span");
    const size = ["sm", "md", "lg"][i % 3];
    const tone = ["rose", "blush", "wine"][i % 3];
    heart.className = `float-heart heart-${size} tone-${tone}`;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${10 + Math.random() * 14}s`;
    heart.style.animationDelay = `${-Math.random() * 16}s`;
    heart.style.setProperty("--drift-x", `${(Math.random() * 80 - 40).toFixed(0)}px`);
    heart.style.setProperty("--spin", `${(Math.random() * 40 - 20).toFixed(0)}deg`);
    layer.appendChild(heart);
  }

  for (let i = 0; i < balloonCount; i += 1) {
    const balloon = document.createElement("span");
    const size = ["sm", "md", "lg"][i % 3];
    const tone = balloonTones[i % balloonTones.length];
    balloon.className = `float-balloon balloon-${size} tone-${tone}`;
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.animationDuration = `${14 + Math.random() * 16}s`;
    balloon.style.animationDelay = `${-Math.random() * 18}s`;
    balloon.style.setProperty("--drift-x", `${(Math.random() * 70 - 35).toFixed(0)}px`);
    balloon.style.setProperty("--wobble", `${(6 + Math.random() * 10).toFixed(0)}deg`);
    layer.appendChild(balloon);
  }

  for (let i = 0; i < sparkleCount; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDuration = `${2.5 + Math.random() * 3}s`;
    sparkle.style.animationDelay = `${-Math.random() * 4}s`;
    layer.appendChild(sparkle);
  }
}

/**
 * Burst of hearts from a point (or center of an element).
 * @param {MouseEvent|{clientX:number,clientY:number}|HTMLElement|null} origin
 * @param {number} count
 */
function burstHearts(origin, count = 12) {
  if (prefersReducedMotion()) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  if (origin instanceof HTMLElement) {
    const rect = origin.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  } else if (origin && typeof origin.clientX === "number") {
    x = origin.clientX;
    y = origin.clientY;
  }

  const ceremonyLive =
    document.body.classList.contains("is-unlocking") ||
    document.body.classList.contains("is-wrong");
  const layer = ceremonyLive
    ? document.body
    : document.querySelector(".romance-layer") || document.body;

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 60 + Math.random() * 120;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 40;
    const tone = ["rose", "blush", "wine"][i % 3];

    heart.className = `burst-heart tone-${tone}`;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty("--dx", `${dx.toFixed(1)}px`);
    heart.style.setProperty("--dy", `${dy.toFixed(1)}px`);
    heart.style.setProperty("--rot", `${(Math.random() * 80 - 40).toFixed(0)}deg`);
    heart.style.animationDuration = `${0.85 + Math.random() * 0.45}s`;
    layer.appendChild(heart);

    window.setTimeout(() => heart.remove(), 1400);
  }
}

/**
 * Burst of balloons rising from a point.
 * @param {MouseEvent|{clientX:number,clientY:number}|HTMLElement|null} origin
 * @param {number} count
 */
function burstBalloons(origin, count = 8) {
  if (prefersReducedMotion()) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight * 0.55;

  if (origin instanceof HTMLElement) {
    const rect = origin.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  } else if (origin && typeof origin.clientX === "number") {
    x = origin.clientX;
    y = origin.clientY;
  }

  const ceremonyLive =
    document.body.classList.contains("is-unlocking") ||
    document.body.classList.contains("is-wrong");
  const layer = ceremonyLive
    ? document.body
    : document.querySelector(".romance-layer") || document.body;
  const tones = ["rose", "blush", "wine", "gold", "mint"];

  for (let i = 0; i < count; i += 1) {
    const balloon = document.createElement("span");
    const size = ["sm", "md", "lg"][i % 3];
    const dx = (Math.random() * 120 - 60).toFixed(1);
    const dy = (-80 - Math.random() * 160).toFixed(1);

    balloon.className = `burst-balloon balloon-${size} tone-${tones[i % tones.length]}`;
    balloon.style.left = `${x}px`;
    balloon.style.top = `${y}px`;
    balloon.style.setProperty("--dx", `${dx}px`);
    balloon.style.setProperty("--dy", `${dy}px`);
    balloon.style.setProperty("--rot", `${(Math.random() * 30 - 15).toFixed(0)}deg`);
    balloon.style.animationDuration = `${1.1 + Math.random() * 0.7}s`;
    balloon.style.animationDelay = `${i * 40}ms`;
    layer.appendChild(balloon);

    window.setTimeout(() => balloon.remove(), 2000);
  }
}

/**
 * Party popper / confetti burst (Moments swipes, celebrations).
 * @param {MouseEvent|{clientX:number,clientY:number}|HTMLElement|null} origin
 * @param {"left"|"right"|"center"} side
 */
function partyPopper(origin, side = "center") {
  if (prefersReducedMotion()) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight * 0.42;

  if (origin instanceof HTMLElement) {
    const rect = origin.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  } else if (origin && typeof origin.clientX === "number") {
    x = origin.clientX;
    y = origin.clientY;
  }

  if (side === "left") x = Math.min(x, window.innerWidth * 0.28);
  if (side === "right") x = Math.max(x, window.innerWidth * 0.72);

  // Attach to body so poppers always sit above swipe cards / page UI
  const layer = document.body;
  const colors = ["#d6455d", "#f2a0a8", "#8a2438", "#ffc4b4", "#2f6b4f", "#e8c87a", "#fff8f5"];
  const shapes = ["dot", "rect", "ribbon", "star"];

  // Twin popper tubes
  ["left", "right"].forEach((dir, tubeIndex) => {
    const tube = document.createElement("span");
    tube.className = `popper-tube popper-${dir}`;
    const tx = dir === "left" ? x - 36 : x + 36;
    tube.style.left = `${tx}px`;
    tube.style.top = `${y}px`;
    layer.appendChild(tube);
    window.setTimeout(() => tube.remove(), 700);

    for (let i = 0; i < 14; i += 1) {
      const piece = document.createElement("span");
      const shape = shapes[i % shapes.length];
      piece.className = `confetti-piece confetti-${shape}`;
      piece.style.left = `${tx}px`;
      piece.style.top = `${y}px`;
      piece.style.background = colors[i % colors.length];
      piece.style.color = colors[i % colors.length];

      const angle =
        dir === "left"
          ? -Math.PI * 0.85 + Math.random() * 0.9
          : -Math.PI * 0.15 - Math.random() * 0.9;
      const dist = 80 + Math.random() * 140;
      const dx = Math.cos(angle) * dist + (dir === "left" ? -20 : 20);
      const dy = Math.sin(angle) * dist - 40 - Math.random() * 60;

      piece.style.setProperty("--dx", `${dx.toFixed(1)}px`);
      piece.style.setProperty("--dy", `${dy.toFixed(1)}px`);
      piece.style.setProperty("--rot", `${(Math.random() * 520 - 260).toFixed(0)}deg`);
      piece.style.animationDelay = `${tubeIndex * 40 + i * 12}ms`;
      piece.style.animationDuration = `${0.85 + Math.random() * 0.55}s`;
      layer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 1600);
    }
  });
}

/** Loud cracker bursts for the home page */
function crackerBurst(origin, count = 2) {
  if (prefersReducedMotion()) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight * 0.35;

  if (origin instanceof HTMLElement) {
    const rect = origin.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height * 0.35;
  }

  const layer = document.querySelector(".romance-layer") || document.body;
  const colors = ["#d6455d", "#ffb347", "#f2a0a8", "#fff8f5", "#e8c87a", "#8a2438", "#7ec8a3"];

  for (let c = 0; c < count; c += 1) {
    const cx = x + (c === 0 ? -70 : 70) + (Math.random() * 30 - 15);
    const cy = y + (Math.random() * 40 - 10);

    const flash = document.createElement("span");
    flash.className = "cracker-flash";
    flash.style.left = `${cx}px`;
    flash.style.top = `${cy}px`;
    layer.appendChild(flash);
    window.setTimeout(() => flash.remove(), 500);

    for (let i = 0; i < 18; i += 1) {
      const piece = document.createElement("span");
      const shape = i % 3 === 0 ? "ribbon" : i % 3 === 1 ? "rect" : "dot";
      piece.className = `confetti-piece confetti-${shape} confetti-cracker`;
      piece.style.left = `${cx}px`;
      piece.style.top = `${cy}px`;
      piece.style.background = colors[i % colors.length];
      piece.style.color = colors[i % colors.length];

      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.35;
      const dist = 70 + Math.random() * 160;
      piece.style.setProperty("--dx", `${(Math.cos(angle) * dist).toFixed(1)}px`);
      piece.style.setProperty("--dy", `${(Math.sin(angle) * dist - 30).toFixed(1)}px`);
      piece.style.setProperty("--rot", `${(Math.random() * 640 - 320).toFixed(0)}deg`);
      piece.style.animationDuration = `${0.9 + Math.random() * 0.6}s`;
      piece.style.animationDelay = `${c * 80 + Math.random() * 60}ms`;
      layer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 1800);
    }
  }
}

/** Soft rising hearts + balloons for celebration pages */
function startCelebrationRain(durationMs = 4500) {
  if (prefersReducedMotion()) return;

  const layer = document.querySelector(".romance-layer");
  if (!layer) return;

  const started = Date.now();
  const balloonTones = ["rose", "blush", "wine", "gold", "mint"];
  const tick = () => {
    if (Date.now() - started > durationMs) return;

    const heart = document.createElement("span");
    const tone = ["rose", "blush", "wine"][Math.floor(Math.random() * 3)];
    const size = ["sm", "md", "lg"][Math.floor(Math.random() * 3)];
    heart.className = `rain-heart heart-${size} tone-${tone}`;
    heart.style.left = `${8 + Math.random() * 84}%`;
    heart.style.animationDuration = `${2.2 + Math.random() * 1.8}s`;
    layer.appendChild(heart);
    window.setTimeout(() => heart.remove(), 4200);

    if (Math.random() > 0.35) {
      const balloon = document.createElement("span");
      const bSize = ["sm", "md", "lg"][Math.floor(Math.random() * 3)];
      const bTone = balloonTones[Math.floor(Math.random() * balloonTones.length)];
      balloon.className = `rain-balloon balloon-${bSize} tone-${bTone}`;
      balloon.style.left = `${8 + Math.random() * 84}%`;
      balloon.style.animationDuration = `${2.6 + Math.random() * 2}s`;
      layer.appendChild(balloon);
      window.setTimeout(() => balloon.remove(), 4800);
    }

    window.setTimeout(tick, 180 + Math.random() * 220);
  };

  tick();
}

function applyNehaBranding() {
  const name = CONFIG?.name || "Neha";

  document.querySelectorAll("[data-site-logo]").forEach((el) => {
    el.textContent = `For ${name}`;
  });

  document.querySelectorAll("[data-insert-name]").forEach((el) => {
    el.textContent = name;
  });

  document.title = document.title.includes("Neha")
    ? document.title
    : document.title.replace("Happy Birthday", `Happy Birthday Neha`);

  // Decorative images
  document.querySelectorAll("[data-decor]").forEach((img) => {
    const key = img.dataset.decor;
    const src =
      key === "cake"
        ? CONFIG.cakeImage
        : key === "ribbon"
          ? CONFIG.ribbonImage
          : key === "party"
            ? CONFIG.partyDecorImage
            : null;
    if (src) setImageWithFallback(img, src, key);
  });
}

/** Floating Bubu / Dudu GIF stickers in the four corners of every page */
function initCornerStickers() {
  if (document.querySelector(".corner-stickers")) return;

  const cfg = CONFIG?.cornerStickers || {};
  const slots = [
    { key: "topLeft", className: "corner-sticker corner-tl" },
    { key: "topRight", className: "corner-sticker corner-tr" },
    { key: "bottomLeft", className: "corner-sticker corner-bl" },
    { key: "bottomRight", className: "corner-sticker corner-br" },
  ];

  const layer = document.createElement("div");
  layer.className = "corner-stickers";
  layer.setAttribute("aria-hidden", "true");

  const rotateMs = Number(CONFIG?.cornerStickerRotateMs ?? 7000);
  const timers = [];

  slots.forEach(({ key, className }, slotIndex) => {
    let sources = cfg[key];
    if (!sources) return;
    if (typeof sources === "string") sources = [sources];
    if (!sources.length) return;

    const img = document.createElement("img");
    img.className = className;
    img.alt = "";
    img.decoding = "async";
    img.loading = "lazy";
    img.src = sources[0];
    img.style.setProperty("--sticker-delay", `${slotIndex * 0.35}s`);
    layer.appendChild(img);

    if (sources.length > 1 && rotateMs > 0 && !prefersReducedMotion()) {
      let i = 0;
      const tick = () => {
        i = (i + 1) % sources.length;
        img.classList.add("is-swapping");
        window.setTimeout(() => {
          img.src = sources[i];
          img.classList.remove("is-swapping");
        }, 280);
      };
      timers.push(window.setInterval(tick, rotateMs + slotIndex * 900));
    }
  });

  if (!layer.childElementCount) return;
  document.body.appendChild(layer);

  // Keep stickers out of the way while the passcode gate is up
  const syncGateVisibility = () => {
    const locked = document.body.classList.contains("is-locked");
    layer.classList.toggle("is-hidden-by-gate", locked);
  };
  syncGateVisibility();
  document.addEventListener("site-unlocked", () => {
    layer.classList.remove("is-hidden-by-gate");
  });
  const bodyObserver = new MutationObserver(syncGateVisibility);
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  applyNehaBranding();
  initRomanceLayer();
  initCornerStickers();
});

