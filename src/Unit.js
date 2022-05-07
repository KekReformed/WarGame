import Battle from "./Battle.js";

class Unit {

    constructor(unitData) {
        this.height = unitData.height
        this.width = unitData.width;
        this.h = unitData.h
        this.s = unitData.s
        this.l = unitData.l
        this.selected = false
        this.faction = unitData.faction
        this.strength = unitData.strength
        this.effectiveStrength = unitData.strength
        this.strengthModifier = 1
        this.speed = 1
        this.sprite = createSprite(unitData.positionX, unitData.positionY, unitData.height, unitData.width)
        this.goToPoint = this.sprite.position
        this.sprite.shapeColor = `hsl(${unitData.h},${unitData.s}%,${unitData.l}%)`
        this.sprite.rotateToDirection = true
        this.sprite.setDefaultCollider()
        unitData.unitList.push(this)
    }

    update(unitList, battleList) {

        if (this.sprite.position.dist(this.goToPoint) < 3) this.sprite.setVelocity(0, 0);

        this.sprite.mouseUpdate()

        this.collisionCount = 0

        for (const i in unitList) {
            let unit = unitList[i]

            if (this.sprite.overlap(unit.sprite)) {

                //If the unit we're colliding with is an enemy
                if (unit.faction !== this.faction) {
                    this.deselect()
                    battleList.push(new Battle((this.sprite.position.x + unit.sprite.position.x) / 2,
                        (this.sprite.position.y + unit.sprite.position.y) / 2,
                        this,unit))
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

                    let factionExists

                    for (const i in battle.factionList) {
                        faction = factionList[i]

                        if (Object.keys(faction)[0] === this.faction) {
                            faction[this.type] += this.effectiveStrength
                            factionExists = true
                        }
                    }

                    if (!factionExists) {
                        factionList.push({[this.faction]: {[this.type]: [this.effectiveStrength]}})
                    }


                    battle.factionList += this.effectiveStrength

                    this.strength = 0
                }
            }
        }

        textSize(12)
        textAlign(CENTER)
        fill(255, 255, 255)
        text(this.faction, this.sprite.position.x, this.sprite.position.y)
        textSize(8)
        text(`Strength:${this.effectiveStrength}`, this.sprite.position.x, this.sprite.position.y + 10)
        textSize(8)
        text(`Infantry`, this.sprite.position.x, this.sprite.position.y + 20)

        //Move the unit if right click pressed whilst selected
        if (this.selected) {

            if (mouseWentUp(RIGHT)) {
                let mousePos = createVector(mouseX, mouseY)

                this.goTo(mousePos, this.speed)
            }

            if (keyDown("s") && this.strength / 2 >= 100) {
                new Unit(this.faction, this.height, this.width, this.h, this.s, this.l, this.sprite.position.x - 40, this.sprite.position.y, unitList, Math.floor(this.strength / 2))
                new Unit(this.faction, this.height, this.width, this.h, this.s, this.l, this.sprite.position.x + 40, this.sprite.position.y, unitList, Math.floor(this.strength / 2))
                this.strength = 0
            }
        }

        this.effectiveStrength = this.strength * this.strengthModifier
    }

    select() {
        this.selected = true
        this.sprite.shapeColor = color(`hsl(${this.h},${this.s}%,50%)`)
    }

    deselect() {
        this.selected = false
        this.sprite.shapeColor = color(`hsl(${this.h},${this.s}%,${this.l}%)`)
    }

    goTo(destination, speed = 1) {
        this.goToPoint = createVector(destination.x, destination.y)
        this.vector = createVector(destination.x - this.sprite.position.x, destination.y - this.sprite.position.y)
        this.vector.normalize()
        this.vector.mult(speed)
        this.sprite.setVelocity(this.vector.x, this.vector.y)
    }
}

export default Unit