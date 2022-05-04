const damageInterval = 0.1
let unitList = []
let unitsCreated = 0
let boxCreated = false
let dragged = false
let rectStartX = 0
let rectStartY = 0
let timer = 0

function createUnit(name,height,width,h,s,l,xPos,yPos,list) {
    unit = new Unit(name,height,width,h,s,l,xPos,yPos,list,unitsCreated)
    unitsCreated++
    return unit
}

function setup() {
    canvas = createCanvas(window.outerWidth, window.outerHeight);
    jeff = createUnit("Jeff", 50, 50, 0, 100, 40, 300, 200, unitList)
    dave = createUnit("Dave", 50, 50, 0, 100, 40, 200, 200, unitList)
    derek = createUnit("Derek", 50, 50, 0, 100, 40, 400, 200, unitList)
    john = createUnit("John", 50, 50, 0, 100, 40, 100, 200, unitList)
}

function draw() {
    frameRate(60)
    background(10, 10, 10);
    drawSprites();
    timer+=deltaTime/1000

    for (const i in unitList){
        
        unit = unitList[i]
        unit.updateUnit()
        
        if (timer>damageInterval) {
            if (unit.inBattle) unit.strength -= 1;
        }

        if (unit.strength===0) {
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

function mousePressed() {
    if (mouseButton == LEFT) {
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

function mouseReleased() {
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

function mouseDragged() {
    if (mouseButton !== LEFT) return;
    dragged = true
}