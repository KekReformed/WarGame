import Battle from "../game/Battle"
import City from "../game/City"
import { AnyDepot } from "../game/depots/Depot"
import { AnyUnit } from "../game/units/Unit"

export enum GamePhase {
  "lobby",
  "playing"
}

export interface GameData extends Partial<Game> {
  clientIndex: number
}

export default class Game {
  id: string
  players: (Client | Player)[]
  clientIndex: number
  public?: boolean
  phase: GamePhase

  playersReady: number

  day: number
  units: AnyUnit[]
  battles: Battle[]
  cities: City[]
  depots: AnyDepot[]

  get client(): Client { // @ts-ignore
    return this.players[this.clientIndex]
  }

  constructor(data: GameData) {
    this.id = data.id
    this.players = data.players
    this.clientIndex = data.clientIndex
    this.public = data.public
    this.phase = data.phase

    this.playersReady = data.playersReady

    this.day = data.day || 0
    this.units = []
    this.battles = []
    this.cities = []
    this.depots = []
  }

  /** Save the current gamestate to the browser's localstorage.
   * @deprecated Currently does nothing as don't want to cache game. BUT might want to in the future while game is running, so leaving this here for now
  */
  save() {
    // const clone: any = Object.assign({}, this)
    // delete clone.client

    // for (let key in clone) {
    //   // Delete any arrays for now as trying to store Jack's units / other game data is circular
    //   if (key !== "players" && Array.isArray(clone[key])) delete clone[key]
    // }

    // clone.clientIndex = this.client.index
    // localStorage.game = JSON.stringify(clone)
  }
}

export interface Player {
  name: string
  faction: Faction
  ready?: boolean
  index: number
}

export interface Faction {
  name?: string,
  colour?: string
}

export interface Client extends Player {
  money: number
}