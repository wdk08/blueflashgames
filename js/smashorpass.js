/* =========================
           GAME STATE
        ========================= */

        const celebImg = document.getElementById("celeb-img");
        const celebName = document.getElementById("celeb-name");
        const smashCard = document.getElementById("smashCard");
        const buttons = document.querySelector(".buttons");

        let currentData = {};
        let celebNames = [];
        let index = 0;

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
            const people = getPeople(gender);

            celebNames = shuffle(Object.keys(people));
            currentData = people;
            index = 0;
            try {
                if (localStorage.getItem("smashCategory")) {
                    document.querySelector('.smash').textContent = localStorage.getItem("smashCategory");
                }
                if (localStorage.getItem("passCategory")) {
                    document.querySelector('.pass').textContent = localStorage.getItem("passCategory");
                }
            } catch (e) {
                console.error("Error accessing localStorage:", e);
            }

            buttons.style.display = "block";
            showCeleb();
        }

        /* =========================
           GAME LOOP
        ========================= */

        function showCeleb() {
            if (index >= celebNames.length) {
                smashCard.innerHTML = "<h2>You're done</h2><br><button onclick='restartGame()'>Play Again</button>";
                buttons.style.display = "none";
                return;
            }

            const name = celebNames[index];
            const img = currentData[name];

            celebName.textContent = name;
            celebImg.src = img || "";
        }

        /* =========================
           USER ACTION
        ========================= */

        function vote(choice) {
            console.log(`${celebNames[index]}: ${choice}`);
            index++;
            showCeleb();
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

        document.getElementById("editCategories").onclick = () => {
            document.getElementById("editform").style.display = "block";
        };

        document.getElementById("saveCategories").onclick = () => {
            const smash = document.getElementById("editSmash").value.trim() || "Smash";
            const pass = document.getElementById("editPass").value.trim() || "Pass";
            localStorage.setItem("smashCategory", smash);
            localStorage.setItem("passCategory", pass);

            document.querySelector('.smash').textContent = `${smash}`;
            document.querySelector('.pass').textContent = `${pass}`;
            document.getElementById("editform").style.display = "none";
        };

        document.getElementById("resetCategories").onclick = () => {
            localStorage.removeItem("smashCategory");
            localStorage.removeItem("passCategory");

            document.querySelector('.smash').textContent = "Smash";
            document.querySelector('.pass').textContent = "Pass";
            document.getElementById("editform").style.display = "none";
        };

        document.getElementById("cancelEdit").onclick = () => {
            document.getElementById("editform").style.display = "none";
        };

        document.getElementById("helpBtn").onclick = () => {
            const tooltip = document.getElementById("helpTooltip");
            tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
        };