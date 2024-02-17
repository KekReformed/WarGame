import Airstrip from "../depots/Airstrip";
import AirUnit from "./AirUnit";
import Unit, { UnitData } from "./Unit";

class Fighter extends AirUnit {
    constructor(unitData: {[k: string]: any} & UnitData) {
        super(unitData)
        this.type = "fighter jet"
        this.terrainType = "air"
        this.speed = 5
        this.rangeModifier = 1
    }
}
export default Fighter