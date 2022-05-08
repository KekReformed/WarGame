import { client, gameData } from "."

class Depot {

    constructor(depotData) {
        this.faction = depotData.faction
        this.sprite = createSprite(depotData.positionX, depotData.positionY, 20, 20)
        this.city = depotData.city
        this.selected = false
        this.sprite.shapeColor = `rgb(200,200,200)`
        this.city = depotData.city
        this.inCity = depotData.inCity

        if(this.city !== "None") this.inCity = true

        client.globalDepots.push(this)
    }

    update() {

        if (this.inCity) this.faction = this.city.faction

        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]

            //Oh noes! there is an enemy inside of me, now im gonna be captured!
            if (this.sprite.overlap(unit.sprite) && this.faction !== unit.faction && unit.sprite.velocity.x === 0 && unit.sprite.velocity.y === 0 && !this.inCity) {
                this.faction = unit.faction
            }
        }

        textSize(12)
        textAlign(CENTER)
        fill(255,255,255)
        noStroke()
        text(this.faction,this.sprite.position.x,this.sprite.position.y-15)
    }

    select() {
        this.selected = true
        this.sprite.shapeColor = `rgb(255,255,255)`
    }

    deselect() {
        this.selected = false
        this.sprite.shapeColor = `rgb(200,200,200)`
    }
}

export default Depot