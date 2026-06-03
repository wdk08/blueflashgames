/* =========================
       GAME STATE
    ========================= */

    const celebGrid = document.querySelector(".celeb-grid");
    const zones = document.querySelectorAll(".zone");

    let celebNames = [];
    let currentIndex = 0;
    let currentSet = [];
    let results = [];
    let currentChoices = { Kiss: null, Marry: null, Kill: null };

    let draggedCard = null;

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

      celebNames = shuffle(Object.keys(data));
      currentIndex = 0;
      results = [];

      try {
        if (localStorage.getItem("kissCategory")) {
          document.querySelector('.zone[data-zone="Kiss"] h3').textContent = localStorage.getItem("kissCategory");
        }
        if (localStorage.getItem("marryCategory")) {
          document.querySelector('.zone[data-zone="Marry"] h3').textContent = localStorage.getItem("marryCategory");
        }
        if (localStorage.getItem("killCategory")) {
          document.querySelector('.zone[data-zone="Kill"] h3').textContent = localStorage.getItem("killCategory");
        }
      } catch (e) {
        console.error("Error accessing localStorage:", e);
      }

      nextRound();
    }

    /* =========================
       GAME ROUND
    ========================= */

    function nextRound() {
      if (currentIndex + 3 > celebNames.length) {
        endGame();
        return;
      }

      currentSet = celebNames.slice(currentIndex, currentIndex + 3);
      currentIndex += 3;

      currentChoices = { Kiss: null, Marry: null, Kill: null };

      celebGrid.innerHTML = "";
      zones.forEach(zone => {
        zone.classList.remove("filled");
        zone.querySelectorAll(".card").forEach(c => c.remove());
      });

      currentSet.forEach(name => {
        celebGrid.appendChild(createCard(name));
      });
    }

    /* =========================
       CARD CREATION
    ========================= */

    function createCard(name) {
      const div = document.createElement("div");
      div.className = "card hoverable";
      div.draggable = true;
      div.dataset.name = name;

      const img = getPeople(gender)[name];

      div.innerHTML = `
    ${img ? `<img src="${img}" draggable="false">` : ""}
    <p>${name}</p>
  `;

      div.addEventListener("dragstart", e => {
        draggedCard = div;
        e.dataTransfer.setData("text/plain", "");
      });

      return div;
    }

    /* =========================
       DRAG & DROP
    ========================= */

    function allowDrop(e) {
      e.preventDefault();
    }

    function dropToZone(e, zone) {
      e.preventDefault();
      if (!draggedCard) return;

      removeFromAllSlots(draggedCard.dataset.name);

      const key = zone.dataset.zone;
      currentChoices[key] = draggedCard.dataset.name;

      zone.classList.add("filled");
      draggedCard.classList.add("in-slot");
      zone.appendChild(draggedCard);

      draggedCard = null;

      if (Object.values(currentChoices).every(Boolean)) {
        results.push({ ...currentChoices });
        setTimeout(nextRound, 900);
      }
    }

    function dropToPool(e) {
      e.preventDefault();
      if (!draggedCard) return;

      removeFromAllSlots(draggedCard.dataset.name);
      draggedCard.classList.remove("in-slot");
      celebGrid.appendChild(draggedCard);
      draggedCard = null;
    }

    function removeFromAllSlots(name) {
      for (const key in currentChoices) {
        if (currentChoices[key] === name) {
          currentChoices[key] = null;
          document.querySelector(`.zone[data-zone="${key}"]`)
            .classList.remove("filled");
        }
      }
    }

    /* =========================
       GAME END
    ========================= */

    function endGame() {
      document.body.innerHTML = `
    <h2>Game Over</h2>
    ${results.map((r, i) => `
      <p>Round ${i + 1}: 💋 ${r.Kiss}, 💍 ${r.Marry}, ☠️ ${r.Kill}</p>
    `).join("")}
    <br>
    <a href="kmk.html">Play Again</a>
  `;
    }

    /* =========================
       EVENTS
    ========================= */

    zones.forEach(zone => {
      zone.addEventListener("dragover", allowDrop);
      zone.addEventListener("drop", e => dropToZone(e, zone));
    });

    celebGrid.addEventListener("dragover", allowDrop);
    celebGrid.addEventListener("drop", dropToPool);

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

    document.getElementById("editCategories").onclick = () => {
      document.getElementById("editform").style.display = "block";
    };

    document.getElementById("saveCategories").onclick = () => {
      const kiss = document.getElementById("editKiss").value.trim() || "Kiss";
      const marry = document.getElementById("editMarry").value.trim() || "Marry";
      const kill = document.getElementById("editKill").value.trim() || "Kill";

      localStorage.setItem("kissCategory", kiss);
      localStorage.setItem("marryCategory", marry);
      localStorage.setItem("killCategory", kill);


      document.querySelector('.zone[data-zone="Kiss"] h3').textContent = `${kiss}`;
      document.querySelector('.zone[data-zone="Marry"] h3').textContent = `${marry}`;
      document.querySelector('.zone[data-zone="Kill"] h3').textContent = `${kill}`;

      document.getElementById("editform").style.display = "none";
    };

    document.getElementById("resetCategories").onclick = () => {
      localStorage.removeItem("kissCategory");
      localStorage.removeItem("marryCategory");
      localStorage.removeItem("killCategory");

      document.querySelector('.zone[data-zone="Kiss"] h3').textContent = "Kiss";
      document.querySelector('.zone[data-zone="Marry"] h3').textContent = "Marry";
      document.querySelector('.zone[data-zone="Kill"] h3').textContent = "Kill";

      document.getElementById("editform").style.display = "none";
    };

    document.getElementById("cancelEdit").onclick = () => {
      document.getElementById("editform").style.display = "none";
    };
    document.getElementById("helpBtn").onclick = () => {
      const tooltip = document.getElementById("helpTooltip");
      tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
    };