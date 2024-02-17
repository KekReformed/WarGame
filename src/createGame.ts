import { main, saveNewGame } from "."
import { api } from "./shared/api"

export const createGame = document.getElementById("create-game")

const createBtn = document.getElementById("create")
const gameCreateBtn = document.getElementById("game-create")

const usernameInput = <HTMLInputElement>document.getElementById("u")
const publicCheckbox = <HTMLInputElement>document.getElementById("public")

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

    api.createGame({
      name: usernameInput.value,
      public: publicCheckbox.checked
    }).then(res => {
      if (res.ok) return saveNewGame(res.body)
      createGameError.innerHTML = `An unexpected error occurred while attempting to create a game. Contact the developers if this happens frequently.<br><br>${res.statusText}`
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