class Depot {

    constructor(faction, positionX, positionY, depotList, city = "None",) {
        this.faction = faction
        this.sprite = createSprite(positionX, positionY, 20, 20)
        this.city = city
        this.selected = false
        this.sprite.shapeColor = `rgb(200,200,200)`
        depotList.push(this)

        if(this.city !== "None") this.inCity = true
    }

    update(unitList) {

        if (this.inCity) this.faction = this.city.faction

        for (const i in unitList) {
            let unit = unitList[i]

            //Oh noes! there is an enemy inside of me, now im gonna be captured!
            if (this.sprite.overlap(unit.sprite) && this.faction !== unit.faction && unit.sprite.velocity.x === 0 && unit.sprite.velocity.y === 0) {
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