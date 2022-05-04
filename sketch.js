const damageInterval = 0.1
let unitList = []
let unitsCreated = 0
let boxCreated = false
let dragged = false
let rectStartX = 0
let rectStartY = 0
let offset;
let mouseOffset;
let w, h
let timer = 0

function createUnit(name,height,width,h,s,l,xPos,yPos,list, faction = "neutral") {
    unit = new Unit(name,height,width,h,s,l,xPos,yPos,list,unitsCreated, faction)
    unitsCreated++
    return unit
}

function setup() {
    w = window.outerWidth
    h = window.outerHeight
    canvas = createCanvas(w, h);
    jeff = createUnit("Jeff", 50, 50, 0, 100, 20, 300, 200, unitList, "USA")
    dave = createUnit("Dave", 50, 50, 0, 100, 20, 200, 200, unitList, "USA")
    derek = createUnit("Derek", 50, 50, 0, 100, 20, 400, 200, unitList, "UK")
    john = createUnit("John", 50, 50, 0, 100, 20, 100, 200, unitList, "UK")
    pan = createVector(0, 0);
    offset = createVector(0, 0)
    mouseOffset = createVector(0, 0)
}

function draw() {
    
    frameRate(60)
    background(10, 10, 10);
    drawSprites()
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
        box = rect(rectStartX, rectStartY, camera.mouseX - rectStartX, camera.mouseY - rectStartY)
    }
}

function mousePressed() {
    if (mouseButton === LEFT && !keyIsDown(CONTROL)) {
        rectStartX = camera.mouseX
        rectStartY = camera.mouseY

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

function mouseReleased() {
    if (mouseButton === CENTER || (mouseButton === LEFT && keyIsDown(CONTROL))) {
        offset.set(camera.position.x, camera.position.y)
    }
    if (mouseButton !== LEFT && !dragged) return;
    for (const i in unitList) {
        unit = unitList[i]
        //Check if a unit is within the box
        if (Math.min(rectStartX, camera.mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX, camera.mouseX) && Math.min(rectStartY, camera.mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY, camera.mouseY)) {
            unit.selectUnit()
        }
    }

    dragged = false
    boxCreated = false
}

function mouseDragged() {
    if (mouseButton !== LEFT) return;
    dragged = true
}