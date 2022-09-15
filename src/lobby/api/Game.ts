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
    client: Player
    public?: boolean
    phase: GamePhase

    playersReady: number

    constructor(data: GameData) {
        this.id = data.id
        this.players = data.players
        this.client = data.players[data.clientIndex]
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