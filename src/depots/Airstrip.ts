import { p } from "../sketch";
import Depot from "./Depot";

class Airstrip extends Depot {
    range: number

    constructor(depotData: {[k: string]: any}) {
        super(depotData)
        this.type = "airstrip"
        this.range = 600
    }

    update() {
        super.update()
        
        if (this.selected) {
            p.noFill()
            p.stroke(255,0,0)
            p.circle(this.sprite.position.x, this.sprite.position.y, this.range)
        }
    }
}

export default Airstrip