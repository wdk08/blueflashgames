let items = [];
    let index = 0;

    const tierLimits = {
      S: 1,
      A: 2,
      B: 3,
      C: 4,
      D: 5,
      F: 6
    };
    let total = 21;

    const tiers = {
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      F: []
    };

    const img = document.getElementById("celeb-img");
    const nameEl = document.getElementById("celeb-name");
    const tiersEl = document.getElementById("tiers");

    function startGame() {
      index = 0;
      resetTiers();

      try {
        if (localStorage.getItem("s")) {
          tierLimits.S = parseInt(localStorage.getItem("s"));
          tierLimits.A = parseInt(localStorage.getItem("a"));
          tierLimits.B = parseInt(localStorage.getItem("b"));
          tierLimits.C = parseInt(localStorage.getItem("c"));
          tierLimits.D = parseInt(localStorage.getItem("d"));
          tierLimits.F = parseInt(localStorage.getItem("f"));
          total = Object.values(tierLimits).reduce((sum, n) => sum + n, 0);
        }
      } catch (e) {
        console.error("Error loading tier limits from localStorage:", e);
      }

      const pool = getPeople(gender);

      items = Object.entries(pool)
        .map(([name, img]) => ({ name, img }))
        .sort(() => Math.random() - 0.5)
        .slice(0, total);

      renderTiers();      // ✅ MUST happen before showNext
      updateTierStates(); // ✅ initialize counters
      showNext();
    }


    function showNext() {
      if (index >= items.length) {
        nameEl.textContent = "Tier Ranking Complete!";
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

      updateTierStates();
    }

    function renderTiers() {
      tiersEl.innerHTML = "";

      Object.keys(tiers).forEach(tier => {
        const row = document.createElement("div");
        row.className = "tier";
        row.dataset.tier = tier;

        row.innerHTML = `
      <div class="tier-header">
        <div class="tier-label">${tier}</div>
        <div class="tier-count" id="count-${tier}"></div>
      </div>
      <div class="tier-cards"></div>
    `;

        row.addEventListener("click", () => assignTier(tier));
        tiersEl.appendChild(row);
      });

      updateTierStates();
    }


    function assignTier(tier) {
      if (index >= items.length) return;
      if (tiers[tier].length >= tierLimits[tier]) return;

      const item = items[index];
      tiers[tier].push(item);

      const row = document.querySelector(
        `.tier[data-tier="${tier}"] .tier-cards`
      );

      const card = document.createElement("div");
      card.className = "card tier-card";

      card.innerHTML = `
    <img src="${item.img}" draggable="false">
    <p>${item.name}</p>
  `;

      row.appendChild(card);

      updateTierStates(); // ✅ THIS is the missing piece

      index++;
      showNext();
    }



    function updateTierStates() {
      document.querySelectorAll(".tier").forEach(row => {
        const tier = row.dataset.tier;
        const used = tiers[tier].length;
        const max = tierLimits[tier];

        const label = max === Infinity
          ? `${used} placed`
          : `${used} / ${max}`;

        document.getElementById(`count-${tier}`).textContent = label;

        row.classList.toggle("full", used >= max);
      });
    }


    function resetTiers() {
      for (const t in tiers) {
        tiers[t] = [];
      }
      tiersEl.innerHTML = "";
    }

    document.getElementById("editCategories").onclick = () => {
      document.getElementById("editform").style.display = "block";
    };

    document.getElementById("saveCategories").onclick = () => {
      const s = document.getElementById("editS").value || 1;
      const a = document.getElementById("editA").value || 2;
      const b = document.getElementById("editB").value || 3;
      const c = document.getElementById("editC").value || 4;
      const d = document.getElementById("editD").value || 5;
      const f = document.getElementById("editF").value || 6;

      tierLimits.S = parseInt(s);
      tierLimits.A = parseInt(a);
      tierLimits.B = parseInt(b);
      tierLimits.C = parseInt(c);
      tierLimits.D = parseInt(d);
      tierLimits.F = parseInt(f);

      try {
        localStorage.setItem("s", tierLimits.S);
        localStorage.setItem("a", tierLimits.A);
        localStorage.setItem("b", tierLimits.B);
        localStorage.setItem("c", tierLimits.C);
        localStorage.setItem("d", tierLimits.D);
        localStorage.setItem("f", tierLimits.F);
      } catch (e) {
        console.error("Error saving tier limits to localStorage:", e);
      }

      total = Object.values(tierLimits).reduce((sum, n) => sum + n, 0);

      document.getElementById("editform").style.display = "none";

      renderTiers();
      startGame();
    };

    document.getElementById("resetCategories").onclick = () => {
      localStorage.removeItem("s");
      localStorage.removeItem("a");
      localStorage.removeItem("b");
      localStorage.removeItem("c");
      localStorage.removeItem("d");
      localStorage.removeItem("f");

      tierLimits.S = 1;
      tierLimits.A = 2;
      tierLimits.B = 3;
      tierLimits.C = 4;
      tierLimits.D = 5;
      tierLimits.F = 6;
      total = 21;

      document.getElementById("editform").style.display = "none";

      renderTiers();
      startGame();
    };

    document.getElementById("cancelEdit").onclick = () => {
      document.getElementById("editform").style.display = "none";
    };

    loadPeopleData(startGame);
    document.getElementById("helpBtn").onclick = () => {
      const tooltip = document.getElementById("helpTooltip");
      tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
    };