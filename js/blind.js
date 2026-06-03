    let items = [];
    let index = 0;

    const card = document.getElementById("cardToRank");
    const img = document.getElementById("celeb-img");
    const nameEl = document.getElementById("celeb-name");

    let totalSlots = 10;

    try {
      totalSlots = parseInt(localStorage.getItem("blindSlots")) || 10;
    } catch (e) {
      totalSlots = 10;
    }

    function buildGrid() {
      const grid = document.getElementById("rankingGrid");

      grid.innerHTML = "";

      for (let i = 1; i <= totalSlots; i++) {
        const slot = document.createElement("div");

        slot.className = "slot hoverable";
        slot.dataset.rank = i;
        slot.textContent = i;

        slot.addEventListener("click", handleSlotClick);

        grid.appendChild(slot);
      }
    }

    function handleSlotClick() {
      const slot = this;

      if (slot.classList.contains("filled")) return;
      if (index >= items.length) return;

      const item = items[index];

      slot.classList.add("filled");

      slot.innerHTML = `
      <strong>${slot.dataset.rank}. ${item.name}</strong>
      ${item.img ? `<img src="${item.img}" draggable="false">` : ""}
    `;

      index++;
      showNext();
    }

    function startGame() {
      buildGrid();

      index = 0;
      resetSlots();

      const pool = getPeople(gender);

      items = Object.entries(pool)
        .map(([name, img]) => ({ name, img }))
        .sort(() => Math.random() - 0.5)
        .slice(0, totalSlots);

      showNext();
    }

    function showNext() {
      if (index >= items.length) {
        nameEl.textContent = "Ranking Complete!";
        img.style.display = "none";
        return;
      }

      const item = items[index];

      nameEl.textContent = item.name;

      if (item.img) {
        img.src = item.img;
        img.style.display = "block";
      } else {
        img.style.display = "none";
      }
    }

    function resetSlots() {
      document.querySelectorAll(".slot").forEach(slot => {
        slot.classList.remove("filled");
        slot.textContent = slot.dataset.rank;
      });
    }

    loadPeopleData(startGame);

    /* =========================
       CUSTOMIZATION
    ========================= */

    document.getElementById("editnum").value = totalSlots;

    document.getElementById("saveCategories").onclick = () => {
      let num = parseInt(document.getElementById("editnum").value);

      if (isNaN(num) || num < 2) {
        num = 10;
      }

      localStorage.setItem("blindSlots", num);

      totalSlots = num;

      document.getElementById("editform").style.display = "none";

      restartGame();
    };

    document.getElementById("resetCategories").onclick = () => {
      localStorage.removeItem("blindSlots");

      totalSlots = 10;

      document.getElementById("editnum").value = 10;

      document.getElementById("editform").style.display = "none";

      restartGame();
    };

    document.getElementById("cancelEdit").onclick = () => {
      document.getElementById("editform").style.display = "none";
    };

    document.getElementById("helpBtn").onclick = () => {
      const tooltip = document.getElementById("helpTooltip");
      tooltip.style.display =
        tooltip.style.display === "block" ? "none" : "block";
    };

    document.getElementById("editCategories").onclick = () => {
      document.getElementById("editnum").value = totalSlots;
      document.getElementById("editform").style.display = "block";
    };