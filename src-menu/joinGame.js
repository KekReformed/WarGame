import { createGame } from "./createGame.js";
import { delay, request, socket } from "./index.js"

const lobbies = document.getElementById("lobbies")
const joinBtn = document.getElementById("join")
/** @type {HTMLCollectionOf<Element>} */
let joinButtons; 

const input = document.getElementById("join-game-u")
let inputBlinking = false

const gamesDiv = document.getElementById("games")

let games;

const usernameError = document.getElementById("username-taken")

joinBtn.addEventListener("click", async e => {
    main.style.display = "none"
    lobbies.style.display = "block"

    if (!games) {
        gamesDiv.innerHTML = ""
        // Load games
        request("GET", "/games")
        .then(res => {
            games = res.body
            gamesDiv.innerHTML = ""
            
            if (games.length) {
                for (const game of games) {
                    addGame(game)
                }
            }
            else {
                gamesDiv.innerHTML = `<p>There aren't any public games to join at the moment. Wanna <span id="create-one">create one?</span></p>`
                document.getElementById("create-one").addEventListener("click", e => {
                    lobbies.style.display = "none"
                    createGame.style.display = "block"
                })
            }
    
            joinButtons = document.getElementsByClassName("join-button")
            updateJoinButtons()
        })
        .catch(e => 
            gamesDiv.innerHTML = `Failed to load games due to an unexpected error. Please report this to the developers.<br><br>${e}`
        )
    }
});

input.addEventListener("keyup", e => updateJoinButtons())

function updateJoinButtons() {
    usernameError.innerHTML = ""
    const className = input.value.length > 0 
        ? "join-button valid" 
        : "join-button invalid"

    for (const button of joinButtons) {
        button.className = className
    }
}

function addGame(game) {
    const element = new DOMParser().parseFromString(`<div class="game" id="${game.id}">${createGameString(game)}<div class="join-button invalid">Join</div></div>`, 'text/html').activeElement.children.item(0)
    console.log(element)
    gamesDiv.appendChild(element)
    element.children.item(1).addEventListener("click", e => joinGame(game.id))
}

function editGame(game) {
    const element = document.getElementById(game.id)
    if (element) element.children.item(0).innerHTML = createGameString(game)
    else addGame(game)
}

function createGameString(game) {
    return `<p>${game.creatorName}'s game - ${game.players} player${game.players > 1 ? 's' : ''}</p>`
}

async function joinGame(id) {
    if (input.value.length > 0) {
        request("POST", `/games/${id}/join`, { name: input.value })
        .then(res => {
            const game = res.body
            
            // go to lobby with game data or something idk
        })
        .catch(e => {
            if (e.statusCode === 409) {
                usernameError.innerHTML = 'Sorry, this username has alreaday been taken by someone in that game!'
            }
            else usernameError.innerHTML = `An unexpected error occurred while joining that game. Please report this to the developers.<br><br>${e.message}`
        })
    }
    else {
        if (!inputBlinking) {
            inputBlinking = true
            for (let i=0; i<4; i++) {
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