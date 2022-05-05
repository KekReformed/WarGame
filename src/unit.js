class Unit {
    constructor(faction, height, width, h, s, l, positionX, positionY, list, unitNumber, strength) {
        this.height = height
        this.width = width;
        this.h = h
        this.s = s
        this.l = l
        this.unitNumber = unitNumber
        unitNumber++
        this.selected = false
        this.faction = faction
        this.strength = strength
        this.sprite = createSprite(positionX, positionY, height, width)
        this.goToPoint = this.sprite.position
        this.sprite.shapeColor = `hsl(${h},${s}%,${l}%)`
        this.sprite.rotateToDirection = true
        this.sprite.setDefaultCollider()
        list.push(this)
    }

    updateUnit(unitList,battleList) {

        if (this.sprite.position.dist(this.goToPoint) < 3) this.sprite.setVelocity(0, 0);
        
        this.collisionCount = 0

        for (const i in unitList) {
            let unit = unitList[i]

            if (this.sprite.overlap(unit.sprite)){

                //If the unit we're colliding with is an enemy
                if (unit.faction !== this.faction) {
                    this.deselectUnit()
                    battleList.push(new Battle((this.sprite.position.x + unit.sprite.position.x) / 2, (this.sprite.position.y + unit.sprite.position.y) / 2, unit.strength + this.strength, [[this.faction, this.strength], [unit.faction, unit.strength]]))
                    this.strength = 0
                    unit.strength = 0
                }
            }

            //Unit Combining
            if (this.sprite.position.dist(unit.sprite.position) < 4 && this.faction === unit.faction && !this.sprite.position.equals(unit.sprite.position) && !this.combining) {
                this.strength += unit.strength
                unit.strength = 0
                unit.combining = true
            }
        }
        
        if (this.strength > 0) {
            for (const i in battleList) {
                let battle = battleList[i]
                
                if (this.sprite.overlap(battle.sprite)) {

                    //If the faction doesn't exist in the battle yet add it
                    if (typeof battle[this.faction] === typeof undefined) {
                        battle[this.faction] = 0
                    }

                    if (!battle.factionList.includes(this.faction)) {
                        battle.factionList.push(this.faction)
                    }

                    battle[this.faction] += this.strength

                    this.strength = 0
                }
            }
        }

        this.sprite.mouseUpdate()
        
        textSize(12)
        textAlign(CENTER)
        fill(255,255,255)
        text(this.faction,this.sprite.position.x,this.sprite.position.y)
        textSize(8)
        text(`Strength:${this.strength}`,this.sprite.position.x,this.sprite.position.y+10)

        //Move the unit if right click pressed whilst selected
        if (this.selected && mouseWentUp(RIGHT)) {

            let mousePos = createVector(mouseX, mouseY)

            if (mouseButton === RIGHT) {
                this.goTo(mousePos, 5)
            }
        }
    }

    selectUnit() {
        this.selected = true
        this.sprite.shapeColor = color(`hsl(${this.h},${this.s}%,50%)`)
    }

    deselectUnit(){
        this.selected = false
        this.sprite.shapeColor = color(`hsl(${this.h},${this.s}%,${this.l}%)`)
    }

    goTo(destination, speed = 1) {
        this.goToPoint = createVector(destination.x,destination.y)
        this.vector = createVector(destination.x - this.sprite.position.x, destination.y - this.sprite.position.y)
        this.vector.normalize()
        this.vector.mult(speed)
        this.sprite.setVelocity(this.vector.x,this.vector.y)
    }
}
module.exports = Unit