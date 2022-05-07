const main = document.getElementById("main")
const lobbies = document.getElementById("lobbies")
const createGame = document.getElementById("create-game")

const joinBtn = document.getElementById("join")
const createBtn = document.getElementById("create")
const gameCreateBtn = document.getElementById("game-create")
const backBtns = document.getElementsByClassName("back")

const pages = document.getElementsByClassName("page")

const usernameInput = document.getElementById("u")
const publicCheckbox = document.getElementById("public")

const createGameError = document.getElementById("create-game-error")

const hostname = "wargame.amelix.xyz:7777/api"

joinBtn.addEventListener("click", e => {
    main.style.display = "none"
    lobbies.style.display = "block"
})

createBtn.addEventListener("click", e => {
    main.style.display = "none"
    createGame.style.display = "block"
})

updateGameCreateButton()
usernameInput.addEventListener('keyup', e => {
    updateGameCreateButton()
})

gameCreateBtn.addEventListener('click', e => {
    if (gameCreateFormValid()) {
        createGameError.innerHTML = ""
        const res = request("POST", "/games", { username: usernameInput.value, public: publicCheckbox.checked})
        .then((res) => {
            console.log(res.body)
        })
        .catch((err) => {
            createGameError.innerHTML = `An unexpected error occurred while attempting to create a game. Contact the developers if this happens frequently.<br><br>${err}`
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

// Back button functionality
for (let btn of backBtns) {
    btn.addEventListener("click", e => {
        main.style.display = "block"
        for (let page of pages) {
            page.style.display = "none"
        }
    })
}

async function request(method="GET", path, write, headers={}, hostOverwrite) {
    if (typeof write === "object") write = JSON.stringify(write);

    const res = await fetch(`https://` + (hostOverwrite || hostname) + path, {
        method: method,
        headers: headers,
        body: write
    }).catch(e => {throw new Error(e)})
    if (res.ok) {
        let body = await res.text()

        try { body = JSON.parse(body) } catch {}
        return { ...res, body }
    }
    else throw new Error(res.statusText)
}