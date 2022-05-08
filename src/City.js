import { client } from "."
import Infantry from "./Infantry"

class City {

    constructor(faction, cityName, positionX, positionY, value) {

        this.faction = faction
        this.cityName = cityName
        this.positionX = positionX
        this.positionY = positionY
        this.value = value
        this.sprite = createSprite(positionX,positionY,80,80)
        this.sprite.depth = -1
        this.sprite.shapeColor = `rgb(0,50,255)`
        client.globalCities.push(this)
    }

    update() {
        this.defenders = 0
        

        //Counts how many defenders there are 
        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]

            if (this.sprite.overlap(unit.sprite) && unit.faction === this.faction && !unit.inCity && unit.type === "infantry"){
                this.defenders += 1
                unit.inCity = true
                unit.strengthModifier += 1
            }
        }


        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]

            //Oh noes! there is an enemy inside of me, now im gonna be captured!
            if (this.sprite.overlap(unit.sprite) && this.faction !== unit.faction && unit.sprite.velocity.x === 0 && unit.sprite.velocity.y === 0 && this.defenders === 0 && unit.strength > 0 && unit.type === "infantry") {
                this.faction = unit.faction
            }
        }
        
        textSize(12)
        textAlign(CENTER)
        fill(255,255,255)
        noStroke()
        text(`${this.cityName}: £${this.value}B/yr`,this.sprite.position.x, this.sprite.position.y)
        text(`Owned by: ${this.faction}`,this.sprite.position.x, this.sprite.position.y+10)
    }

}

export default City