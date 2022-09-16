import { Vector } from "p5";
import { p, mouseUp } from "../sketch";
import Battle from "../Battle";
import { generateID, keyDown, unitTypes } from "../index";
import { Anchor, Sprite } from "../Sprite";
import Armour from "./Armour.js";
import Bomber from "./Bomber.js";
import Fighter from "./Fighter.js";
import Infantry from "./Infantry.js";
import { screenToWorld, worldToScreen } from "../Util";
import * as pathfinding from "../Pathfinding"
import { game } from "../../lobby";
import { socket } from "../../../shared/api";

export type AnyUnit = Infantry | Armour | Fighter | Bomber
export type Terrain = "land" | "air"

export interface UnitData extends Partial<Unit> {
    positionX: number
    positionY: number
}

// let pos: Vector;

class Unit {
    id: number
    height: number
    width: number
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
    kill: boolean
    path: pathfinding.node[]

    constructor(unitData: UnitData) {
        this.id = generateID()
        this.height = 50
        this.width = 50
        this.selected = false
        this.faction = unitData.faction
        this.strength = unitData.strength
        this.effectiveStrength = unitData.strength
        this.strengthModifier = 1
        this.speed = 1
        game.units.push(this)
        this.sprite = new Sprite(unitData.positionX, unitData.positionY, this.height, this.width, 0, Anchor.top)
        this.sprite.userData = this
        this.goToPoint = this.sprite.position
        this.sprite.color = `RGB(102,0,0)`
        this.sprite.velocityRotate = true
        this.path = []
    }

    is<UnitType>(type: string): this is UnitType {
        return this.type === type
    }

    update() {

        if (this.strength <= 0 || this.kill) return;

        if (this.goToPoint && this.sprite.position.dist(this.goToPoint) < 3) {
            if (this.path.length > 0 && this.terrainType !== "air") {
                let finalPoint = p.createVector(this.path[0].x, this.path[0].y)
                this.goTo(finalPoint, this.speed)
                this.path.splice(0, 1)
            }
            else {
                this.sprite.setVelocity(0, 0);
                this.goToPoint = undefined
            }
        }

        if (this.goingToUnit) this.goTo(this.goingToUnit.sprite.position, this.speed)


        let mousePos = p.createVector(p.mouseX, p.mouseY)

        // New unit collisions
        if (this.sprite.collisions.length !== 0) {
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

                for (const y in pathfinding.nodes) {
                    let nodeRows = pathfinding.nodes[y]

                    for (const x in nodeRows) {
                        let node = nodeRows[x]
                        let nodePosition = p.createVector(node.x, node.y)
                        let dist = this.sprite.position.dist(nodePosition)
                        let mouseDist = mousePos.dist(nodePosition)

                        if (dist < pathfinding.nodeSize && dist < closestNodeDist) {
                            closestNodeDist = dist
                            closestNode = node
                        }

                        if (mouseDist < pathfinding.nodeSize && mouseDist < closestMouseNodeDist) {
                            closestMouseNodeDist = mouseDist
                            closestMouseNodePosition = nodePosition
                            closestMouseNode = node
                        }
                    }
                }

                this.path = pathfinding.findBestPath(closestNode.xIndex, closestNode.yIndex, closestMouseNode.xIndex, closestMouseNode.yIndex)
                let finalPoint = p.createVector(this.path[0].x, this.path[0].y)

                this.goingToBattle ? this.goingToBattle = false : this.joiningBattle = false
                if (!this.joiningBattle) this.goingToUnit = null
                if (this.terrainType === "air" && !mousePos.equals(this.goToPoint)) this.goTo(mousePos, this.speed)
                else if (!mousePos.equals(this.goToPoint)) this.goTo(finalPoint, this.speed)
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
        this.sprite.color = "RGB(255,0,0)"
    }

    deselect() {
        this.selected = false
        this.sprite.color = "RGB(102,0,0)"
    }

    startBattle(EnemyUnit: Unit) {
        this.deselect()
        let battle = new Battle((this.sprite.position.x + EnemyUnit.sprite.position.x) / 2, (this.sprite.position.y + EnemyUnit.sprite.position.y) / 2, this, EnemyUnit)
        game.battles.push(battle)
        this.kill = true
        EnemyUnit.kill = true
    }

    joinBattle(battle: Battle) {
        let factionExists

        for (const faction in battle.factions) {

            if (faction === this.faction) {

                battle.factions[this.faction].units.push(this)
                factionExists = true
            }
        }

        if (!factionExists) {
            console.log(battle)
            battle.factions[this.faction] = {
                units: [this]
            }
            battle.totalStrength += this.effectiveStrength
            battle.factionList.push(this.faction)
        }

        this.kill = true
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
            positionX: this.sprite.position.x,
            positionY: this.sprite.position.y,
            strength: Math.floor(this.strength / 2),
        }

        data.positionX -= 30

        new unitTypes[this.type](data)

        data.positionX += 60

        new unitTypes[this.type](data)

        this.kill = true
    }

    combine(unit: Unit) {
        this.strength += unit.strength
        unit.strength = 0
        unit.combining = true
    }

    goTo(destination: Vector, speed = 1, toServer: boolean = true) {
        this.goToPoint = p.createVector(destination.x, destination.y)
        this.vector = p.createVector(destination.x - this.sprite.position.x, destination.y - this.sprite.position.y)
        this.vector.normalize()
        this.vector.mult(speed)
        // Multiply the vector by deltatime so that it isn't tied to frame rate
        this.vector.mult(p.deltaTime * 0.1)
        this.sprite.setVelocity(this.vector.x, this.vector.y)

        if (toServer) socket.emit("moveUnit", { id: this.id, destination, speed })
    }
}
export default Unit