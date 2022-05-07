const lobbies = document.getElementById("lobbies")
const joinBtn = document.getElementById("join")

joinBtn.addEventListener("click", e => {
    main.style.display = "none"
    lobbies.style.display = "block"
})