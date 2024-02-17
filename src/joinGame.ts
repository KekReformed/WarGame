import { main } from ".";
import { createGame } from "./createGame";
import { PartialGame, api, socket } from "./shared/api";
import { delay } from "./shared/modules";

const lobbies = document.getElementById("lobbies")
const joinBtn = document.getElementById("join")
let joinButtons: HTMLCollectionOf<Element> | undefined;

const input = <HTMLInputElement>document.getElementById("join-game-u")
let inputBlinking = false

const gamesDiv = document.getElementById("games")

let games: PartialGame[];

const usernameError = document.getElementById("username-taken")

const noGamesString = `<p>There aren't any public games to join at the moment. Wanna <span id="create-one">create one?</span></p>`
const errorString = `<br><br>You can try fetching games again by clicking the back button below, then coming back to this page.`

joinBtn.addEventListener("click", async e => {
  main.style.display = "none"
  lobbies.style.display = "block"

  if (!games) {
    gamesDiv.innerHTML = "Fetching games..."
    api.getGames().then(res => {
      if (!res.ok) {
        return gamesDiv.innerHTML = `Failed to load games: ${res.statusText}${errorString}`
      }
      games = res.body
      gamesDiv.innerHTML = ""

      if (games.length) {
        for (const game of games) {
          addGame(game)
        }
      }
      else {
        gamesDiv.innerHTML = noGamesString
        document.getElementById("create-one").addEventListener("click", e => {
          lobbies.style.display = "none"
          createGame.style.display = "block"
        })
      }

      joinButtons = document.getElementsByClassName("join-button")
      updateJoinButtons()
    }).catch(e => {
      console.log(e)
      gamesDiv.innerHTML = `Failed to load games due to an unexpected error. Please report this to the developers.<br><br>${e}${errorString}`
    })
  }
});

input.addEventListener("keyup", e => updateJoinButtons())

function joinButtonClass() {
  return input.value.length > 0
    ? "join-button valid"
    : "join-button invalid"
}

function updateJoinButtons() {
  if (!joinButtons) return
  usernameError.innerHTML = ""
  const className = joinButtonClass()

  for (let i=0; i < joinButtons.length; i++) {
    const button = joinButtons.item(i)
    button.className = className
  }
}

function addGame(game: PartialGame) {
  if (games.length === 0) gamesDiv.innerHTML = ""
  const element = new DOMParser().parseFromString(`<div class="game" id="${game.id}">${createGameString(game)}<div class="join-button ${joinButtonClass()}">Join</div></div>`, 'text/html').activeElement.children.item(0)
  gamesDiv.appendChild(element)
  element.children.item(1).addEventListener("click", e => joinGame(game.id))
}

function editGame(game: PartialGame) {
  const element = document.getElementById(game.id)
  if (element) element.children.item(0).innerHTML = createGameString(game)
  else addGame(game)
}

function deleteGame(id: string) {
  document.getElementById(id)?.remove()
  if (games.length === 0) gamesDiv.innerHTML = noGamesString
}

function createGameString(game: PartialGame) {
  return `<p>${game.creatorName}'s game - ${game.players} player${game.players > 1 ? 's' : ''}</p>`
}

async function joinGame(id: string) {
  if (input.value.length > 0) {
    api.joinGame({ id, name: input.value }).then(res => {
      if (!res.ok) {
        if (res.status === 409) {
          return usernameError.innerHTML = 'Sorry, this username has already been taken by someone in that game!'
        }
        return usernameError.innerHTML = res.statusText
      }
      if (location.hostname === 'localhost') localStorage.secret = res.body.secret
      return location.pathname = "/game/"
    }).catch(e => {
      usernameError.innerHTML = `An unexpected error occurred while joining that game. Please report this to the developers.<br><br>${e.message}`
    })
  }
  else {
    if (!inputBlinking) {
      inputBlinking = true
      for (let i = 0; i < 4; i++) {
        input.style.border = "1px solid #ff3d3d"
        await delay(0.3)
        input.style.border = null
        await delay(0.3)
      }
      inputBlinking = false
    }
  }
}

socket.on('gameCreate', addGame)
socket.on('publicGameEdit', editGame)
socket.on('gameDelete', deleteGame)