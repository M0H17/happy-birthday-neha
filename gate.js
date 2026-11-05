(function initGate() {
  const unlocked = () => sessionStorage.getItem(GATE_STORAGE_KEY) === "1";

  const page = document.body?.dataset?.page;
  if (page && page !== "home" && !unlocked()) {
    window.location.replace("index.html");
    return;
  }

  if (page === "home" && unlocked()) {
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-unlocked");
    document.getElementById("gate")?.setAttribute("hidden", "");
    document.dispatchEvent(new CustomEvent("site-unlocked"));
    return;
  }

  if (page !== "home") return;

  document.addEventListener("DOMContentLoaded", () => {
    const gate = document.getElementById("gate");
    const panel = document.getElementById("gate-panel");
    const display = document.getElementById("gate-display");
    const status = document.getElementById("gate-status");
    const hint = document.getElementById("gate-hint");
    const keypad = document.getElementById("gate-keypad");
    const bubuFlash = document.getElementById("bubu-flash");
    const ageFlash = document.getElementById("age-flash");
    const ageNumber = document.getElementById("age-number");
    const bdayFlash = document.getElementById("bday-flash");
    const cakeStage = document.getElementById("cake-cut-stage");
    const cakeArea = document.getElementById("cake-cut-area");
    const knife = document.getElementById("cut-knife");
    const cutLine = document.getElementById("cut-line");
    const cutCake = document.getElementById("cut-cake");
    const serveSlice = document.getElementById("serve-slice");
    const swipeHint = document.getElementById("swipe-hint-anim");
    const bubuImage = document.getElementById("bubu-image");

    if (!gate || !display || !keypad) return;

    const expected = String(CONFIG.passcode || "143");
    const ageFrom = Number(CONFIG.ageFrom ?? 29);
    const ageTo = Number(CONFIG.ageTo ?? 30);
    let value = "";
    let busy = false;
    let cutDone = false;

    if (hint) hint.textContent = CONFIG.passcodeHint || "";

    if (bubuImage) setImageWithFallback(bubuImage, CONFIG.bubuImage, "bubu");
    if (cutCake) setImageWithFallback(cutCake, CONFIG.cakeImage, "cake");
    if (knife) setImageWithFallback(knife, CONFIG.knifeImage, "knife");
    if (serveSlice) setImageWithFallback(serveSlice, CONFIG.cakeSliceImage, "slice");

    function renderDisplay() {
      const slots = expected.length;
      let html = "";
      for (let i = 0; i < slots; i += 1) {
        html += `<span class="gate-dot${i < value.length ? " is-filled" : ""}"></span>`;
      }
      display.innerHTML = html;
    }

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg || "";
      status.classList.remove("is-error", "is-ok");
      if (kind) status.classList.add(kind);
    }

    function showEl(el) {
      if (!el) return;
      el.hidden = false;
      el.classList.add("is-active");
    }

    function hideEl(el) {
      if (!el) return;
      el.classList.remove("is-active");
      el.hidden = true;
    }

    function finishToSite() {
      sessionStorage.setItem(GATE_STORAGE_KEY, "1");
      document.body.classList.add("is-unlocked", "site-entering");
      document.body.classList.remove("is-locked", "is-unlocking");
      gate.classList.add("is-gone");
      window.setTimeout(() => {
        gate.setAttribute("hidden", "");
        document.dispatchEvent(new CustomEvent("site-unlocked"));
      }, 450);
    }

    function serveCakePiece() {
      if (!serveSlice) {
        window.setTimeout(finishToSite, 900);
        return;
      }
      serveSlice.hidden = false;
      cakeArea.classList.add("is-serving");
      serveSlice.classList.add("is-serving");

      if (typeof burstHearts === "function") burstHearts(cakeArea, 12);
      if (typeof partyPopper === "function") partyPopper(cakeArea, "center");

      window.setTimeout(finishToSite, 3200);
    }

    function setupCakeCut() {
      hideEl(bdayFlash);
      showEl(cakeStage);
      gate.classList.add("ceremony-mode");
      if (swipeHint) swipeHint.classList.add("is-playing");

      let dragging = false;
      let startY = 0;
      let progress = 0;
      const NEED = 130;

      function setKnife(y) {
        const clamped = Math.max(0, Math.min(y, 260));
        progress = clamped;
        knife.style.transform = `translate(-50%, ${clamped}px) rotate(18deg)`;
        cutLine.style.height = `${Math.max(8, clamped + 24)}px`;
        cutLine.style.opacity = String(Math.min(1, clamped / 40));
        if (clamped > 16 && swipeHint) swipeHint.classList.remove("is-playing");
      }

      function completeCut() {
        if (cutDone) return;
        cutDone = true;
        cakeArea.classList.add("is-cut");
        cutCake.classList.add("is-sliced");
        knife.style.transform = "translate(-50%, 240px) rotate(22deg)";
        cutLine.style.height = "92%";
        cutLine.style.opacity = "1";
        if (swipeHint) swipeHint.classList.remove("is-playing");

        if (typeof partyPopper === "function") partyPopper(cakeArea, "center");
        if (typeof burstHearts === "function") burstHearts(cakeArea, 10);

        window.setTimeout(serveCakePiece, 1400);
      }

      function onStart(clientY) {
        if (cutDone) return;
        dragging = true;
        startY = clientY;
        cakeArea.classList.add("is-dragging");
      }

      function onMove(clientY) {
        if (!dragging || cutDone) return;
        setKnife(clientY - startY);
      }

      function onEnd() {
        if (!dragging || cutDone) return;
        dragging = false;
        cakeArea.classList.remove("is-dragging");
        if (progress >= NEED) completeCut();
        else {
          knife.style.transition = "transform 0.3s ease";
          cutLine.style.transition = "height 0.3s ease, opacity 0.3s ease";
          setKnife(0);
          if (swipeHint) swipeHint.classList.add("is-playing");
          window.setTimeout(() => {
            knife.style.transition = "";
            cutLine.style.transition = "";
          }, 320);
        }
      }

      cakeArea.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        cakeArea.setPointerCapture?.(e.pointerId);
        onStart(e.clientY);
      });
      cakeArea.addEventListener("pointermove", (e) => onMove(e.clientY));
      cakeArea.addEventListener("pointerup", onEnd);
      cakeArea.addEventListener("pointercancel", onEnd);

      let touchStart = null;
      cakeStage.addEventListener(
        "touchstart",
        (e) => {
          touchStart = e.touches[0].clientY;
        },
        { passive: true }
      );
      cakeStage.addEventListener(
        "touchmove",
        (e) => {
          if (touchStart == null || cutDone) return;
          const dy = e.touches[0].clientY - touchStart;
          if (dy > 0) setKnife(dy);
        },
        { passive: true }
      );
      cakeStage.addEventListener("touchend", () => {
        if (cutDone) return;
        if (progress >= NEED) completeCut();
        else {
          setKnife(0);
          if (swipeHint) swipeHint.classList.add("is-playing");
        }
        touchStart = null;
      });

      setKnife(0);
    }

    function showBirthdayFlash() {
      hideEl(ageFlash);
      showEl(bdayFlash);

      const celebrate = () => {
        if (typeof partyPopper === "function") partyPopper(bdayFlash, "center");
        if (typeof burstHearts === "function") burstHearts(bdayFlash, 20);
        if (typeof burstBalloons === "function") burstBalloons(bdayFlash, 12);
      };

      celebrate();
      window.setTimeout(() => {
        if (typeof partyPopper === "function") partyPopper(bdayFlash, "left");
      }, 500);
      window.setTimeout(() => {
        if (typeof partyPopper === "function") partyPopper(bdayFlash, "right");
        if (typeof burstHearts === "function") burstHearts(bdayFlash, 12);
      }, 1000);
      window.setTimeout(celebrate, 1800);

      window.setTimeout(setupCakeCut, 3400);
    }

    function showAgeIncrement() {
      hideEl(panel);
      ageFlash.classList.remove("age-complete", "age-ticking");
      showEl(ageFlash);
      if (ageNumber) {
        ageNumber.classList.remove("is-bump");
        ageNumber.textContent = String(ageFrom);
      }
      const hint = document.getElementById("age-step-hint");
      if (hint) hint.textContent = `${ageFrom} → ${ageTo}`;

      if (typeof partyPopper === "function") partyPopper(ageFlash, "center");

      // Brief read of 29, then timer-style bump to 30
      window.setTimeout(() => {
        ageFlash.classList.add("age-ticking");
        if (ageNumber) {
          ageNumber.classList.remove("is-bump");
          void ageNumber.offsetWidth;
          ageNumber.textContent = String(ageTo);
          ageNumber.classList.add("is-bump");
        }
        if (typeof partyPopper === "function") {
          partyPopper(ageFlash, "left");
          partyPopper(ageFlash, "right");
        }
        if (typeof burstHearts === "function") burstHearts(ageFlash, 16);

        window.setTimeout(() => {
          ageFlash.classList.add("age-complete");
          if (hint) hint.textContent = `${ageTo} · locked in`;
          window.setTimeout(showBirthdayFlash, 1100);
        }, 1000);
      }, 900);
    }

    function unlockCeremony() {
      if (busy) return;
      busy = true;
      setStatus("Unlocked", "is-ok");
      gate.classList.add("is-unlocking");
      document.body.classList.add("is-unlocking");

      if (typeof partyPopper === "function") partyPopper(gate, "center");

      // Keypad fades, curtains part, then age timer 1s after curtains start
      window.setTimeout(() => {
        gate.classList.add("curtains-open");
        window.setTimeout(showAgeIncrement, 1000);
      }, 700);
    }

    function showBubuTryAgain() {
      if (busy) return;
      busy = true;
      gate.classList.add("is-wrong");
      if (panel) panel.style.visibility = "hidden";
      showEl(bubuFlash);
      setStatus("");

      window.setTimeout(() => {
        hideEl(bubuFlash);
        if (panel) panel.style.visibility = "";
        gate.classList.remove("is-wrong");
        value = "";
        renderDisplay();
        busy = false;
      }, 2400);
    }

    function press(key) {
      if (busy || gate.classList.contains("is-unlocking")) return;

      if (key === "clear") {
        value = "";
        setStatus("");
        renderDisplay();
        return;
      }

      if (key === "enter") {
        if (value === expected) unlockCeremony();
        else showBubuTryAgain();
        return;
      }

      if (value.length >= expected.length) return;
      value += key;
      setStatus("");
      renderDisplay();

      if (value.length === expected.length) {
        window.setTimeout(() => {
          if (value === expected) unlockCeremony();
          else showBubuTryAgain();
        }, 180);
      }
    }

    keypad.querySelectorAll("[data-key]").forEach((btn) => {
      btn.addEventListener("click", () => press(btn.dataset.key));
    });

    window.addEventListener("keydown", (event) => {
      if (gate.hasAttribute("hidden") || gate.classList.contains("ceremony-mode")) return;
      if (event.key >= "0" && event.key <= "9") press(event.key);
      else if (event.key === "Backspace") press("clear");
      else if (event.key === "Enter") press("enter");
    });

    renderDisplay();
  });
})();
