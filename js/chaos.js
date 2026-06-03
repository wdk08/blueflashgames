const MAX_KEEP = 15
    const SNAP_CHANCE = 0.30

    const CardA = document.getElementById("CardA")
    const CardB = document.getElementById("CardB")
    const imgA = document.getElementById("imgA")
    const imgB = document.getElementById("imgB")
    const nameA = document.getElementById("nameA")
    const nameB = document.getElementById("nameB")
    const keepList = document.getElementById("keepList")
    const goneList = document.getElementById("goneList")

    const timeBtn = document.getElementById("time")
    const soulBtn = document.getElementById("soul")
    const spaceBtn = document.getElementById("space")
    const realityBtn = document.getElementById("reality")

    let stones = { time: false, soul: false, space: false, reality: false }
    let pool = []
    let keep = []
    let gone = []
    let pair = []
    let stoneMode = null
    let lastSnapIds = []

    timeBtn.onclick = () => {
      if (stones.time) return alert("⏳ Time Stone already used")
      stones.time = true
      const restore = gone.filter(p => lastSnapIds.includes(p.id))
      gone = gone.filter(p => !lastSnapIds.includes(p.id))
      keep.push(...restore)
      lastSnapIds = []
      render()
    }

    spaceBtn.onclick = () => {
      if (stones.space) return alert("🌌 Space Stone already used")
      stones.space = true
      stoneMode = "space"
      highlightKeep()
    }

    soulBtn.onclick = () => {
      if (stones.soul) return alert("💀 Soul Stone already used")
      stones.soul = true
      stoneMode = "soul-sacrifice"
      alert("💀 Choose ONE from Keep to sacrifice")
      highlightKeep()
    }

    realityBtn.onclick = () => {
      if (stones.reality) return alert("🪞 Reality Stone already used")
      stones.reality = true
      stoneMode = "reality"
      alert("🪞 Choose ONE from Gone to restore")
      highlightGone()
    }

    function startGame() {
      leftPool = shuffle(
        Object.entries(getPeople(leftCategory))
          .map(([name, img], id) => ({ id: `L-${id}`, name, img }))
      );

      rightPool = shuffle(
        Object.entries(getPeople(rightCategory))
          .map(([name, img], id) => ({ id: `R-${id}`, name, img }))
      );

      keep = [];
      gone = [];
      pair = [];
      lastSnapIds = [];

      next();
      render();
    }


    function clearHandlers(reset = true) {
      document.querySelectorAll("li").forEach(li => {
        li.classList.remove("highlight")
        li.onclick = null
      })
      if (reset) stoneMode = null
    }

    function highlightKeep() {
      clearHandlers(false)
      document.querySelectorAll("#keepList li").forEach(li => {
        li.classList.add("highlight")
        li.onclick = () => {
          const p = keep.find(x => x.id == li.dataset.id)
          if (stoneMode === "space") {
            p.temp = true
            stoneMode = null
            clearHandlers(false)
            render()
            return
          }
          if (stoneMode === "soul-sacrifice") {
            keep = keep.filter(x => x.id !== p.id)
            gone.push(p)
            stoneMode = "soul-restore"
            clearHandlers(false)
            render()
            alert("💀 Choose ONE from Gone to restore")
            highlightGone()
          }
        }
      })
    }

    function highlightGone() {
      clearHandlers(false)
      document.querySelectorAll("#goneList li").forEach(li => {
        li.classList.add("highlight")
        li.onclick = () => {
          const i = gone.findIndex(x => x.id == li.dataset.id)
          keep.push(gone.splice(i, 1)[0])
          stoneMode = null
          clearHandlers(false)
          render()
        }
      })
    }

    function next() {
      if (!leftPool.length || !rightPool.length) return end();

      pair = [
        leftPool.pop(),
        rightPool.pop()
      ];

      nameA.textContent = pair[0].name;
      imgA.src = pair[0].img;

      nameB.textContent = pair[1].name;
      imgB.src = pair[1].img;
    }


    function choose(i) {
      const win = pair[i]
      const lose = pair[1 - i]
      if (keep.length >= MAX_KEEP) gone.push(keep.shift())
      keep.push(win)
      gone.push(lose)
      if (Math.random() < SNAP_CHANCE) snap()
      render()
      next()
    }

    function snap() {
      const eligible = keep.filter(p => !p.protected && !p.temp)
      const count = Math.floor(eligible.length / 2)
      if (!count) return
      shuffle(eligible)
      const victims = eligible.slice(0, count)
      lastSnapIds = victims.map(v => v.id)
      keep = keep.filter(p => !lastSnapIds.includes(p.id))
      gone.push(...victims)
      keep.forEach(p => p.temp = false)
      alert(`💥 SNAP! ${count} erased.`)
    }

    function render() {
      keepList.innerHTML = keep.map(p => {
        let cls = ""
        if (p.protected) cls = "protected"
        else if (p.temp) cls = "temp"
        return `<li class="${cls}" data-id="${p.id}">${p.name}</li>`
      }).join("")
      goneList.innerHTML = gone.map(p => `<li data-id="${p.id}">${p.name}</li>`).join("")
    }

    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
          ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }

    function end() {
      document.body.innerHTML = "<h1>Game Over</h1>" + keep.map(p => `<p>${p.name}</p>`).join("")
    }

    CardA.onclick = () => { if (!stoneMode) choose(0) }
    CardB.onclick = () => { if (!stoneMode) choose(1) }

    loadPeopleData(startGame)

    document.getElementById("helpBtn").onclick = () => {
      const tooltip = document.getElementById("helpTooltip");
      tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
    };