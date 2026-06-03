    /* =========================
       GAME STATE
    ========================= */

    let leftPool = {};
    let rightPool = {};
    let results = [];

    const choices = document.querySelector(".choices");

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
      results = [];

      leftPool = { ...getPeople(leftCategory) };
      rightPool = { ...getPeople(rightCategory) };

      choices.innerHTML = "";
      nextPair();
    }

    /* =========================
       GAME LOOP
    ========================= */

    function nextPair() {
      const leftKeys = Object.keys(leftPool);
      const rightKeys = Object.keys(rightPool);

      if (!leftKeys.length || !rightKeys.length) {
        showResults();
        return;
      }

      const leftName = randomPick(leftKeys);
      const rightName = randomPick(rightKeys);

      const leftImg = leftPool[leftName];
      const rightImg = rightPool[rightName];

      delete leftPool[leftName];
      delete rightPool[rightName];

      choices.innerHTML = "";

      choices.appendChild(createChoice(leftName, leftImg, leftCategory));
      choices.appendChild(createChoice(rightName, rightImg, rightCategory));
    }

    /* =========================
       CARD CREATION
    ========================= */

    function createChoice(name, img, type) {
      const div = document.createElement("div");
      div.className = "card hoverable";

      div.innerHTML = img
        ? `<img src="${img}"><p>${name}</p>`
        : `<p style="margin:100px 0">${name}</p>`;

      div.onclick = () => {
        results.push({ chosen: name, type });
        nextPair();
      };

      return div;
    }

    /* =========================
       RESULTS
    ========================= */

    function showResults() {
      choices.innerHTML = "";

      results.forEach((r, i) => {
        choices.innerHTML += `<p>${i + 1}. ${r.chosen} (${r.type})</p>`;
      });
    }

    /* =========================
       UTIL
    ========================= */

    function randomPick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    document.getElementById("helpBtn").onclick = () => {
      const tooltip = document.getElementById("helpTooltip");
      tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
    };