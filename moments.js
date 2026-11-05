document.addEventListener("DOMContentLoaded", () => {
  const deckEl = document.getElementById("swipe-deck");
  const stageEl = document.getElementById("swipe-stage");
  const counterEl = document.getElementById("swipe-counter");
  const emptyEl = document.getElementById("swipe-empty");
  const doneEl = document.getElementById("moments-done");
  const hintEl = document.getElementById("swipe-hint");
  const btnLeft = document.getElementById("btn-swipe-left");
  const btnRight = document.getElementById("btn-swipe-right");
  const btnReshuffle = document.getElementById("btn-reshuffle");

  if (!deckEl) return;

  const THRESHOLD = 110;
  let cards = [];
  let index = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let activeCard = null;

  function buildDeck() {
    deckEl.innerHTML = "";
    cards = CONFIG.gallery.map((item, i) => {
      const card = document.createElement("article");
      card.className = "swipe-card";
      card.dataset.index = String(i);

      const stampKeep = document.createElement("span");
      stampKeep.className = "swipe-stamp stamp-keep";
      stampKeep.textContent = "Keep";

      const stampSkip = document.createElement("span");
      stampSkip.className = "swipe-stamp stamp-skip";
      stampSkip.textContent = "Next";

      const img = document.createElement("img");
      img.alt = item.caption || `Moment ${i + 1}`;
      img.draggable = false;
      setImageWithFallback(img, item.src, `moment-${i + 1}`);

      card.append(stampKeep, stampSkip, img);
      deckEl.appendChild(card);
      return card;
    });

    index = 0;
    updateUI();
    layoutStack();
  }

  function remaining() {
    return cards.length - index;
  }

  function topCard() {
    return cards[index] || null;
  }

  function layoutStack() {
    cards.forEach((card, i) => {
      const offset = i - index;
      card.classList.remove("is-top", "is-gone", "is-dragging");
      card.style.transition = "";
      card.style.transform = "";
      card.style.opacity = "";
      card.style.pointerEvents = "none";

      if (offset < 0) {
        card.classList.add("is-gone");
        card.style.opacity = "0";
        return;
      }

      if (offset === 0) {
        card.classList.add("is-top");
        card.style.zIndex = String(40);
        card.style.transform = "translate3d(0,0,0) scale(1)";
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
        return;
      }

      if (offset === 1) {
        card.style.zIndex = String(30);
        card.style.transform = "translate3d(0, 12px, 0) scale(0.96)";
        card.style.opacity = "0.95";
        return;
      }

      if (offset === 2) {
        card.style.zIndex = String(20);
        card.style.transform = "translate3d(0, 22px, 0) scale(0.92)";
        card.style.opacity = "0.7";
        return;
      }

      card.style.zIndex = String(10);
      card.style.transform = "translate3d(0, 28px, 0) scale(0.9)";
      card.style.opacity = "0";
    });
  }

  function updateUI() {
    const total = cards.length;
    const current = Math.min(index + 1, total);
    counterEl.textContent = remaining() === 0 ? `${total} / ${total}` : `${current} / ${total}`;

    const finished = remaining() === 0;
    emptyEl.hidden = !finished;
    doneEl.hidden = !finished;
    hintEl.hidden = finished;
    btnLeft.disabled = finished;
    btnRight.disabled = finished;
    stageEl.classList.toggle("is-finished", finished);
  }

  function applyDrag(dx, dy) {
    if (!activeCard) return;
    const rot = dx * 0.06;
    activeCard.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg)`;
    activeCard.style.transition = "none";

    const keep = Math.min(Math.max(dx / THRESHOLD, 0), 1);
    const skip = Math.min(Math.max(-dx / THRESHOLD, 0), 1);
    activeCard.style.setProperty("--keep", String(keep));
    activeCard.style.setProperty("--skip", String(skip));
    stageEl.classList.toggle("lean-right", dx > 40);
    stageEl.classList.toggle("lean-left", dx < -40);
  }

  function resetDragStyles() {
    stageEl.classList.remove("lean-right", "lean-left");
    if (activeCard) {
      activeCard.style.removeProperty("--keep");
      activeCard.style.removeProperty("--skip");
    }
  }

  function flyOut(direction) {
    const card = topCard();
    if (!card) return;

    const x = direction === "right" ? window.innerWidth * 1.2 : -window.innerWidth * 1.2;
    const rot = direction === "right" ? 28 : -28;
    card.style.transition = "transform 0.35s ease, opacity 0.35s ease";
    card.style.transform = `translate3d(${x}px, -40px, 0) rotate(${rot}deg)`;
    card.style.opacity = "0";
    card.classList.add("is-gone");

    partyPopper(card, direction === "right" ? "right" : "left");
    if (direction === "right") {
      burstHearts(card, 8);
      burstBalloons(card, 6);
    } else {
      burstBalloons(card, 5);
    }

    index += 1;
    window.setTimeout(() => {
      resetDragStyles();
      updateUI();
      layoutStack();
    }, 280);
  }

  function snapBack() {
    const card = topCard();
    if (!card) return;
    card.style.transition = "transform 0.28s ease";
    card.style.transform = "translate3d(0,0,0) rotate(0deg)";
    resetDragStyles();
    window.setTimeout(() => layoutStack(), 280);
  }

  function decideSwipe() {
    if (Math.abs(deltaX) > THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      flyOut(deltaX > 0 ? "right" : "left");
    } else {
      snapBack();
    }
  }

  function onPointerDown(event) {
    const card = topCard();
    if (!card || event.button === 2) return;

    dragging = true;
    activeCard = card;
    activeCard.classList.add("is-dragging");
    startX = event.clientX;
    startY = event.clientY;
    deltaX = 0;
    deltaY = 0;

    card.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (!dragging || !activeCard) return;
    deltaX = event.clientX - startX;
    deltaY = event.clientY - startY;
    // Prefer horizontal feel; dampen vertical a bit
    applyDrag(deltaX, deltaY * 0.35);
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    if (activeCard) activeCard.classList.remove("is-dragging");
    decideSwipe();
    activeCard = null;
  }

  deckEl.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  btnLeft.addEventListener("click", () => flyOut("left"));
  btnRight.addEventListener("click", () => {
    flyOut("right");
  });

  btnReshuffle?.addEventListener("click", () => {
    buildDeck();
  });

  buildDeck();
});
