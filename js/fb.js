/* ================= STATE ================= */
    let pool = [];
    let current = null;
    let activeCard = null;
    let filledCount = 0;
    let sourceSlot = null;


    const MAX_PLAYERS = 11;

    /* ================= RESET ================= */
    function resetGameState() {
      pool = [];
      current = null;
      activeCard = null;
      filledCount = 0;

      const cardMount = document.getElementById("cardMount");
      if (cardMount) cardMount.innerHTML = "";

      document.querySelectorAll(".slot").forEach(slot => {
        slot.classList.remove("filled", "hover");
        slot.innerHTML = slot.dataset.pos;
        slot.player = null;
        slot.draggable = false;
      });
    }

    /* ================= START ================= */
    function startGame() {
      const cardMount = document.getElementById("cardMount");
      if (!cardMount) return;

      pool = Object.entries(getPeople(gender))
        .map(([name, img]) => ({ name, img }))
        .sort(() => Math.random() - 0.5);

      spawnNextCard();
    }

    /* ================= CARD ================= */
    function createCard(player) {
      const card = document.createElement("div");
      card.className = "card center";
      card.draggable = true;
      card.player = player;

      card.innerHTML = `
    ${player.img ? `<img src="${player.img}">` : ""}
    <p>${player.name}</p>
  `;

      card.addEventListener("dragstart", () => {
        activeCard = card;
      });

      return card;
    }

    function spawnNextCard() {
      const cardMount = document.getElementById("cardMount");
      if (!cardMount) return;

      if (filledCount >= MAX_PLAYERS || pool.length === 0) {
        endGame();
        return;
      }

      current = pool.pop();

      if (activeCard) activeCard.remove();
      activeCard = createCard(current);
      cardMount.appendChild(activeCard);
    }

    /* ================= SLOTS ================= */
    document.querySelectorAll(".slot").forEach(slot => {
      slot.addEventListener("dragover", e => {
        if (slot.classList.contains("filled")) return;
        e.preventDefault();
        slot.classList.add("hover");
      });

      slot.addEventListener("dragleave", () => {
        slot.classList.remove("hover");
      });

      slot.addEventListener("drop", e => {
        e.preventDefault();
        slot.classList.remove("hover");

        if (!activeCard || slot.classList.contains("filled")) return;

        // Moving from another slot
        if (sourceSlot && sourceSlot !== slot) {
          fillSlot(slot, sourceSlot.player);
          clearSlot(sourceSlot);
          sourceSlot = null;
          activeCard = null;
          return;
        }

        // Dropping from cardMount
        fillSlot(slot, activeCard.player);
        filledCount++;
        activeCard.remove();
        activeCard = null;
        spawnNextCard();
      });


      slot.addEventListener("dragstart", () => {
        if (!slot.classList.contains("filled")) return;
        activeCard = slot;
        sourceSlot = slot;
      });

    });


    function clearSlot(slot) {
      slot.classList.remove("filled");
      slot.player = null;
      slot.draggable = false;
      slot.innerHTML = slot.dataset.pos;
    }


    /* ================= SLOT FILL ================= */
    function fillSlot(slot, player) {
      slot.classList.add("filled");
      slot.player = player;
      slot.draggable = true;

      slot.innerHTML = `
    ${player.img ? `<img src="${player.img}">` : ""}
    <div class="slot-name">
      <small>${slot.dataset.pos}</small><br>
      ${player.name}
    </div>
  `;
    }

    /* ================= END ================= */
    function endGame() {
      const cardMount = document.getElementById("cardMount");
      if (cardMount) {
        cardMount.innerHTML = "<h2>🏈 Lineup Complete!</h2>";
      }
    }

    /* ================= INIT ================= */
    loadPeopleData(startGame);

    document.getElementById("helpBtn").onclick = () => {
      const tooltip = document.getElementById("helpTooltip");
      tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
    };