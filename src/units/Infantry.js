import { client } from "..";
import Unit from "./Unit";

class Infantry extends Unit {
    constructor(unitData) {
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