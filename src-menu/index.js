import { io } from 'socket.io-client'
import './agar.js'

const main = document.getElementById("main")
const backBtns = document.getElementsByClassName("back")
const pages = document.getElementsByClassName("page")

const hostname = "wargame.amelix.xyz:7777/api"
const socketPort = "4000"

// Back button functionality
for (let btn of backBtns) {
    btn.addEventListener("click", e => {
        main.style.display = "block"
        for (let page of pages) {
            page.style.display = "none"
        }
    })
}

export async function request(method, path, write, headers={}, hostOverwrite) {
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
    else throw { message: res.statusText, statusCode: res.status }
}

export async function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export const socket = io("https://amelix.xyz:" + socketPort)

import './createGame.js'
