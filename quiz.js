const state = {
  index: 0,
  yesCount: 0,
  noCount: 0,
};

document.addEventListener("DOMContentLoaded", () => {
  const els = {
    progressBar: document.getElementById("progress-bar"),
    progressLabel: document.getElementById("progress-label"),
    panel: document.getElementById("question-panel"),
    kicker: document.getElementById("question-kicker"),
    question: document.getElementById("question-text"),
    reaction: document.getElementById("reaction"),
    btnYes: document.getElementById("btn-yes"),
    btnNo: document.getElementById("btn-no"),
  };

  let lastLeft = null;
  let lastTop = null;
  let lastFleeAt = 0;

  function resetNoButton() {
    lastLeft = null;
    lastTop = null;
    els.btnNo.classList.remove("is-fleeing");
    els.btnNo.style.left = "";
    els.btnNo.style.top = "";
    els.btnNo.style.right = "";
    els.btnNo.style.transform = "";
  }

  function renderQuestion() {
    const q = QUESTIONS[state.index];
    const n = state.index + 1;
    const total = QUESTIONS.length;

    els.kicker.textContent = `Heart ${n}`;
    els.question.textContent = q.text;
    els.reaction.hidden = true;
    els.reaction.textContent = "";
    els.progressLabel.textContent = `Heart ${n} of ${total}`;
    els.progressBar.style.width = `${(n / total) * 100}%`;

    resetNoButton();
    els.panel.classList.remove("is-leaving");
    els.panel.classList.add("is-entering");
  }

  function showReaction(answer) {
    const q = QUESTIONS[state.index];
    els.reaction.hidden = false;
    els.reaction.textContent = answer === "yes" ? q.yes : q.no;
  }

  function goToFinale() {
    localStorage.setItem(
      QUIZ_STORAGE_KEY,
      JSON.stringify({
        yesCount: state.yesCount,
        noCount: state.noCount,
        total: QUESTIONS.length,
      })
    );
    window.location.href = "finale.html";
  }

  function nextQuestion() {
    els.panel.classList.add("is-leaving");
    window.setTimeout(() => {
      state.index += 1;
      if (state.index >= QUESTIONS.length) {
        goToFinale();
        return;
      }
      renderQuestion();
    }, 280);
  }

  /** Read finger/cursor position from mouse, pointer, or touch events */
  function getPoint(event) {
    if (!event) return null;
    if (typeof event.clientX === "number" && event.pointerType !== undefined) {
      return { x: event.clientX, y: event.clientY };
    }
    if (typeof event.clientX === "number" && event.type !== "touchstart" && event.type !== "touchend") {
      return { x: event.clientX, y: event.clientY };
    }
    const touch = event.touches?.[0] || event.changedTouches?.[0];
    if (touch) return { x: touch.clientX, y: touch.clientY };
    if (typeof event.clientX === "number") return { x: event.clientX, y: event.clientY };
    return null;
  }

  /** Always move No somewhere else — never settles / never accepts */
  function fleeNoButton(event) {
    const now = Date.now();
    // Avoid double-flee from touchstart + click on the same tap
    if (now - lastFleeAt < 120) return;
    lastFleeAt = now;

    const panel = els.panel.getBoundingClientRect();
    const btnW = Math.min(120, panel.width * 0.42);
    const btnH = 48;
    const pad = 10;

    const maxLeft = Math.max(pad, panel.width - btnW - pad);
    const maxTop = Math.max(pad, panel.height - btnH - pad);

    const point = getPoint(event);
    let fingerX = panel.width / 2;
    let fingerY = panel.height * 0.75;
    if (point) {
      fingerX = point.x - panel.left;
      fingerY = point.y - panel.top;
    }

    let left = pad;
    let top = pad;
    let tries = 0;

    do {
      if (fingerX < panel.width / 2) {
        left = panel.width * 0.52 + Math.random() * Math.max(8, maxLeft - panel.width * 0.52);
      } else {
        left = pad + Math.random() * Math.max(pad, panel.width * 0.38 - pad);
      }

      if (fingerY < panel.height / 2) {
        top = panel.height * 0.55 + Math.random() * Math.max(20, maxTop - panel.height * 0.55);
      } else {
        top = pad + Math.random() * Math.max(20, panel.height * 0.4);
      }

      left = Math.min(Math.max(pad, left), maxLeft);
      top = Math.min(Math.max(pad, top), maxTop);
      tries += 1;
    } while (
      tries < 16 &&
      ((lastLeft != null && Math.hypot(left - lastLeft, top - (lastTop || 0)) < 70) ||
        Math.hypot(left - fingerX, top - fingerY) < 110)
    );

    lastLeft = left;
    lastTop = top;

    els.btnNo.classList.add("is-fleeing");
    els.btnNo.style.left = `${left}px`;
    els.btnNo.style.top = `${top}px`;
    els.btnNo.style.right = "auto";

    els.reaction.hidden = false;
    els.reaction.textContent = "Nice try — Yes is the only way.";
  }

  function blockNo(event) {
    event.preventDefault();
    event.stopPropagation();
    fleeNoButton(event);
  }

  els.btnYes.addEventListener("click", (event) => {
    state.yesCount += 1;
    showReaction("yes");
    burstHearts(event, 14);
    burstBalloons(event, 8);
    els.panel.classList.add("love-pulse");
    window.setTimeout(() => els.panel.classList.remove("love-pulse"), 600);
    window.setTimeout(nextQuestion, 1100);
  });

  // Desktop hover
  els.btnNo.addEventListener("mouseenter", fleeNoButton);

  // Touch + stylus + mouse press (phones use this)
  els.btnNo.addEventListener("pointerdown", blockNo, { passive: false });
  els.btnNo.addEventListener("touchstart", blockNo, { passive: false });
  els.btnNo.addEventListener("click", blockNo);

  renderQuestion();
});
