import Unit from "./Unit";

class Armour extends Unit {
    constructor(unitData: {[k: string]: any}) {
        super(unitData)
        this.type = "armour"
        this.terrainType = "land"
        this.speed = 2.5
    }
}

export default Armour