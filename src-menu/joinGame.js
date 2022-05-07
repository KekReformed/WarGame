const lobbies = document.getElementById("lobbies")
const joinBtn = document.getElementById("join")
const joinButtons = document.getElementsByClassName("join-button")

const input = document.getElementById("join-game-u")

joinBtn.addEventListener("click", e => {
    main.style.display = "none"
    lobbies.style.display = "block"
})

updateJoinButtons()
input.addEventListener("keyup", e => updateJoinButtons())

function updateJoinButtons() {
    const className = input.value.length > 0 
        ? "join-button valid" 
        : "join-button invalid"

    for (const button of joinButtons) {
        button.className = className
    }
}