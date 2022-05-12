import { Vector } from "p5";
import { p } from "../sketch";
import Battle from "../Battle";
import { client, longClick, unitTypes } from "../index";
import { Anchor, Sprite } from "../Sprite";
import Armour from "./Armour.js";
import Bomber from "./Bomber.js";
import Fighter from "./Fighter.js";
import Infantry from "./Infantry.js";

export type AnyUnit = Infantry | Armour | Fighter | Bomber
export type Terrain = "land" | "air"

export interface UnitData extends Partial<Unit> {
    positionX: number
    positionY: number
}

class Unit {
    height: number
    width: number
    h: number
    s: number
    l: number
    selected: boolean
    faction: string
    strength: number
    effectiveStrength: number
    strengthModifier: number
    speed: number
    vector: Vector
    goToPoint: Vector
    sprite: Sprite
    goingToUnit: Unit
    joiningBattle: boolean
    goingToBattle: boolean
    terrainType: Terrain
    combining: boolean
    type: string
    
    constructor(unitData: UnitData) {
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
        client.globalUnits.push(this)
        this.sprite = new Sprite(unitData.positionX, unitData.positionY, unitData.width, unitData.height, 0, Anchor.top)
        this.goToPoint = this.sprite.position
        this.sprite.color = `hsl(${this.h}, ${this.s}%, ${this.l}%)`
        this.sprite.velocityRotate = true
    }
    
    is<UnitType>(type: string): this is UnitType {
        return this.type === type
    }
    
    update() {
        if (this.sprite.position.dist(this.goToPoint) < 3) this.sprite.setVelocity(0, 0);
        
        if (this.goingToUnit) this.goTo(this.goingToUnit.sprite.position, this.speed)
        
        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]
            
            let mousePos = p.createVector(p.mouseX, p.mouseY)
            console.log(this.selected, longClick(p.RIGHT), unit.sprite.position.dist(mousePos))
            // Requires p5.play.js
            // if (this.selected && longClick(p.RIGHT) && unit.sprite.position.dist(mousePos) < 80) {
                //     this.joiningBattle = true
                //     this.goingToBattle = true
                //     this.goingToUnit = client.globalUnits[i]
                //     this.goTo(unit.sprite.position, this.speed)
                // }
                
                //If were touching a unit and we're not an air unit or we're joining the battle
                if (this.sprite.collisions.includes(unit.sprite) && (this.terrainType !== "air" && unit.terrainType !== "air" || this.joiningBattle)) {
                    
                    //If the unit we're colliding with is an enemy
                    if (unit.faction !== this.faction && unit.terrainType !== "air") {
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
                    let mousePos = p.createVector(p.mouseX, p.mouseY)
                    
                    // Requires p5.play.js
                    // if (this.selected && longClick(p.RIGHT) && battle.sprite.position.dist(mousePos) < 80) {
                        //     this.joiningBattle = true
                        //     this.goingToBattle = true
                        //     this.goTo(battle.sprite.position, this.speed)
                // }
                
                //If we touch a battle
                if (this.sprite.collisions.includes(battle.sprite) && (this.terrainType !== "air" || this.joiningBattle)) {
                    this.joinBattle(battle)
                }
            }
        }
        
        //Move the unit if right click pressed whilst selected
        if (this.selected) {
            
            // if (mouseWentUp(p.RIGHT)) {
                //     let mousePos = p.createVector(p.mouseX, p.mouseY)
                
                //     this.goingToBattle ? this.goingToBattle = false : this.joiningBattle = false
                //     this.goingToUnit = null
                //     this.goTo(mousePos, this.speed)
                // }
                
                //Unit Splitting
                // if (keyDown("s") && this.strength / 2 >= 100) {
                    //     this.split()
                    // }
                }
                
                this.updateLabels()
                
                this.effectiveStrength = this.strength * this.strengthModifier
            }
            
            select() {
                this.selected = true
                this.sprite.color = "#ff0000"
            }
            
            deselect() {
                this.selected = false
                this.sprite.color = "#660000"
            }
            
            startBattle(EnemyUnit: Unit) {
                this.deselect()
                client.globalBattles.push(new Battle((this.sprite.position.x + EnemyUnit.sprite.position.x) / 2, (this.sprite.position.y + EnemyUnit.sprite.position.y) / 2, this, EnemyUnit))
                this.strength = 0
                EnemyUnit.strength = 0
            }
            
            joinBattle(battle: Battle) {
                let factionExists
                
                for (const faction in battle.factions) {
                    
                    if (faction === this.faction) {
                        
                        if (!battle.factions[faction].units[this.terrainType]) {
                            battle.factions[faction].units[this.terrainType] = {}
                        }
                        
                        //If there is already units of our type in the battle then add on to that, otherwise add ourselves to it
                        if (battle.factions[faction].units[this.terrainType][this.type]) {
                            battle.factions[faction].units[this.terrainType][this.type] += this.effectiveStrength
                        }
                        
                        else {
                            battle.factions[faction].units[this.terrainType][this.type] = this.effectiveStrength
                }
                
                battle.factions[faction].totalStrength += this.effectiveStrength
                battle.factions[faction][this.terrainType] += this.effectiveStrength
                battle.totalStrength += this.effectiveStrength
                battle[this.terrainType] += this.effectiveStrength
                factionExists = true
            }
        }
        
        if (!factionExists) {
            battle.factions[this.faction] = {
                units: { [this.terrainType]: { [this.type]: this.effectiveStrength } },
                totalStrength: this.effectiveStrength,
                [this.terrainType]: this.effectiveStrength,
            }
            battle.totalStrength += this.effectiveStrength
        }
        
        // fix pls
        // battle.factionList += this.effectiveStrength
        
        this.strength = 0
    }
    
    updateLabels() {
        p.textSize(12)
        p.textAlign(p.CENTER)
        p.fill(255, 255, 255)
        p.text(this.faction, this.sprite.position.x, this.sprite.position.y)
        p.textSize(8)
        p.text(`Strength:${this.effectiveStrength}`, this.sprite.position.x, this.sprite.position.y + 10)
        p.textSize(8)
        p.text(`${this.type[0].toUpperCase() + this.type.substring(1)}`, this.sprite.position.x, this.sprite.position.y + 20)
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
    
    combine(unit: Unit) {
        this.strength += unit.strength
        unit.strength = 0
        unit.combining = true
    }
    
    goTo(destination: Vector, speed = 1) {
        this.goToPoint = p.createVector(destination.x, destination.y)
        this.vector = p.createVector(destination.x - this.sprite.position.x, destination.y - this.sprite.position.y)
        this.vector.normalize()
        this.vector.mult(speed)
        this.sprite.setVelocity(this.vector.x, this.vector.y)
    }
}
export default Unit