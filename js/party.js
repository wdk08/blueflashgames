/* =========================
       DEFAULTS + STORAGE
    ========================= */

    const DEFAULT_SETTINGS = {
      slots: ["Invited You", "Decorator", "Chef"],
      allowRepeats: false
    };

    function loadSettings() {
      const saved = localStorage.getItem("partyBuilderSettings");
      return saved ? JSON.parse(saved) : { ...DEFAULT_SETTINGS };
    }

    function saveSettings() {
      localStorage.setItem("partyBuilderSettings", JSON.stringify({
        slots,
        allowRepeats
      }));
    }

    /* =========================
       GAME STATE
    ========================= */

    const card = document.getElementById("currentCard");
    const celebImg = document.getElementById("celeb-img");
    const celebName = document.getElementById("celeb-name");
    const slotsWrap = document.querySelector(".slots");

    let people = {};
    let celebNames = [];
    let index = 0;

    let { slots, allowRepeats } = loadSettings();
    let assignments = {};

    /* =========================
       START
    ========================= */

    loadPeopleData(startGame);

    function startGame() {
      people = getPeople(gender);
      celebNames = shuffle(Object.keys(people));
      index = 0;
      assignments = {};

      card.style.display = "block";
      renderSlots();
      showNextPerson();
    }

    /* =========================
       RENDER SLOTS
    ========================= */

    function renderSlots() {
      slotsWrap.innerHTML = "";

      slots.forEach(slot => {
        const div = document.createElement("div");
        div.className = "slot";
        div.dataset.slot = slot;
        div.innerHTML = `<h3>${slot}</h3>`;

        div.addEventListener("click", () => placeInSlot(div));
        slotsWrap.appendChild(div);
      });
    }

    /* =========================
       CARD DISPLAY
    ========================= */

    function showNextPerson() {
      if (!allowRepeats && index >= celebNames.length) return;

      const name = allowRepeats
        ? celebNames[Math.floor(Math.random() * celebNames.length)]
        : celebNames[index];

      celebName.textContent = name;
      celebImg.src = people[name] || "";
    }

    /* =========================
       PLACE IN SLOT
    ========================= */

    function placeInSlot(slotDiv) {
      if (slotDiv.querySelector(".card")) return;

      const name = celebName.textContent;

      const placed = card.cloneNode(true);
      placed.classList.remove("center");
      placed.classList.add("locked");
      placed.style.margin = "0";

      slotDiv.classList.add("filled");
      slotDiv.appendChild(placed);

      assignments[slotDiv.dataset.slot] = name;

      if (!allowRepeats) index++;

      if (Object.keys(assignments).length === slots.length) {
        endGame();
      } else {
        showNextPerson();
      }
    }

    /* =========================
       END
    ========================= */

    function endGame() {
      card.style.display = "none";
      slotsWrap.insertAdjacentHTML(
        "afterend",
        "<h2 style='text-align:center;margin-top:40px;'>Party Complete 🎉</h2>"
      );
    }

    /* =========================
       SLOT EDITOR
    ========================= */

    const slotEditor = document.getElementById("slotEditor");
    const slotInput = document.getElementById("slotInput");
    const allowRepeatsInput = document.getElementById("allowRepeats");

    function openEditor() {
      slotInput.value = slots.join("\n");
      allowRepeatsInput.checked = allowRepeats;
      slotEditor.style.display = "block";
    }

    document.getElementById("editSlots").onclick = openEditor;

    document.getElementById("saveCategories").onclick = () => {
      slots = slotInput.value.split("\n").map(s => s.trim()).filter(Boolean);
      allowRepeats = allowRepeatsInput.checked;
      saveSettings();
      slotEditor.style.display = "none";
      startGame();
    };

    document.getElementById("resetDefaults").onclick = () => {
      ({ slots, allowRepeats } = { ...DEFAULT_SETTINGS });
      saveSettings();
      slotEditor.style.display = "none";
      startGame();
    };

    document.getElementById("cancelEdit").onclick = () => {
      slotEditor.style.display = "none";
    };

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

    const helpBtn = document.getElementById("helpBtn");
    const helpTooltip = document.getElementById("helpTooltip");

    helpBtn.onclick = () => {
      helpTooltip.style.display =
        helpTooltip.style.display === "block" ? "none" : "block";
    };
    document.getElementById("helpBtn").onclick = () => {
      const tooltip = document.getElementById("helpTooltip");
      tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
    };
