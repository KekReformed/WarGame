export default class Player {
    name: string
    faction: {
        name: string,
        colour: string
    }
    ready?: boolean
    index: number

    constructor(data: Partial<Player>) {
        this.name = data.name
        this.faction = data.faction
        this.ready = data.ready
        this.index = data.index
    }
}