document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("finale-title");
  const messageEl = document.getElementById("finale-message");
  const imageEl = document.getElementById("finale-image");
  const restartBtn = document.getElementById("btn-restart");
  const name = CONFIG.name;

  // Prefer a personal finale photo; fall back to cake
  if (imageEl) {
    imageEl.src = CONFIG.finaleImage;
    imageEl.onerror = () => {
      imageEl.onerror = null;
      setImageWithFallback(imageEl, CONFIG.cakeImage, "cake");
    };
  }

  let result = null;
  try {
    result = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY) || "null");
  } catch {
    result = null;
  }

  const yes = result?.yesCount ?? 0;
  const no = result?.noCount ?? 0;
  const total = result?.total ?? QUESTIONS.length;

  if (titleEl) {
    titleEl.textContent =
      yes >= 7
        ? `${name}, you said yes to us.`
        : `Happy Birthday, ${name}.`;
  }

  if (messageEl) {
    messageEl.textContent =
      result == null
        ? `${name}, whenever you’re ready, the heart check is waiting for you.`
        : yes >= 7
          ? `You answered yes ${yes} out of ${total} times. That’s not a quiz score — that’s a promise I’m keeping. Happy birthday, ${name}. Here’s to your day, and to every day after it.`
          : `You gave ${yes} yes${yes === 1 ? "" : "es"} and ${no} no${no === 1 ? "" : "s"}. Either way, you still win — because today belongs to ${name}.`;
  }

  document.body.classList.add("is-celebrating");
  startCelebrationRain(yes >= 7 ? 6500 : 4000);
  window.setTimeout(() => {
    burstHearts(imageEl || null, 18);
    burstBalloons(imageEl || null, 10);
  }, 400);

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
      window.location.href = "quiz.html";
    });
  }
});
