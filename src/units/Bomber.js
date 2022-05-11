import Fighter from "./Fighter";

class Bomber extends Fighter {
    constructor(unitData) {
        super(unitData)
        this.type === "bomber"
        this.rangeModifier = 3
    }
}

export default Bomber