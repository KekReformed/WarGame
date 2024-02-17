import { p } from "../sketch";
import {specificScaleOfRadius, worldToScreen } from "../Util";
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
            let pos = worldToScreen(this.sprite.position.x, this.sprite.position.y)
            let r = specificScaleOfRadius(this.range)
            p.circle(pos.x, pos.y, r)
        }
    }
}

export default Airstrip