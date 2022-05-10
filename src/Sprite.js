const { QuadTree, initalizeQuadTree, Rectangle, Point } = require('./QuadTree')

Anchor = {
    top: 0,
    right: 1,
    bottom: 2,
    left: 3
}

let allSprites = {}
let p = undefined
let allCollisions = []
let allDomainOverlaps = []

function rotateVector(x, y, rad, org = p.createVector(0, 0)) {
    const rotatedX = (x - org.x) * Math.cos(rad) - (y - org.y) * Math.sin(rad)
    const rotatedY = (x - org.x) * Math.sin(rad) + (y - org.y) * Math.cos(rad)
    return p.createVector(org.x + rotatedX, org.y + rotatedY)
}

function distance(v1, v2) {
    return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
}

class Sprite {
    constructor(x, y, width, height, userData, layer = 0, anchor = Anchor.top, image, velocity) {
        this.position = p.createVector(x, y)
        this.velocity = velocity || p.createVector(0, 0)
        this.height = height
        this.width = width
        this.layer = layer
        this.anchor = anchor
        this.image = image
        this.userData = userData
        this.color = "#000000"
        this.isColliding = false
        this.velocityRotate = true
        this.rad = 0
        this.id = allSprites.sprites.length + 1
        this.collisions = []
        allSprites.layered[layer].push(this)
        allSprites.sprites.push(this)
    }

    isMouseOver() {
        let mouse = rotateVector(p.mouseX, p.mouseY, -this.rad, this.position)
        if (
            mouse.x <= this.position.x + (this.width / 2) &&
            mouse.x >= this.position.x - (this.width / 2) &&
            mouse.y <= this.position.y + (this.height / 2) &&
            mouse.y >= this.position.y - (this.height / 2)
        ) {
            // console.log("mouseOver "+this.id)
            return true
        }
        return false
    }

    update() {
        this.position.set(this.position.x + this.velocity.x, this.position.y + this.velocity.y);
        this.collisions = []
        this.isColliding = false
    }

    draw() {
        this.update()
        // let mouse = rotateVector(p.mouseX, p.mouseY, -this.rad, this.position)
        // p.stroke(255)
        // p.line(this.position.x, this.position.y, mouse.x, mouse.y)
        p.translate(this.position.x, this.position.y)
        p.rotate(this.rad)
        p.translate(-this.position.x, -this.position.y)
        p.fill(this.color)
        p.rect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.position.x + (this.width / 2), this.position.y + (this.height / 2))
        p.translate(this.position.x, this.position.y)
        p.rotate(-this.rad)
        p.translate(-this.position.x, -this.position.y)
    }

    rotate(deg) {
        this.rad = (deg * Math.PI) / 180
    }

    setVelocity(x, y) {
        this.velocity.set(x, y)
    }

    collisionDetection(sp) {
        if (this.collisions.includes(sp)) return;

        let w = this.width/2, h = this.height/2, spw = sp.width/2, sph = sp.height/2;

        let pos = [
            rotateVector(this.position.x - w, this.position.y - h, this.rad, { x: this.position.x, y: this.position.y }),
            rotateVector(this.position.x + w, this.position.y - h, this.rad, { x: this.position.x, y: this.position.y }),
            rotateVector(this.position.x + w, this.position.y + h, this.rad, { x: this.position.x, y: this.position.y }),
            rotateVector(this.position.x - w, this.position.y + h, this.rad, { x: this.position.x, y: this.position.y })
        ]
        let spos = [
            rotateVector(sp.position.x - spw, sp.position.y - sph, sp.rad, { x: sp.position.x, y: sp.position.y }),
            rotateVector(sp.position.x + spw, sp.position.y - sph, sp.rad, { x: sp.position.x, y: sp.position.y }),
            rotateVector(sp.position.x + spw, sp.position.y + sph, sp.rad, { x: sp.position.x, y: sp.position.y }),
            rotateVector(sp.position.x - spw, sp.position.y + sph, sp.rad, { x: sp.position.x, y: sp.position.y })
        ]

        let vecs = [...pos, ...spos];
        let collision = true;

        // axis
        let axes = [
            { x: pos[1].x - pos[0].x, y: pos[1].y - pos[0].y },
            { x: pos[1].x - pos[2].x, y: pos[1].y - pos[2].y },
            { x: spos[0].x - spos[3].x, y: spos[0].y - spos[3].y },
            { x: spos[0].x - spos[1].x, y: spos[0].y - spos[1].y },
        ]
        for (let i = 0; i < 4; i++) {
            let scalars = [[],[]]; // projection array   
            let axis = axes[i]; // axis to project to
            // projecting
            for(let j = 0; j < 8; j++) {
                let vec = vecs[j]
                let c = (vec.x * axis.x + vec.y * axis.y) / axis.x**2 + axis.y**2 // 90 deg projection
                scalars[p.round(j/7)].push({x: c*(axis.x**2), y: c*(axis.y**2)})
            }
            if(Math.min(scalars[1]) >= Math.max(scalars[0] || Math.max(scalars[1]) <= Math.min(scalars[0]))) return collision = false
        }
        if(collision) this.addCollision(sp)
    }

    addCollision(sp) {
        console.log("collision")
        this.color = "#ffffff"
        sp.color = "#fffffff"
        this.isColliding = true;
        this.collisions.push(sp)
        return true
    }
}

module.exports.drawSprites = () => {
    allSprites.layered.forEach(layer => { // change from foreach
        layer.forEach(sprite => {
            sprite.draw()
        })
    })
}

module.exports.updateSprites = () => { // change from foreach
    allSprites.layered.forEach(layer => {
        layer.forEach(sprite => {
            sprite.update()
        })
    })
}

module.exports.Sprite = Sprite
module.exports.Anchor = Anchor

module.exports.initalize = (pInst) => {
    p = pInst
    p.rectMode(p.CORNERS)
    allSprites["layered"] = [[]]
    allSprites["sprites"] = []
    initalizeQuadTree(4)
}