document.addEventListener("DOMContentLoaded", () => {
  const about = CONFIG.about || {};
  const introEl = document.getElementById("about-intro");
  const headlineEl = document.getElementById("about-headline");
  const traitsEl = document.getElementById("about-traits");
  const favoritesEl = document.getElementById("about-favorites");
  const closingEl = document.getElementById("about-closing");

  if (introEl) introEl.textContent = about.intro || "";
  if (headlineEl) headlineEl.textContent = about.headline || "";
  if (closingEl) closingEl.textContent = about.closing || "";

  if (traitsEl && Array.isArray(about.traits)) {
    traitsEl.innerHTML = "";
    about.traits.forEach((trait) => {
      const card = document.createElement("article");
      card.className = "about-trait";
      const title = document.createElement("h3");
      title.textContent = trait.title || "";
      const text = document.createElement("p");
      text.textContent = trait.text || "";
      card.append(title, text);
      traitsEl.appendChild(card);
    });
  }

  if (favoritesEl && Array.isArray(about.favorites)) {
    favoritesEl.innerHTML = "";
    about.favorites.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      favoritesEl.appendChild(li);
    });
  }
});
