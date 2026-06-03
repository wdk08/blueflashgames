/* =========================
   GLOBAL STATE
========================= */

let peopleJSON = null;

let gender = "Female";
let leftCategory = "Female";
let rightCategory = "Female";


/* =========================
   DATA LOADING
========================= */

function loadPeopleData(callback) {
  if (peopleJSON) {
    callback();
    return;
  }

  fetch("people.json")
    .then(r => r.json())
    .then(data => {
      peopleJSON = data;
      callback();
    });
}


/* =========================
   DATA ACCESS
========================= */

function getPeople(category) {
  return peopleJSON?.[category] || {};
}


/* =========================
   DROPDOWNS
========================= */

const options = `
  <option value="Female">Women</option>
  <option value="Male">Men</option>
  <option value="Athletes">Athletes</option>
  <option value="Musicians">Musicians</option>
  <option value="ST">Stranger Things</option>
  <option value="SW">Star Wars</option>
  <option value="Marvel">Marvel</option>
`;

function populateDropdowns() {
  document.querySelectorAll(".dropdown").forEach(select => {
    select.innerHTML = options;
  });
}

function setupDropdownHandlers() {
  document.querySelectorAll(".dropdown").forEach(select => {
    const role = select.dataset.role;

    if (role === "single") {
      select.value = gender;

      select.addEventListener("change", () => {
        gender = select.value;
        restartGame();
      });
    }

    if (role === "left") {
      select.value = leftCategory;

      select.addEventListener("change", () => {
        leftCategory = select.value;
        restartGame();
      });
    }

    if (role === "right") {
      select.value = rightCategory;

      select.addEventListener("change", () => {
        rightCategory = select.value;
        restartGame();
      });
    }
  });
}


/* =========================
   NAV
========================= */

function setupNav() {
  const navLinks = document.querySelector(".navLinks");
  if (!navLinks) return;

  navLinks.innerHTML = `
    <a href="index.html">Home</a>
    <a href="smashorpass.html">Smash or Pass</a>
    <a href="kmk.html">Kiss Marry Kill</a>
    <a href="goc.html">Would You Rather</a>
    <a href="blind.html">Blind Ranking</a>
    <a href="wyw.html">King of the Hill</a>
    <a href="chaos.html">Infinity War</a>
    <a href="fb.html">Football Lineup</a>
    <a href="draft.html">Roster</a>
    <a href="tiers.html">Tier List</a>
    <a href="car.html">Choose a room</a>
    <a href="party.html">Party</a>
  `;
}


/* =========================
   GAME CONTROL
========================= */

function restartGame() {
  if (typeof resetGameState === "function") {
    resetGameState();
  }

  if (typeof startGame === "function") {
    startGame();
  }
}


/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  populateDropdowns();
  setupDropdownHandlers();
  setupNav();
});
function openCategory(category) {
  window.location.href = `categories.html?category=${category}`;
}