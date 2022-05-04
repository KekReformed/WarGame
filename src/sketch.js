// p5 = require('p5')
// require('../node_modules/p5.play/lib/p5.play.js')
// Unit = require('./unit.js')

const damageInterval = 0.1
let unitList = []
let unitsCreated = 0
let boxCreated = false
let dragged = false
let rectStartX = 0
let rectStartY = 0
let timer = 0

function createUnit(name,height,width,h,s,l,xPos,yPos,list, faction = "neutral") {
    unit = new Unit(name,height,width,h,s,l,xPos,yPos,list,unitsCreated, faction)
    unitsCreated++
    return unit
}

setup = () => {
    canvas = createCanvas(window.outerWidth, window.outerHeight);
    jeff = createUnit("Jeff", 50, 50, 0, 100, 20, 300, 200, unitList, "USA")
    dave = createUnit("Dave", 50, 50, 0, 100, 20, 200, 200, unitList, "USA")
    derek = createUnit("Derek", 50, 50, 0, 100, 20, 400, 200, unitList, "UK")
    john = createUnit("John", 50, 50, 0, 100, 20, 100, 200, unitList, "UK")
}

draw = () => {
    frameRate(60)
    background(10, 10, 10);
    drawSprites();
    timer+=deltaTime/1000

    for (const i in unitList){
        
        unit = unitList[i]
        unit.updateUnit(unitList)
        
        if (timer>damageInterval) {
            if (unit.inBattle) unit.strength -= 1*unit.collisionCount;
        }

        if (unit.strength<=0) {
            unit.sprite.remove()
            unitList.splice(i,1)
        } 
    }
    
    if (timer>damageInterval) timer-=damageInterval;
    
    if (dragged === true) {
        stroke("#03e3fc")
        noFill()
        box = rect(rectStartX, rectStartY, mouseX - rectStartX, mouseY - rectStartY)
    }
}

mousePressed = () => {
    if (mouseButton === LEFT) {
        rectStartX = mouseX
        rectStartY = mouseY

        for (const i in unitList) {
            unit = unitList[i]
            if (unit.sprite.mouseIsOver && !unit.inBattle) {
                unit.selectUnit()
            }
            else {
                unit.deselectUnit()
            }
        }
    }
}

mouseReleased = () => {
    if (mouseButton !== LEFT) return;
    for (const i in unitList) {
        unit = unitList[i]
        //Check if a unit is within the box
        if (Math.min(rectStartX,mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX,mouseX) && Math.min(rectStartY,mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY,mouseY) && !unit.inBattle){
            unit.selectUnit()
        }
    }

    dragged = false
    boxCreated = false
}

mouseDragged = () => {
    if (mouseButton !== LEFT) return;
    dragged = true
}