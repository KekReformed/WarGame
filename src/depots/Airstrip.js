import Depot from "../depots/Depot";

class Airstrip extends Depot {
    constructor(depotData) {
        super(depotData)
        this.type = "airstrip"
        this.range = 600
    }

    update() {
        super.update()
        
        if (this.selected) {
            noFill()
            stroke(255,0,0)
            circle(this.sprite.position.x, this.sprite.position.y, this.range)
        }
    }
}

export default Airstrip