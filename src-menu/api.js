import { io } from 'socket.io-client'

const hostname = "wargame.amelix.xyz:7777/api"
const socketPort = "4000"

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

export const socket = io("https://amelix.xyz:" + socketPort)