import { createGame } from "./createGame.js";
import { request, socket } from "./index.js"

const lobbies = document.getElementById("lobbies")
const joinBtn = document.getElementById("join")
let joinButtons; 

const input = document.getElementById("join-game-u")

const gamesDiv = document.getElementById("games")

let games;

joinBtn.addEventListener("click", async e => {
    main.style.display = "none"
    lobbies.style.display = "block"

    if (!games) {
        // Load games
        await request("GET", "/games")
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
    const className = input.value.length > 0 
        ? "join-button valid" 
        : "join-button invalid"

    for (const button of joinButtons) {
        button.className = className
    }
}

function addGame(game) {
    gamesDiv.innerHTML += `<div class="game" id="${game.id}"><p>${game.creatorName}'s game - ${game.players} player${game.players.length > 1 ? 's' : ''}</p><div class="join-button invalid">Join</div></div>`

    document.getElementById(game.id).children.item(1).addEventListener("click", e => joinGame(game.id))
}

function joinGame(id) {
    console.log(`joining game ${id}...`)
}

socket.on('gameCreate', game => addGame(game))