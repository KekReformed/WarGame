import Battle from "../Battle.js";
import { client, longClick, unitTypes } from "../index.js";

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
        client.globalUnits.push(this)
    }

    
    update() {

        if (this.sprite.position.dist(this.goToPoint) < 3) this.sprite.setVelocity(0, 0);

        this.sprite.mouseUpdate()

        this.collisionCount = 0

        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]

            if (this.sprite.overlap(unit.sprite)) {

                //If the unit we're colliding with is an enemy
                if (unit.faction !== this.faction) {
                    this.startBattle(unit)
                }
            }

            //Unit Combining
            if (this.sprite.position.dist(unit.sprite.position) < 4 && this.faction === unit.faction && !this.sprite.position.equals(unit.sprite.position) && !this.combining && this.type === unit.type) {
                this.combine(unit)
            }
        }

        if (this.strength > 0) {
            for (const i in client.globalBattles) {
                let battle = client.globalBattles[i]
                let mousePos = createVector(mouseX, mouseY) 

                if (this.selected && longClick(RIGHT) && battle.sprite.position.dist(mousePos) < 80) {
                    this.joiningBattle = true
                    this.goingToBattle = true
                    this.goTo(battle.sprite.position, this.speed)
                }

                //If we touch a battle
                if (this.sprite.overlap(battle.sprite) && (this.terrainType !== "air" || this.joiningBattle)) {
                    this.joinBattle(battle)
                }
            }
        }

        //Move the unit if right click pressed whilst selected
        if (this.selected) {
            console.log(this.goingToBattle)
            if (mouseWentUp(RIGHT)) {
                let mousePos = createVector(mouseX, mouseY)
                
                this.goingToBattle ? this.goingToBattle = false : this.joiningBattle = false

                this.goTo(mousePos, this.speed)
            }


            //Unit Splitting
            if (keyDown("s") && this.strength / 2 >= 100) {
                this.split()
            }
        }

        this.updateLabels()

        this.effectiveStrength = this.strength * this.strengthModifier
    }

    select() {
        this.selected = true
        this.sprite.depth = 1
        this.sprite.shapeColor = color(`hsl(${this.h},${this.s}%,50%)`)
    }

    deselect() {
        this.selected = false
        this.sprite.depth = 0
        this.sprite.shapeColor = color(`hsl(${this.h},${this.s}%,${this.l}%)`)
    }

    startBattle(EnemyUnit) {
        this.deselect()
        client.globalBattles.push(new Battle((this.sprite.position.x + EnemyUnit.sprite.position.x) / 2, (this.sprite.position.y + EnemyUnit.sprite.position.y) / 2, this, EnemyUnit))
        this.strength = 0
        EnemyUnit.strength = 0
    }

    joinBattle(battle) {
        let factionExists

        for (const faction in battle.factions) {

            if (faction === this.faction) {
                console.log(battle.factions[faction].units)

                //If there is already units of our type in the battle then add on to that, otherwise add ourselves to it
                if (battle.factions[faction].units[this.type]) {
                    battle.factions[faction].units[this.type] += this.effectiveStrength
                }
                else {
                    battle.factions[faction].units[this.type] = this.effectiveStrength
                }

                battle.factions[faction].units[this.type] = battle.factions[faction].units[this.type] ? battle.factions[faction].units[this.type] + this.effectiveStrength : this.effectiveStrength

                console.log(battle.factions[faction].units)
                battle.factions[faction].totalStrength += this.effectiveStrength
                battle.totalStrength += this.effectiveStrength
                factionExists = true
            }
        }

        if (!factionExists) {
            battle.factions[this.faction] = {
                units: { [this.type]: this.effectiveStrength },
                totalStrength: this.effectiveStrength
            }
            battle.totalStrength += this.effectiveStrength
        }


        battle.factionList += this.effectiveStrength

        this.strength = 0
    }

    updateLabels() {
        textSize(12)
        textAlign(CENTER)
        fill(255, 255, 255)
        text(this.faction, this.sprite.position.x, this.sprite.position.y)
        textSize(8)
        text(`Strength:${this.effectiveStrength}`, this.sprite.position.x, this.sprite.position.y + 10)
        textSize(8)
        text(`${this.type[0].toUpperCase() + this.type.substring(1)}`, this.sprite.position.x, this.sprite.position.y + 20)
    }

    split() {
        const data = {
            faction: this.faction,
            height: this.height,
            width: this.width,
            h: this.h,
            s: this.s,
            l: this.l,
            positionX: this.sprite.position.x,
            positionY: this.sprite.position.y,
            strength: Math.floor(this.strength / 2),
        }

        data.positionX -= 30

        new unitTypes[this.type](data)

        data.positionX += 60

        new unitTypes[this.type](data)

        this.strength = 0
    }

    combine(unit) {
        this.strength += unit.strength
        unit.strength = 0
        unit.combining = true
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