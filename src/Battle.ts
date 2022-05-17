import { p } from "./sketch"
import { Sprite } from "./Sprite"
import Unit from "./units/Unit"
import { worldToScreen } from "./Util"

interface Factions {
    [factionName: string]: {
        units: {
            [terrainType: string]: {
                [type: string]: number
            }
        }
        totalStrength?: number
        land?: number
        air?: number
        uniqueLandUnits?: number
        uniqueAirUnits?: number
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
    land: number
    air: number
    sprite: Sprite
    damageInterval: number
    timer: number
    factionList: string[]
    battleParticipants: string[]
 
    constructor(positionX: number, positionY: number, firstUnit: Unit, secondUnit: Unit) {
        this.positionX = positionX
        this.positionY = positionY
        this.factions = {
            [firstUnit.faction]: {
                units: { [firstUnit.terrainType]: { [firstUnit.type]: firstUnit.effectiveStrength } }
            },
            [secondUnit.faction]: { units: { [secondUnit.terrainType]: { [secondUnit.type]: secondUnit.effectiveStrength } } }
        }
        this.totalStrength = 0
        this.land = 0
        this.air = 0
        this.sprite = new Sprite(positionX, positionY, 100, 100)
        this.sprite.color = `rgb(0,0,255)`
        this.damageInterval = 0.1
        this.timer = 0
        this.factionList = Object.keys(this.factions)

        for (const factionName in this.factions) {
            let faction = this.factions[factionName]
            faction.totalStrength = 0
            faction.land = 0
            faction.air = 0

            for (const unitTerrainType in faction.units) {

                for (const unitType in faction.units[unitTerrainType]) {
                    // @ts-ignore yeah I'm not making typescript allow this it basically just picks "air" or "land" (or "naval" later in this class)
                    this[unitTerrainType] += faction.units[unitTerrainType][unitType]
                    // @ts-ignore ^^
                    faction[unitTerrainType] += faction.units[unitTerrainType][unitType]
                    faction.totalStrength += faction.units[unitTerrainType][unitType]
                    this.totalStrength += faction.units[unitTerrainType][unitType]
                }
            }
        }
    }

    update() {
        this.timer += p.deltaTime / 1000

        if (this.timer > this.damageInterval) {
            this.winningStrength = 0

            let totalDamage = 0
            let totalAirDamage = 0

            for (const factionName in this.factions) {
                let faction = this.factions[factionName]
                faction.uniqueLandUnits = 0
                faction.uniqueAirUnits = 0

                let damage = Math.min(0.025 * (this.totalStrength - faction.totalStrength), 100)
                let airDamage = Math.min(0.025 * (this.air - faction.air), 100) 

                for (const unitTerrainType in faction.units) {
                    if (unitTerrainType === "land") faction.uniqueLandUnits += 1
                    if (unitTerrainType === "air") faction.uniqueAirUnits += 1
                }

                for (const unitTerrainType in faction.units) {

                    if (unitTerrainType === "land") {
                        for (const unitType in faction.units[unitTerrainType]) {
                            let dividedDamage = damage / faction.uniqueLandUnits

                            faction.units.land[unitType] -= dividedDamage
                            faction.land -= dividedDamage
                            faction.totalStrength -= dividedDamage
                            totalDamage += dividedDamage
                        }
                    }

                    //Air units only take damage from other air units which is calculated in air damage unless they are the only unit in combat
                    if(unitTerrainType === "air") {
                        for (const unitType in faction.units[unitTerrainType]) {
                            let dividedDamage;
                            if (faction.uniqueLandUnits < 1) {
                                dividedDamage = damage / faction.uniqueAirUnits
                                totalDamage += dividedDamage
                            }
                            else {
                                dividedDamage = airDamage / faction.uniqueAirUnits
                                totalAirDamage += dividedDamage
                            }

                            faction.units.air[unitType] -= dividedDamage
                            faction.air -= dividedDamage
                            faction.totalStrength -= dividedDamage
                        }
                    }
                }

                if (faction.totalStrength > this.winningStrength) {
                    this.winningFaction = factionName
                    this.winningStrength = faction.totalStrength
                }
            }

            this.totalStrength -= totalDamage
            this.land -= totalDamage
            this.air -= totalAirDamage
        }

        if (this.timer > this.damageInterval) this.timer -= this.damageInterval;

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