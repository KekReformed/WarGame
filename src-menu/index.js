import './agar.js'

export const main = document.getElementById("main")
const backBtns = document.getElementsByClassName("back")
const pages = document.getElementsByClassName("page")
const hostname = "wargame.amelix.xyz:7777/api"

// Back button functionality
for (let btn of backBtns) {
    btn.addEventListener("click", e => {
        main.style.display = "block"
        for (let page of pages) {
            page.style.display = "none"
        }
    })
}

export async function request(method="GET", path, write, headers={}, hostOverwrite) {
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

import './createGame.js'
import './joinGame.js'