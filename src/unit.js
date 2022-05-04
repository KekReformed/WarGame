class Unit {
    constructor(name, height, width, h, s, l, positionX, positionY, list, unitNumber, faction) {
        this.height = height
        this.width = width;
        this.h = h
        this.s = s
        this.l = l
        this.name = name
        this.unitNumber = unitNumber
        unitNumber++
        this.selected = false
        this.faction = faction
        this.strength = 100
        this.sprite = createSprite(positionX, positionY, height, width)
        this.goToPoint = this.sprite.position
        this.sprite.shapeColor = `hsl(${h},${s}%,${l}%)`
        this.sprite.rotateToDirection = true
        this.sprite.setDefaultCollider()
        this.inBattle = false
        list.push(this)
        console.log(this.unitNumber)
    }

    updateUnit(unitList){

        if (this.sprite.position.dist(this.goToPoint) < 3) this.sprite.setVelocity(0, 0);
        
        this.collisionCount = 0

        for (const i in unitList) {
            let unit = unitList[i]
            if (this.sprite.overlap(unit.sprite)){

                //If the unit we're colliding with is an enemy
                if (unit.faction !== this.faction) {

                    this.collisionCount +=1
                    if (!this.inBattle) {
                        this.inBattle = true
                        this.sprite.setVelocity(0,0)
                        this.deselectUnit()
                    }

                }

                else {

                }
            }
        }

        if (!this.sprite.overlap(allSprites) && this.inBattle) {
            this.inBattle = false
        }

        this.sprite.mouseUpdate()
        
        textSize(12)
        textAlign(CENTER)
        fill(255,255,255)
        text(this.name,this.sprite.position.x,this.sprite.position.y)
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

    bark(){
        console.log("Woof")
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
        console.log(destination.x,destination.y)
        this.vector = createVector(destination.x - this.sprite.position.x, destination.y - this.sprite.position.y)
        this.vector.normalize()
        this.vector.mult(speed)
        this.sprite.setVelocity(this.vector.x,this.vector.y)
    }
}
try {module.exports = Unit} catch {}