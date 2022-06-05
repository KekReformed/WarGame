import AirUnit from "./AirUnit";
import { UnitData } from "./Unit";

class Bomber extends AirUnit {
    constructor(unitData: {[k: string]: any} & UnitData) {
        super(unitData)
        this.type === "bomber"
        this.rangeModifier = 3
    }
}

export default Bomber