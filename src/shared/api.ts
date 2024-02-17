import { io } from 'socket.io-client'
import { GameData } from '../lobby/api/Game';

const apiUrl = localStorage.dev ? "https://wargame.amelix.xyz:7777/api" : "https://wargame.amelix.xyz/api";
const socketPort = localStorage.dev ? "4000" : "3001"

class API {
  private _url: string
  constructor(url: string) {
    this._url = url
  }

  private async request<Success, Error=unknown>(data: RequestData): Promise<Response<Success, Error>> {
    if (!data.headers) data.headers = {}
    let reqBody = data.body
    if (typeof reqBody === 'object') {
      // data.headers['Content-Type'] = 'application/json'
      reqBody = JSON.stringify(data.body)
    }
    if (typeof data.urlParams === 'object') {
      data.urlParams = new URLSearchParams(data.urlParams).toString()
    }
    if (localStorage.secret) {
      data.headers.Authorization = localStorage.secret
    }
  
    const url = this._url + (data.path || '') + (data.urlParams ? '?' + data.urlParams : '')

    const res = await fetch(url, {
      method: data.method,
      body: reqBody,
      headers: data.headers
    })
  
    let body: any = await res.text()
    try { body = JSON.parse(body) } catch { body }
  
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      body
    }
  }

  public async createGame(data: { name: string, public: boolean }) {
    return this.request<GameData & { secret: string }>({
      method: 'POST',
      path: '/games',
      body: data
    })
  }

  /** Fetch the game the client is currently in. */
  public async getGame() {
    return this.request<GameData>({ path: '/game' })
  }

  /** Fetch a list of the publically available games. */
  public async getGames() {
    return this.request<PartialGame[]>({ path: '/games' })
  }

  public async joinGame(data: { id: string, name: string }) {
    return this.request<GameData & { secret: string }>({
      method: 'POST',
      path: `/games/${data.id}/join`,
      body: { name: data.name }
    })
  }

  /** Leave the game the client is currently in.  */
  public async leaveGame() {
    return this.request({ method: 'POST', path: '/game/leave' })
  }
}
export const api = new API(apiUrl)

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
export interface RequestData {
  method?: Method
  path?: string
  body?: string | Record<string, any>
  formdata?: Record<string, string | number>
  urlParams?: string | Record<string, any>
  headers?: Record<string, string>
}

export interface BaseResponse {
  status?: number
  statusText: string
}
export type Response<Success, Error> = BaseResponse & (
  { ok: true; body: Success } | 
  { ok: false; body: Error }
)

/** Limited game info given when looking at the list of public games. */
export interface PartialGame {
  id: string
  creatorName: string
  players: number
}

let socketOptions;
if (localStorage.secret) socketOptions = { query: { secret: localStorage.secret } }
export const socket = io("https://amelix.xyz:" + socketPort, socketOptions)