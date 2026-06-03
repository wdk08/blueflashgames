let pool = [];

    const roomsEl = document.getElementById("rooms");

    function startGame() {
      roomsEl.innerHTML = "";

      const people = getPeople(gender);

      pool = Object.entries(people)
        .map(([name, img]) => ({ name, img }))
        .sort(() => Math.random() - 0.5);

      nextRound();
    }

    function nextRound() {
      roomsEl.innerHTML = "";

      if (pool.length < 9) {
        roomsEl.innerHTML = `
      <h2 style="text-align:center;width:100%">
        Game Complete
      </h2>
    `;
        return;
      }

      // permanently consume 9 people
      const roundPeople = pool.splice(0, 9);

      const rooms = [
        roundPeople.slice(0, 3),
        roundPeople.slice(3, 6),
        roundPeople.slice(6, 9)
      ];

      rooms.forEach((people, i) => {
        const room = document.createElement("div");
        room.className = "room";

        room.innerHTML = `
      <div class="room-title">Room ${i + 1}</div>
      <div class="room-cards"></div>
    `;

        const cardsEl = room.querySelector(".room-cards");

        people.forEach(p => {
          const card = document.createElement("div");
          card.className = "card";

          card.innerHTML = `
        ${p.img ? `<img src="${p.img}" draggable="false">` : ""}
        <p>${p.name}</p>
      `;

          cardsEl.appendChild(card);
        });

        room.onclick = () => chooseRoom(room);
        roomsEl.appendChild(room);
      });
    }

    function chooseRoom(selectedRoom) {
      document.querySelectorAll(".room").forEach(r => {
        if (r !== selectedRoom) {
          r.classList.add("discarded");
        }
      });

      setTimeout(nextRound, 450);
    }

    loadPeopleData(startGame);

    document.getElementById("helpBtn").onclick = () => {
      const tooltip = document.getElementById("helpTooltip");
      tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
    };