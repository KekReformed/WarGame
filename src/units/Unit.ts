import { Vector } from "p5";
import { p, longClick, mouseUp } from "../sketch";
import Battle from "../Battle";
import { client, keyDown, unitTypes } from "../index";
import { Anchor, Sprite } from "../Sprite";
import Armour from "./Armour.js";
import Bomber from "./Bomber.js";
import Fighter from "./Fighter.js";
import Infantry from "./Infantry.js";
import { screenToWorld, worldToScreen } from "../Util";
import Pathfinding, { nodes, nodeSize } from "../Pathfinding";

export type AnyUnit = Infantry | Armour | Fighter | Bomber
export type Terrain = "land" | "air"

export interface UnitData extends Partial<Unit> {
    positionX: number
    positionY: number
}

// let pos: Vector;

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
    goToPoint: Vector | undefined
    sprite: Sprite
    goingToUnit: Unit
    joiningBattle: boolean
    goingToBattle: boolean
    terrainType: Terrain
    combining: boolean
    type: string
    pathFinder: Pathfinding

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
        this.sprite.userData = this
        this.goToPoint = this.sprite.position
        this.sprite.color = `hsl(${this.h}, ${this.s}%, ${this.l}%)`
        this.sprite.velocityRotate = true
        this.pathFinder = unitData.pathFinder
    }

    is<UnitType>(type: string): this is UnitType {
        return this.type === type
    }

    update() {
        if (this.strength <= 0) return;

        if (this.goToPoint && this.sprite.position.dist(this.goToPoint) < 3) {
            this.sprite.setVelocity(0, 0);
            this.goToPoint = undefined
        }

        if (this.goingToUnit) this.goTo(this.goingToUnit.sprite.position, this.speed)


        let mousePos = p.createVector(p.mouseX, p.mouseY)

        // New unit collisions
        if (this.sprite.collisions.length != 0) {
            for (const i in this.sprite.collisions) {
                /** The thing it's colliding with */
                const colliding = this.sprite.collisions[i].userData

                if (colliding instanceof Unit) {
                    if (this.faction !== colliding.faction && (this.terrainType !== "air" && !this.joiningBattle || colliding.terrainType !== "air" && !colliding.joiningBattle) && this.faction !== colliding.faction) {
                        this.startBattle(colliding)
                    }

                    if (this.sprite.position.dist(colliding.sprite.position) < 8 && this.faction === colliding.faction && !this.sprite.position.equals(colliding.sprite.position) && !this.combining && this.type === colliding.type) {
                        this.combine(colliding)
                    }
                }

                if (colliding instanceof Battle) {
                    // If we touch a battle (Currently doesn't work due to collision)
                    if (this.terrainType !== "air" || this.joiningBattle) {
                        this.joinBattle(colliding)
                    }
                }
            }
        }

        //Move the unit if right click pressed whilst selected
        if (this.selected) {
            if (mouseUp(p.RIGHT)) {
                let pos = screenToWorld(p.mouseX, p.mouseY);
                let mousePos = p.createVector(pos.x, pos.y);
                let closestMouseNodePosition;
                let closestNode;
                let closestMouseNode;
                let closestNodeDist = Infinity
                let closestMouseNodeDist = Infinity

                for (const y in nodes) {
                    let nodeRows = nodes[y]
                    for (const x in nodeRows) {
                        let node = nodeRows[x]
                        let nodePosition = p.createVector(node.x, node.y)
                        let dist = this.sprite.position.dist(nodePosition)
                        let mouseDist = mousePos.dist(nodePosition)

                        if (dist < nodeSize && dist < closestNodeDist) {
                            closestNodeDist = dist
                            closestNode = node
                        }

                        if (mouseDist < nodeSize && mouseDist < closestMouseNodeDist) {
                            closestMouseNodeDist = mouseDist
                            closestMouseNodePosition = nodePosition
                            closestMouseNode = node
                        }
                    }
                }

                this.pathFinder.exploreSurroundingNode(closestNode,closestNode.xIndex,closestNode.yIndex,closestMouseNode.xIndex,closestMouseNode.yIndex)
                this.pathFinder.findBestPath(closestNode.xIndex,closestNode.yIndex,closestMouseNode.xIndex,closestMouseNode.yIndex)
                
                this.goingToBattle ? this.goingToBattle = false : this.joiningBattle = false
                if (!this.joiningBattle) this.goingToUnit = null
                if (!mousePos.equals(this.goToPoint)) this.goTo(closestMouseNodePosition, this.speed)
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
        this.sprite.color = "#ff0000"
    }

    deselect() {
        this.selected = false
        this.sprite.color = "#660000"
    }

    startBattle(EnemyUnit: Unit) {
        this.deselect()
        let battle = new Battle((this.sprite.position.x + EnemyUnit.sprite.position.x) / 2, (this.sprite.position.y + EnemyUnit.sprite.position.y) / 2, this, EnemyUnit)
        client.globalBattles.push(battle)
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
            console.log(battle)
            battle.factions[this.faction] = {
                units: { [this.terrainType]: { [this.type]: this.effectiveStrength } },
                totalStrength: this.effectiveStrength,
                [this.terrainType]: this.effectiveStrength,
            }
            battle.totalStrength += this.effectiveStrength
            // fixed? pls.
            battle.factionList.push(this.faction)
        }


        this.strength = 0
    }

    updateLabels() {
        let pos = worldToScreen(this.sprite.position.x, this.sprite.position.y)
        p.textSize(12)
        p.textAlign(p.CENTER)
        p.fill(255, 255, 255)
        p.text(this.faction, pos.x, pos.y)
        p.textSize(8)
        p.text(`Strength:${this.effectiveStrength}`, pos.x, pos.y + 10)
        p.textSize(8)
        p.text(`${this.type[0].toUpperCase() + this.type.substring(1)}`, pos.x, pos.y + 20)
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
        // Multiply the vector by deltatime so that it isn't tied to frame rate
        this.vector.mult(p.deltaTime * 0.1)
        this.sprite.setVelocity(this.vector.x, this.vector.y)
    }
}
export default Unit