import Battle from "./Battle.js";

class Unit {

    constructor(faction, height, width, h, s, l, positionX, positionY, list, strength) {
        this.height = height
        this.width = width;
        this.h = h
        this.s = s
        this.l = l
        this.selected = false
        this.faction = faction
        this.strength = strength
        this.effectiveStrength = strength
        this.strengthModifier = 1
        this.inCity = false
        this.sprite = createSprite(positionX, positionY, height, width)
        this.goToPoint = this.sprite.position
        this.sprite.shapeColor = `hsl(${h},${s}%,${l}%)`
        this.sprite.rotateToDirection = true
        this.sprite.setDefaultCollider()
        list.push(this)
    }

    update(unitList, battleList, cityList) {

        if (this.sprite.position.dist(this.goToPoint) < 3) this.sprite.setVelocity(0, 0);
        
        this.sprite.mouseUpdate()

        this.collisionCount = 0

        for (const i in unitList) {
            let unit = unitList[i]

            if (this.sprite.overlap(unit.sprite)){

                //If the unit we're colliding with is an enemy
                if (unit.faction !== this.faction) {
                    this.deselect()
                    battleList.push(new Battle((this.sprite.position.x + unit.sprite.position.x) / 2, (this.sprite.position.y + unit.sprite.position.y) / 2, [[this.faction, this.effectiveStrength], [unit.faction, unit.effectiveStrength]]))
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
                
                //If we touch a battle
                if (this.sprite.overlap(battle.sprite)) {

                    //If the faction doesn't exist in the battle yet add it
                    if (typeof battle[this.faction] === typeof undefined) {
                        battle[this.faction] = 0
                    }

                    if (!battle.factionList.includes(this.faction)) {
                        battle.factionList.push(this.faction)
                    }

                    battle[this.faction] += this.effectiveStrength

                    this.strength = 0
                }
            }
        }

        for (const i in cityList) {
            let city = cityList[i]

            if (this.inCity && !this.sprite.overlap(city.sprite)) {
                this.inCity = false
                this.strengthModifier -= 1
            }

        }
        
        textSize(12)
        textAlign(CENTER)
        fill(255,255,255)
        text(this.faction,this.sprite.position.x,this.sprite.position.y)
        textSize(8)
        text(`Strength:${this.effectiveStrength}`,this.sprite.position.x,this.sprite.position.y+10)
        
        //Move the unit if right click pressed whilst selected
        if (this.selected && mouseWentUp(RIGHT)) {

            let mousePos = createVector(mouseX, mouseY)

            if (mouseButton === RIGHT) {
                this.goTo(mousePos, 5)
            }
        }

        this.effectiveStrength = this.strength * this.strengthModifier
    }

    select() {
        this.selected = true
        this.sprite.shapeColor = color(`hsl(${this.h},${this.s}%,50%)`)
    }

    deselect(){
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

export default Unit