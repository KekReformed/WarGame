import { request } from "./index.js"

export const createGame = document.getElementById("create-game")

const createBtn = document.getElementById("create")
const gameCreateBtn = document.getElementById("game-create")

const usernameInput = document.getElementById("u")
const publicCheckbox = document.getElementById("public")

const createGameError = document.getElementById("create-game-error")

createBtn.addEventListener("click", e => {
    main.style.display = "none"
    createGame.style.display = "block"
})

updateGameCreateButton()
usernameInput.addEventListener('keyup', e => updateGameCreateButton())

gameCreateBtn.addEventListener('click', e => {
    if (gameCreateFormValid()) {
        createGameError.innerHTML = ""
        request("POST", "/games", { name: usernameInput.value, public: publicCheckbox.checked})
        .then((res) => {
            // go to a new page (page where the game takes place) and show the lobby
        })
        .catch((err) => {
            createGameError.innerHTML = `An unexpected error occurred while attempting to create a game. Contact the developers if this happens frequently.<br><br>${err.message}`
        })
    }
    else {
        createGameError.innerHTML = `You must enter a username to create a game.`
    }
})

function updateGameCreateButton() {
    if (gameCreateFormValid()) {
        gameCreateBtn.className = "button valid"
    }
    else {
        gameCreateBtn.className = "button invalid"
    }
}
function gameCreateFormValid() {
    return usernameInput.value.length > 0
}