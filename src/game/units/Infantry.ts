import { game } from "../../lobby";
import Unit, { UnitData } from "./Unit";

class Infantry extends Unit {
    inCity: boolean

    constructor(unitData: UnitData) {
        super(unitData)
        this.type = "infantry"
        this.terrainType = "land"
        this.speed = 1
        this.inCity = false
    }

    update() {
        super.update()
        if (this.inCity) this.strengthModifier = 2

        for (const i in game.cities) {
            let city = game.cities[i]
            if (this.inCity && !this.sprite.overlap(city.sprite)) {
                this.inCity = false
                console.log("Not longe rin city", this.inCity)
                this.strengthModifier = 1
            }
        }
    }
}

export default Infantry