import Unit, { UnitData } from "./Unit";

class BattleShip extends Unit {
    constructor(unitData: UnitData) {
        super(unitData)
        this.type = "battle ship"
        this.terrainType = "land"
        this.speed = 1.2
    }
}

export default BattleShip