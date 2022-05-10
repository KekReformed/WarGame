sprites = require('./Sprite')
let p = undefined

class Unit {
    constructor(name, height, width, color, positionX, positionY, list, unitNumber, faction) {
        this.height = height
        this.width = width;
        this.name = name
        this.unitNumber = unitNumber
        unitNumber++
        this.selected = false
        this.faction = faction
        this.strength = 100
        this.sprite = new sprites.Sprite(positionX, positionY, width, height, 0, sprites.Anchor.top)
        this.goToPoint = this.sprite.position
        this.sprite.color = color
        this.sprite.velocityRotate = true
        this.inBattle = false
        list.push(this)
        console.log(this.unitNumber)
    }

    updateUnit(unitList){

        if (this.sprite.position.dist(this.goToPoint) < 3) this.sprite.setVelocity(0, 0);
        
        p.textSize(12)
        p.textAlign(p.CENTER)
        p.fill(255,255,255)
        p.text(this.name,this.sprite.position.x,this.sprite.position.y)
        p.textSize(8)
        p.text(`Strength:${this.strength}`,this.sprite.position.x,this.sprite.position.y+10)

        //Move the unit if right click pressed whilst selected
        if (this.selected && p.mouseWentUp(p.RIGHT)) {
            
            let mousePos = p.createVector(p.mouseX, p.mouseY)
            
            if (p.mouseButton === p.RIGHT) {
                this.goTo(mousePos, 5)
            }
        }

        if (!this.sprite.isColliding) return; // after this it's for colliding only uwu
        
        //If the unit we're colliding with is an enemy
        if (unitList[this.sprite.collisions[0].userData].faction !== this.faction) {
            if (!this.inBattle) {
                this.inBattle = true
                this.sprite.setVelocity(0,0)
                this.deselectUnit()
            }
        }
    }

    bark(){
        console.log("Woof")
    }

    selectUnit() {
        this.selected = true
        this.sprite.color = "#ff0000"
    }

    deselectUnit(){
        this.selected = false
        this.sprite.color = "#660000"
    }

    goTo(destination, speed = 1) {
        this.goToPoint = p.createVector(destination.x,destination.y)
        this.vector = p.createVector(destination.x - this.sprite.position.x, destination.y - this.sprite.position.y)
        this.vector.normalize()
        this.vector.mult(speed)
        this.sprite.setVelocity(this.vector.x,this.vector.y)
    }
}
module.exports = Unit

module.exports.initalize = (pInst) => {
    p = pInst
}