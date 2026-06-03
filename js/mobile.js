let selectedCard = null;

/* -----------------------------
   CLICK TO SELECT CARD
------------------------------ */
document.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  // Toggle select
  if (selectedCard === card) {
    card.classList.remove("selected-card");
    selectedCard = null;
    return;
  }

  document.querySelectorAll(".selected-card")
    .forEach(c => c.classList.remove("selected-card"));

  selectedCard = card;
  card.classList.add("selected-card");
});

/* -----------------------------
   CLICK TO DROP
------------------------------ */
document.addEventListener("click", e => {
  const zone = e.target.closest(".drop-zone");
  if (!zone || !selectedCard) return;

  const decision = zone.dataset.decision;

  zone.appendChild(selectedCard);

  // 🔥 SAME LOGIC AS DRAG & DROP
  handleDrop(selectedCard, decision);

  selectedCard.classList.remove("selected-card");
  selectedCard = null;
});
