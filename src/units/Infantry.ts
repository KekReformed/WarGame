import { client } from "..";
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

        for (const i in client.globalCities) {
            let city = client.globalCities[i]

            if (this.inCity && !this.sprite.overlap(city.sprite)) {
                this.inCity = false
                this.strengthModifier -= 1
            }
        }
    }
}

export default Infantry