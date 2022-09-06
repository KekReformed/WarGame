import p5 from 'p5'
import { client, keyDown } from "./index"
import Airstrip from "./depots/Airstrip"
import Infantry from "./units/Infantry"
import { initalizeQuadTree, } from './QuadTree'
import * as sprites from './Sprite'
import City from "./City"
import { scaleBy, setOffset, worldToScreen } from './Util'
import * as pathfinding from "./Pathfinding"
import Aviation from './depots/Aviation'
import BattleShip from './units/BattleShip'

let timeHeld = 0
var dragged = false
var rectStartX = 0
var rectStartY = 0
let qt;

// If time scale is 1 then 1 day = 1 second this only effects money and day progression and NOT troop speed
export const timeScale = 1

let mouseState: { [k: string]: Boolean } = { "right": false, "left": false, "center": false };
let mouseDownState: { [k: string]: Boolean } = { "right": false, "left": false, "center": false };
let mouseUpState: { [k: string]: Boolean } = { "right": false, "left": false, "center": false };



function sketch(p: p5) {
    p.setup = () => {
        sprites.initalize()
        initalizeQuadTree(3)
        const canvas = p.createCanvas(window.outerWidth, window.outerHeight);

        const jeff = new Infantry({
            faction: "USA",
            positionX: 100,
            positionY: 200,
            strength: 2000
        })

        const dave = new Infantry({
            faction: "USA",
            positionX: 200,
            positionY: 200,
            strength: 2000
        })

        const derek = new Infantry({
            faction: "UK",
            positionX: 300,
            positionY: 200,
            strength: 2000,
        })

        const john = new BattleShip({
            faction: "UK",
            positionX: 400,
            positionY: 200,
            strength: 2000
        })

        const garry = new Infantry({
            faction: "Spain",
            positionX: 600,
            positionY: 200,
            strength: 2000
        })

        const jimbo = new Infantry({
            faction: "Spain",
            positionX: 500,
            positionY: 200,
            strength: 2000
        })

        const london = new City("UK", "London", 800, 400, 1000)
        const manchester = new City("Spain", "Manchester", 1200, 400, 1000)

        const barracks = new Airstrip({
            faction: "UK",
            positionX: 400,
            positionY: 600,
            inCity: false
        })

        const airstrip = new Aviation({
            faction: "UK",
            positionX: 600,
            positionY: 600,
            inCity: false
        })

        pathfinding.generateNodes()
        console.log(client)
    }

    p.draw = () => {
        // note for later if we experience extremely daunting performance issues make it so the Point gets updated rather than being re-inserted
        p.frameRate(200)
        p.background(10, 10, 10);
        p.textSize(12)
        p.textAlign(p.CENTER)
        p.fill(255, 255, 255)
        p.noStroke()
        let roundedPlayerMoney = Math.round(client.money)
        p.text(`£${roundedPlayerMoney >= 1000 ? Math.round(roundedPlayerMoney / 100) / 10 + "B" : roundedPlayerMoney + "M"}`, window.outerWidth / 2, 35)
        p.text(`Day ${p.floor(client.day)} of the conflict`, window.outerWidth / 2, 20)
        p.text(`${p.floor(p.frameRate())} fps`, window.outerWidth - 100, 20)
        //pathfinding.debug()
        sprites.drawSprites(); // make sure to draw the sprites before collision checks

        //Update the clients in-game date
        client.day += 1 * p.deltaTime / 1000 * timeScale

        // Update units
        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]
            unit.update()

            if (unit.kill || unit.strength <= 0) {
                unit.sprite.remove()
                client.globalUnits.splice(parseInt(i), 1)
                break
            }

            let mousePos = p.createVector(p.mouseX, p.mouseY)

            if (unit.selected) {
                for (const i in client.globalUnits) {
                    let otherUnit = client.globalUnits[i]

                    if (longClick(p.RIGHT) && otherUnit.sprite.position.dist(mousePos) < 80) {
                        unit.joiningBattle = true
                        unit.goingToBattle = true
                        unit.goingToUnit = otherUnit
                        unit.goTo(otherUnit.sprite.position, unit.speed)
                        break
                    }
                }

                for (const i in client.globalBattles) {
                    let battle = client.globalBattles[i]
                    let mousePos = p.createVector(p.mouseX, p.mouseY)

                    if (longClick(p.RIGHT) && battle.sprite.position.dist(mousePos) < 80) {
                        unit.joiningBattle = true
                        unit.goingToBattle = true
                        unit.goTo(battle.sprite.position, unit.speed)
                        break
                    }
                }
            }
        }

        // Update battles
        for (const i in client.globalBattles) {
            console.log(client.globalBattles.length)

            let battle = client.globalBattles[i]
            battle.update()

            for (const factionName in battle.factions) {
                let faction = battle.factions[factionName]

                if (faction.totalStrength <= 1) {
                    delete battle.factions[factionName]
                    break
                }
            }

            let factionList = Object.keys(battle.factions)


            // When a battle finishes
            if (factionList.length === 1) {
                battle.sprite.remove()

                let units = battle.factions[factionList[0]].units
                console.log(units)
                for (const i in units) {
                    let unit = units[i]
                    unit.sprite = new sprites.Sprite(battle.positionX,battle.positionY,50,50,unit)
                    unit.kill = false
                    unit.strength = Math.round(unit.strength)
                    client.globalUnits.push(unit)
                }

                client.globalBattles.splice(parseInt(i), 1)
            }
        }

        // Update cities
        for (const i in client.globalCities) {

            let city = client.globalCities[i]

            city.update()

            if (city.faction === client.faction) {
                client.money += (city.value / 365 * 1000 * p.deltaTime / 1000) * timeScale
            }
        }

        // Update depots
        for (const i in client.globalDepots) {

            let depot = client.globalDepots[i]

            depot.update()
        }

        // Update UI elements
        for (const i in client.globalUIComponents) {

            let UIComponent = client.globalUIComponents[i]

            UIComponent.update()
        }

        if (dragged === true) {
            p.stroke("#03e3fc")
            p.noFill()
            p.rect(rectStartX, rectStartY, p.mouseX, p.mouseY)
        }
        //debug qt draw
        // qt.draw()

        // Reset the mouse up status so it doesn't fire forever
        if (mouseUpState[p.LEFT]) mouseUpState[p.LEFT] = false;
        if (mouseUpState[p.CENTER]) mouseUpState[p.CENTER] = false;
        if (mouseUpState[p.RIGHT]) mouseUpState[p.RIGHT] = false;

        // Reset the mouse down status so it also doesn't fire forever
        if (mouseDownState[p.LEFT]) mouseDownState[p.LEFT] = false;
        if (mouseDownState[p.CENTER]) mouseDownState[p.CENTER] = false;
        if (mouseDownState[p.RIGHT]) mouseDownState[p.RIGHT] = false;
    }

    p.mousePressed = () => {
        mouseState[p.mouseButton] = true;
        mouseDownState[p.mouseButton] = true;
        if (p.mouseButton === p.LEFT) {
            rectStartX = p.mouseX
            rectStartY = p.mouseY

            let unitSelected = false
            // Select a unit by clicking on it
            for (const i in client.globalUnits) {
                let unit = client.globalUnits[i]
                if (unit.sprite.isMouseOver() && unit.faction === client.faction && unitSelected === false) {
                    unit.select()
                    unitSelected = true
                }

                else {
                    unit.deselect()
                }
            }
            // Select a depot by clicking on it
            for (const i in client.globalDepots) {
                let depot = client.globalDepots[i]

                if (depot.sprite.isMouseOver() && depot.faction === client.faction) {
                    depot.select()
                }
                else {
                    depot.deselect()
                }
            }
        }

    }

    p.mouseReleased = () => {
        mouseState[p.mouseButton] = false;
        mouseUpState[p.mouseButton] = true
        if (p.mouseButton === p.LEFT) {
            for (const i in client.globalUnits) {
                let unit = client.globalUnits[i]

                let pos = worldToScreen(unit.sprite.position.x, unit.sprite.position.y);
                // Check if a unit is within the rectangle
                if (
                    Math.min(rectStartX, p.mouseX) < pos.x &&
                    pos.x < Math.max(rectStartX, p.mouseX) &&
                    Math.min(rectStartY, p.mouseY) < pos.y &&
                    pos.y < Math.max(rectStartY, p.mouseY)
                ) {
                    unit.select()
                }
            }
            dragged = false
        }
    }

    p.mouseDragged = () => {
        if (p.mouseButton === p.CENTER || (p.mouseButton === p.LEFT && keyDown("ControlLeft"))) {
            setOffset((p.mouseX - rectStartX), (p.mouseY - rectStartY))
            rectStartX = p.mouseX;
            rectStartY = p.mouseY;
        }
        if (p.mouseButton === p.RIGHT) return;
        dragged = true
    }

    p.mouseWheel = (event) => {
        // @ts-ignore
        scaleBy(event.delta < 0 ? 1.05 : 0.95)
    }

    dragged = false


}


export function longClick(mouseButton: any) {

    timeHeld = mouseDown(mouseButton) ? timeHeld + p.deltaTime : 0

    if (timeHeld > 800) {
        timeHeld = 0
        return true
    }
    else {
        return false
    }
}

export function mouseUp(mouseButton: any) {
    return mouseUpState[mouseButton]
}

export function mouseDown(mouseButton: any) {
    return mouseState[mouseButton]
}

export function mouseWentDown(mouseButton: any) {
    return mouseDownState[mouseButton]
}

export const p = new p5(sketch)