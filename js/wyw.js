/* =========================
     GAME STATE
  ========================= */

  const choicesDiv = document.querySelector(".choices");

  let pool = [];
  let eliminated = [];
  let currentChampion = null;
  let challenger = null;

  /* =========================
     GAME START
  ========================= */

  loadPeopleData(() => {
    startGame();
  });

  /* =========================
     START / RESET GAME
  ========================= */

  function startGame() {
    const data = getPeople(gender);
    const entries = Object.entries(data);

    if (!entries.length) {
      choicesDiv.innerHTML = "<p>No data available</p>";
      return;
    }

    pool = shuffle(
      entries.map(([name, img]) => ({ name, img }))
    );

    eliminated = [];
    currentChampion = pool.shift();
    challenger = pool.shift();

    renderChoices();
  }

  /* =========================
     RENDER
  ========================= */

  function renderChoices() {
    choicesDiv.innerHTML = "";

    if (!currentChampion) return;

    if (!challenger) {
      showWinner();
      return;
    }

    [currentChampion, challenger].forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card hoverable";

      card.innerHTML = `
      ${item.img ? `<img src="${item.img}" draggable="false">` : ""}
      <p>${item.name}</p>
    `;

      card.onclick = () => choose(index);
      choicesDiv.appendChild(card);
    });
  }

  /* =========================
     GAME LOGIC
  ========================= */

  function choose(index) {
    const winner = index === 0 ? currentChampion : challenger;
    const loser = index === 0 ? challenger : currentChampion;

    eliminated.push(loser);
    currentChampion = winner;

    if (pool.length === 0) {
      showWinner();
      return;
    }

    challenger = pool.shift();
    renderChoices();
  }

  /* =========================
     END
  ========================= */

  function showWinner() {
    choicesDiv.innerHTML = `
    <div class="winner">
      <h2>Winner 🏆</h2>
      ${currentChampion.img ? `<img src="${currentChampion.img}">` : ""}
      <h3>${currentChampion.name}</h3>
      <p>Defeated ${eliminated.length} others</p>
    </div>
  `;
  }

  /* =========================
     UTIL
  ========================= */

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  document.getElementById("helpBtn").onclick = () => {
    const tooltip = document.getElementById("helpTooltip");
    tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
  };