p5 = require('p5')
require('../node_modules/p5.play/lib/p5.play.js')
Unit = require('./unit.js')

let unitList = []
let boxCreated = false
let dragged = false
let rectStartX = 0
let rectStartY = 0

setup = () => {
    canvas = createCanvas(window.outerWidth, window.outerHeight);
    console.log(canvas)
    jeff = new Unit(50,50,0,100,40,300,200,unitList)
    dave = new Unit(50,50,0,100,40,200,200,unitList)
    derek = new Unit(50,50,0,100,40,400,200,unitList)
    john = new Unit(50,50,0,100,40,100,200,unitList)
}

draw = () => {
    frameRate(60)
    background(10, 10, 10);

    unitList.forEach(unit => {
        unit.updateUnit()
    })

    drawSprites();
    
    if (dragged === true) {
        stroke("#03e3fc")
        noFill()
        box = rect(rectStartX, rectStartY, mouseX - rectStartX, mouseY - rectStartY)
    }
}

mousePressed = () => {
    if (mouseButton == LEFT) {
        rectStartX = mouseX
        rectStartY = mouseY

        unitList.forEach(unit => {
            if (unit.sprite.mouseIsOver) {
                unit.selectUnit()
            }
            else {
                unit.deselectUnit()
            }
        })
    }
}

mouseReleased = () => {
    if (mouseButton !== LEFT) return;
    unitList.forEach(unit => {
        //Check if a unit is within the box
        if (Math.min(rectStartX,mouseX) < unit.sprite.position.x && unit.sprite.position.x < Math.max(rectStartX,mouseX) && Math.min(rectStartY,mouseY) < unit.sprite.position.y && unit.sprite.position.y < Math.max(rectStartY,mouseY)){
            unit.selectUnit()
        }
    })
    dragged = false
    boxCreated = false
}

mouseDragged = () => {
    if (mouseButton !== LEFT) return;
    dragged = true
}