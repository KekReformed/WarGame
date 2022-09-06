import { unitTypes } from "."
import { p } from "./sketch"
import { Sprite } from "./Sprite"
import Unit, { AnyUnit } from "./units/Unit"
import { worldToScreen } from "./Util"

const damageInterval = 0.1

interface Factions {
    [factionName: string]: {
        units: AnyUnit[],
        totalStrength?: number
        unitCount?: number
    }
}


class Battle {
    positionX: number
    positionY: number
    firstUnit: Unit
    secondUnit: Unit
    factions: Factions
    totalStrength: number
    winningStrength: number
    winningFaction: string
    sprite: Sprite
    timer: number
    factionList: string[]
    battleParticipants: string[]

    constructor(positionX: number, positionY: number, firstUnit: Unit, secondUnit: Unit) {
        this.positionX = positionX
        this.positionY = positionY
        this.factions = {
            [firstUnit.faction]: {
                units: [firstUnit]
            },
            [secondUnit.faction]: {
                units: [secondUnit]
            }
        }
        this.totalStrength = 0
        this.sprite = new Sprite(positionX, positionY, 100, 100)
        this.sprite.userData = this
        this.sprite.color = `rgb(0,0,255)`
        this.timer = 0
        this.factionList = Object.keys(this.factions)
    }

    update() {
        this.timer += p.deltaTime / 1000
        if (this.timer > damageInterval) {
            this.winningStrength = 0
            let factionCount = 0
            this.totalStrength = 0

            for (const i in this.factions) {
                let faction = this.factions[i]
                faction.unitCount = 0
                faction.totalStrength = 0

                for (const i in faction.units) {
                    let unit = faction.units[i]
                    this.totalStrength += unit.strength * unit.strengthModifier
                    faction.totalStrength += unit.strength * unit.strengthModifier

                    faction.unitCount += 1
                }

                factionCount += 1
            }

            for (const i in this.factions) {
                let faction = this.factions[i]

                if (faction.totalStrength === 0) {
                    delete this.factions[i]
                    break
                }

                for (const i in faction.units) {
                    let unit = faction.units[i]

                    unit.strength -= ((this.totalStrength - faction.totalStrength) / factionCount / faction.unitCount) / 10
                }
            }
        }

        if (this.timer > damageInterval) this.timer -= damageInterval;

        //Creates the label overtop of the battle
        this.factionList = Object.keys(this.factions)
        this.battleParticipants = [...this.factionList]
        this.battleParticipants.splice(this.battleParticipants.length - 1, 1)

        if (this.factionList.length > 2) {
            this.battleParticipants = [this.battleParticipants.join(", ")]
        }

        this.battleParticipants.push(this.factionList[this.factionList.length - 1])

        let pos = worldToScreen(this.sprite.position.x, this.sprite.position.y)
        p.textSize(12)
        p.textAlign(p.CENTER)
        p.fill(255, 255, 255)
        p.noStroke()
        p.text(`Battle between ${this.battleParticipants.join(" and ")}`, pos.x, pos.y)
        p.text(`Total Strength:${Math.round(this.totalStrength)}`, pos.x, pos.y + 20)
        p.text(`Currently winning: ${this.winningFaction} with ${Math.round(this.winningStrength)} troops left`, pos.x, pos.y + 40)
    }
}

export default Battle