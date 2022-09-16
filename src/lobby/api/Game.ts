import Client from "./Client"
import Player from "./Player"

export enum GamePhase {
    "lobby",
    "playing"
}

interface GameData extends Partial<Game> {
    clientIndex: number
}

export default class Game {
    id: string
    players: Player[]
    client: Client
    public?: boolean
    phase: GamePhase

    playersReady: number

    constructor(data: GameData) {
        this.id = data.id
        this.players = data.players
        this.client = new Client({...data.players[data.clientIndex], money: 0})
        this.public = data.public
        this.phase = data.phase

        this.playersReady = data.playersReady
    }

    /** Save the current gamestate to the browser's localstorage. */
    save() {
        const clone: Partial<GameData> = Object.assign({}, this)
        delete clone.client
        clone.clientIndex = this.client.index
        localStorage.game = JSON.stringify(clone)
    }
}