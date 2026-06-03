/* ================= CONFIG ================= */
    const TOTAL_ROUNDS = 5;

    /* ================= STATE ================= */
    let pool = [];
    let round = 1;
    let picks = [];

    /* ================= DOM ================= */
    const cardsEl = document.getElementById("cards");
    const boardEl = document.getElementById("board");
    const roundText = document.getElementById("roundText");
    //const finalBoard = document.getElementById("finalBoard");

    /* ================= RESET ================= */
    function resetGameState() {
      round = 1;
      picks = [];

      cardsEl.innerHTML = "";
      boardEl.innerHTML = "";
      //finalBoard.innerHTML = "";

      cardsEl.style.display = "flex";
      roundText.style.display = "block";
    }


    /* ================= START ================= */
    function startGame() {
      pool = Object.entries(getPeople(gender))
        .map(([name, img]) => ({ name, img }))
        .sort(() => Math.random() - 0.5);

      if (pool.length < TOTAL_ROUNDS * 2) {
        alert("Not enough people in this category.");
        return;
      }

      resetGameState();
      initBoard();
      renderRound();
    }

    /* ================= BOARD ================= */
    function initBoard() {
      for (let i = 0; i < TOTAL_ROUNDS; i++) {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.textContent = i + 1;
        boardEl.appendChild(slot);
      }
    }

    /* ================= ROUND ================= */
    function renderRound() {
      roundText.textContent = `Round ${round} of ${TOTAL_ROUNDS}`;
      cardsEl.innerHTML = "";

      const choices = pool.splice(0, 2);

      choices.forEach(person => {
        const card = document.createElement("div");
        card.className = "card hoverable";
        card.innerHTML = `
      ${person.img ? `<img src="${person.img}" draggable="false">` : ""}
      <p>${person.name}</p>
    `;
        card.onclick = () => pick(person);
        cardsEl.appendChild(card);
      });
    }

    /* ================= PICK ================= */
    function pick(person) {
      picks.push(person);

      const slot = boardEl.children[picks.length - 1];
      slot.classList.add("filled");
      slot.innerHTML = `
    ${person.img ? `<img src="${person.img}">` : ""}
    <div class="slot-name">${person.name}</div>
  `;

      if (round === TOTAL_ROUNDS) {
        endGame();
      } else {
        round++;
        renderRound();
      }
    }

    /* ================= END ================= */
    function endGame() {
      cardsEl.style.display = "none";
      roundText.style.display = "none";
      //finalBoard.innerHTML = boardEl.innerHTML;
    }

    /* ================= INIT ================= */
    document.addEventListener("DOMContentLoaded", () => {
      loadPeopleData(startGame);
    });

    document.getElementById("helpBtn").onclick = () => {
      const tooltip = document.getElementById("helpTooltip");
      tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
    };