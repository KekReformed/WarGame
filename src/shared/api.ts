import { io } from 'socket.io-client'

const hostname = localStorage.dev ? "wargame.amelix.xyz:7777/api" : "wargame.amelix.xyz/api";
const socketPort = localStorage.dev ? "4000" : "3001"

export async function request(method: string, path: string, write: any, headers = {}, hostOverwrite?: string) {
  if (typeof write === "object") write = JSON.stringify(write);

  const res = await fetch(`https://` + (hostOverwrite || hostname) + path, {
    method: method,
    headers: headers,
    body: write
  }).catch(e => { throw new Error(e) })
  if (res.ok) {
    let body: any = await res.text()

    try { body = JSON.parse(body) } catch { }
    return { ...res, body }
  }
  else throw { message: res.statusText, statusCode: res.status }
}

let socketOptions;
if (localStorage.secret) socketOptions = { query: { secret: localStorage.secret } }
export const socket = io("https://amelix.xyz:" + socketPort, socketOptions)