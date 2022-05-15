import p5 from 'p5'
import { client, keyDown, keyWentDown, unitTypes } from "./index"
import { UnitData } from './units/Unit'
import Airstrip from "./depots/Airstrip"
import Infantry from "./units/Infantry"
import Bomber from "./units/Bomber"
import Fighter from "./units/Fighter"
import { QuadTree, initalizeQuadTree, Rectangle, Point } from './QuadTree'
import * as sprites from './Sprite'
import City from "./City"
import { scaleBy, setOffset, worldToScreen } from './Util'
let timeHeld = 0
var dragged = false
var rectStartX = 0
var rectStartY = 0
let qt;
// interface MouseState {
//     "right": Boolean
//     "left": Boolean
//     "center": Boolean
// }

export let mouseState: { [k: string]: Boolean } = { "right": false, "left": false, "center": false };

function sketch(p: p5) {
    p.setup = () => {
        sprites.initalize()
        initalizeQuadTree(3)
        const canvas = p.createCanvas(window.outerWidth, window.outerHeight);
        const jeff = new Infantry({
            faction: "USA",
            height: 50,
            width: 50,
            h: 0,
            s: 100,
            l: 20,
            positionX: 100,
            positionY: 200,
            strength: 2000
        })

        const dave = new Infantry({
            faction: "USA",
            height: 50,
            width: 50,
            h: 0,
            s: 100,
            l: 20,
            positionX: 200,
            positionY: 200,
            strength: 2000
        })

        const derek = new Infantry({
            faction: "UK",
            height: 50,
            width: 50,
            h: 0,
            s: 100,
            l: 20,
            positionX: 300,
            positionY: 200,
            strength: 2000
        })

        const john = new Fighter({
            faction: "UK",
            height: 50,
            width: 50,
            h: 0,
            s: 100,
            l: 20,
            positionX: 400,
            positionY: 200,
            strength: 2000
        })

        const garry = new Infantry({
            faction: "Spain",
            height: 50,
            width: 50,
            h: 0,
            s: 100,
            l: 20,
            positionX: 600,
            positionY: 200,
            strength: 2000
        })

        const jimbo = new Bomber({
            faction: "Spain",
            height: 50,
            width: 50,
            h: 0,
            s: 100,
            l: 20,
            positionX: 500,
            positionY: 200,
            strength: 2000
        })

        const london = new City("UK", "London", 800, 400, 100)
        const manchester = new City("Spain", "Manchester", 1200, 400, 100)

        const barracks = new Airstrip({
            faction: "Spain",
            positionX: 400,
            positionY: 600,
            city: "None",
            inCity: false
        })

        const airstrip = new Airstrip({
            faction: "UK",
            positionX: 600,
            positionY: 600,
            city: "None",
            inCity: false
        })
    }

    p.draw = () => {
        // note for later if we experience extremely daunting performance issues make it so the Point gets updated rather than being re-inserted
        qt = new QuadTree(new Rectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2))
        p.frameRate(60)
        p.background(10, 10, 10);
        p.textSize(12)
        p.textAlign(p.CENTER)
        p.fill(255, 255, 255)
        p.noStroke()
        let roundedPlayerMoney = Math.round(client.money)
        p.text(`£${roundedPlayerMoney >= 1000 ? Math.round(roundedPlayerMoney / 100) / 10 + "B" : roundedPlayerMoney + "M"}`, window.outerWidth / 2, 20)
        p.text(`${p.floor(p.frameRate())} fps`, window.outerWidth - 100, 20)

        sprites.drawSprites(); // make sure to draw the sprites before collision checks

        //Update units
        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]
            unit.update()
            qt.add(new Point(unit.sprite.position.x, unit.sprite.position.y, unit))
            if (unit.strength <= 0) {
                unit.sprite.remove()
                client.globalUnits.splice(parseInt(i), 1)
            }
            const others = qt.search(new Rectangle(unit.sprite.position.x, unit.sprite.position.y, unit.sprite.width * 2, unit.sprite.height * 2))
            // reduced sample size
            if (others.length) for (let point of others) {
                unit.sprite.collisionDetection(point.unit.sprite)
            }
        }

        //Update battles
        for (const i in client.globalBattles) {

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


            //When a battle finishes
            if (factionList.length === 1) {
                battle.sprite.remove()
                let units = battle.factions[factionList[0]].units

                let unitData: UnitData = {
                    faction: factionList[0],
                    height: 50,
                    width: 50,
                    h: 0,
                    s: 100,
                    l: 20,
                    positionX: battle.sprite.position.x,
                    positionY: battle.sprite.position.y
                }

                for (const unitTerrainType in units) {
                    for (const unitType in units[unitTerrainType]) {
                        unitData.strength = Math.round(units[unitTerrainType][unitType])

                        new unitTypes[unitType](unitData)
                    }
                }

                client.globalBattles.splice(parseInt(i), 1)
            }
        }

        //Update cities
        for (const i in client.globalCities) {

            let city = client.globalCities[i]

            city.update()

            if (city.faction === client.faction) {
                client.money += city.value / 365 * 1000
            }
        }

        //Update depots
        for (const i in client.globalDepots) {

            let depot = client.globalDepots[i]

            depot.update()
        }

        //Update UI elements
        for (const i in client.globalUIComponents) {

            let UIComponent = client.globalUIComponents[i]

            UIComponent.update()
        }

        if (dragged === true) {
            p.stroke("#03e3fc")
            p.noFill()
            p.rect(rectStartX, rectStartY, p.mouseX, p.mouseY)
        }
    }

    p.mousePressed = () => {
        mouseState[p.mouseButton] = true;
        if (p.mouseButton === p.LEFT) {
            rectStartX = p.mouseX
            rectStartY = p.mouseY

            let unitSelected = false
            //Select a unit by clicking on it
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
            //Select a depot by clicking on it
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
        if (p.mouseButton !== p.LEFT) return;
        for (const i in client.globalUnits) {
            let unit = client.globalUnits[i]
            
            let pos = worldToScreen(unit.sprite.position.x, unit.sprite.position.y)
            //Check if a unit is within the rectangle
            if (Math.min(rectStartX, p.mouseX) < pos.x && pos.x < Math.max(rectStartX, p.mouseX) && Math.min(rectStartY, p.mouseY) < pos.y && pos.y < Math.max(rectStartY, p.mouseY)) {
                unit.select()
            }
        }
        dragged = false
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
        //@ts-ignore
        scaleBy(event.delta > 0 ? 1.05 : 0.95)
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

export function mouseDown(mouseButton: any) {
    return mouseState[mouseButton]
}

export const p = new p5(sketch)