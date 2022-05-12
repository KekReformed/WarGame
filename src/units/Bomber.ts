import Fighter from "./Fighter";
import { UnitData } from "./Unit";

class Bomber extends Fighter {
    constructor(unitData: {[k: string]: any} & UnitData) {
        super(unitData)
        this.type === "bomber"
        this.rangeModifier = 3
    }
}

export default Bomber