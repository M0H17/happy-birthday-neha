document.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("hero-name");
  const lineEl = document.querySelector(".hero-line");
  const photoEl = document.getElementById("hero-image");
  const cakeEl = document.getElementById("reveal-cake");
  const brandEl = document.querySelector(".brand");
  const giftFlip = document.getElementById("gift-flip");
  const openBtn = document.getElementById("gift-open-btn");
  const giftBack = document.getElementById("gift-back");
  const giftFront = giftFlip?.querySelector(".gift-face-front");

  let photoTimer = null;
  let scrambleTimer = null;

  const SCRAMBLE_COLS = 5;
  const SCRAMBLE_ROWS = 7;

  if (nameEl) nameEl.textContent = CONFIG.name;
  if (lineEl) lineEl.textContent = CONFIG.tagline;

  if (cakeEl) {
    setImageWithFallback(cakeEl, CONFIG.cakeImage, "cake");
  }

  if (photoEl) {
    photoEl.src = CONFIG.heroImage;
    photoEl.onerror = () => {
      photoEl.onerror = null;
      setImageWithFallback(photoEl, CONFIG.heroImage, "neha-photo");
    };
  }

  if (brandEl) brandEl.classList.add("brand-heartbeat");

  const crackerTarget = () => brandEl || document.querySelector(".hero-copy");
  let crackerTimer = null;
  let homeStarted = false;

  function playWelcomeCrackers() {
    if (prefersReducedMotion()) return;
    crackerBurst(crackerTarget(), 2);
  }

  function startHomeEffects() {
    if (homeStarted) return;
    homeStarted = true;
    playWelcomeCrackers();
    crackerTimer = window.setInterval(playWelcomeCrackers, 3000);
  }

  window.addEventListener("pagehide", () => {
    if (crackerTimer) window.clearInterval(crackerTimer);
  });

  // Wait for passcode gate unlock (or resume if already unlocked)
  if (document.body.classList.contains("is-unlocked")) {
    startHomeEffects();
  } else {
    document.addEventListener("site-unlocked", startHomeEffects, { once: true });
  }

  function clearScramble() {
    window.clearTimeout(scrambleTimer);
    giftBack?.querySelectorAll(".scramble-loader").forEach((el) => el.remove());
  }

  function resetRevealLayers() {
    clearScramble();
    giftBack?.classList.remove("show-cake", "show-photo", "photo-reveal", "is-scrambling");
    cakeEl?.classList.remove("is-visible", "is-hiding");
    photoEl?.classList.remove("is-visible", "photo-zoom-in", "is-assembled");
  }

  function showCakeReveal() {
    giftBack?.classList.add("show-cake", "photo-reveal");
    cakeEl?.classList.add("is-visible");
  }

  function runScrambleLoader() {
    if (!giftBack || !photoEl) return;

    clearScramble();
    giftBack.classList.add("is-scrambling");
    photoEl.classList.remove("is-visible", "is-assembled");

    const src = photoEl.currentSrc || photoEl.src || CONFIG.heroImage;
    const loader = document.createElement("div");
    loader.className = "scramble-loader";
    loader.setAttribute("aria-hidden", "true");

    const cols = SCRAMBLE_COLS;
    const rows = SCRAMBLE_ROWS;
    const total = cols * rows;
    const order = Array.from({ length: total }, (_, i) => i);

    // Fisher–Yates shuffle for random tile settle order
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const index = r * cols + c;
        const tile = document.createElement("span");
        tile.className = "scramble-tile";

        const xPct = cols === 1 ? 0 : (c / (cols - 1)) * 100;
        const yPct = rows === 1 ? 0 : (r / (rows - 1)) * 100;

        tile.style.width = `${100 / cols}%`;
        tile.style.height = `${100 / rows}%`;
        tile.style.left = `${(c / cols) * 100}%`;
        tile.style.top = `${(r / rows) * 100}%`;
        tile.style.backgroundImage = `url("${src}")`;
        tile.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
        tile.style.backgroundPosition = `${xPct}% ${yPct}%`;

        // Scrambled starting pose
        const sx = (Math.random() * 160 - 80).toFixed(0);
        const sy = (Math.random() * 160 - 80).toFixed(0);
        const rot = (Math.random() * 80 - 40).toFixed(0);
        tile.style.setProperty("--sx", `${sx}px`);
        tile.style.setProperty("--sy", `${sy}px`);
        tile.style.setProperty("--srot", `${rot}deg`);
        tile.style.animationDelay = `${order[index] * 28}ms`;

        loader.appendChild(tile);
      }
    }

    giftBack.appendChild(loader);

    // After tiles assemble, show the clean full photo
    const settleMs = total * 28 + 700;
    scrambleTimer = window.setTimeout(() => {
      photoEl.classList.add("is-visible", "is-assembled");
      loader.classList.add("is-done");
      window.setTimeout(() => loader.remove(), 350);
      giftBack.classList.remove("is-scrambling");
    }, settleMs);
  }

  function showPhotoReveal() {
    cakeEl?.classList.add("is-hiding");
    cakeEl?.classList.remove("is-visible");
    giftBack?.classList.remove("show-cake");
    giftBack?.classList.add("show-photo", "photo-reveal");

    runScrambleLoader();

    if (typeof partyPopper === "function") partyPopper(giftFlip, "center");
    burstHearts(giftFlip, 10);
    burstBalloons(giftFlip, 8);
  }

  function openGift(event) {
    if (!giftFlip || giftFlip.classList.contains("is-open")) return;

    window.clearTimeout(photoTimer);
    resetRevealLayers();

    giftFlip.classList.add("is-open");
    openBtn?.setAttribute("aria-expanded", "true");
    burstHearts(event || openBtn || giftFlip, 12);
    burstBalloons(event || openBtn || giftFlip, 8);

    window.setTimeout(() => {
      showCakeReveal();
    }, 400);

    photoTimer = window.setTimeout(() => {
      showPhotoReveal();
    }, 400 + 2000);
  }

  function closeGift() {
    if (!giftFlip || !giftFlip.classList.contains("is-open")) return;
    window.clearTimeout(photoTimer);
    giftFlip.classList.remove("is-open");
    openBtn?.setAttribute("aria-expanded", "false");
    resetRevealLayers();
  }

  openBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    openGift(event);
  });

  giftFront?.addEventListener("click", (event) => {
    openGift(event);
  });

  giftBack?.addEventListener("click", (event) => {
    event.stopPropagation();
    closeGift();
  });
});
