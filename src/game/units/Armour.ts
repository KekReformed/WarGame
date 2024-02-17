import Unit, { UnitData } from "./Unit";

class Armour extends Unit {
    constructor(unitData: {[k: string]: any} & UnitData) {
        super(unitData)
        this.type = "armour"
        this.terrainType = "land"
        this.speed = 2.5
    }
}

export default Armour