let unitList = []
let boxCreated = false
let dragged = false
let rectStartX = 0
let rectStartY = 0
let offset;
let mouseOffset;
let w, h

function setup() {
    w = window.outerWidth
    h = window.outerHeight
    canvas = createCanvas(w, h);
    jeff = new Unit(50, 50, 0, 100, 40, 300, 200, unitList)
    dave = new Unit(50, 50, 0, 100, 40, 200, 200, unitList)
    derek = new Unit(50, 50, 0, 100, 40, 400, 200, unitList)
    john = new Unit(50, 50, 0, 100, 40, 100, 200, unitList)
    pan = createVector(0, 0);
    offset = createVector(0, 0)
    mouseOffset = createVector(0, 0)
}

function draw() {

    unitList.forEach(unit => {
        unit.updateUnit()
    })
    frameRate(60)
    background(10, 10, 10);

    if (dragged === true) {
        stroke("#03e3fc")
        noFill()
        box = rect(rectStartX, rectStartY, camera.mouseX - rectStartX, camera.mouseY - rectStartY)
    }
    drawSprites();
}

function mousePressed() {
    if (mouseButton === LEFT && !keyIsDown(CONTROL)) {
        rectStartX = camera.mouseX
        rectStartY = camera.mouseY

        unitList.forEach(unit => {
            if (unit.sprite.mouseIsOver) {
                unit.selectUnit()
            }
            else {
                unit.deselectUnit()
            }
        })
    }
    if (mouseButton === CENTER || (mouseButton === LEFT && keyIsDown(CONTROL))) {
        mouseOffset.set(mouseX, mouseY)
        rectStartX = camera.mouseX
        rectStartY = camera.mouseY
    }
}

function mouseReleased() {
    if (mouseButton === CENTER || (mouseButton === LEFT && keyIsDown(CONTROL))) {
        offset.set(camera.position.x, camera.position.y)
    }
    if (mouseButton !== LEFT && !dragged) return;
    unitList.forEach(unit => {
        //Check if a unit is within the box
        if (Math.min(rectStartX, camera.mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX, camera.mouseX) && Math.min(rectStartY, camera.mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY, camera.mouseY)) {
            unit.selectUnit()
        }
    })
    dragged = false
    boxCreated = false
}

function mouseDragged() {
    if (mouseButton === CENTER || (mouseButton === LEFT && keyIsDown(CONTROL))) {
        camera.position.set((offset.x + mouseOffset.x - mouseX), (offset.y + mouseOffset.y - mouseY))
        console.log({ cx: camera.position.x, cy: camera.position.y, mouseX, mouseY, mx: mouseOffset.x, my: mouseOffset.y })
        return
    }
    else if (mouseButton !== LEFT) return;
    dragged = true
}

function mouseWheel(e) {
    camera.zoom *= e.delta > 0 ? 1.05 : 0.95;
}
