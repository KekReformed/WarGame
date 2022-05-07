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
    return Math.sqrt((v1.x - v2.x)**2 + (v1.y - v2.y)**2)
}

class Sprite {
    constructor(x, y, width, height, userData,  layer = 0, anchor = Anchor.top, image, velocity) {
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
        unit.sprite.collisions = []
        unit.sprite.isColliding = false
    }

    draw() {    
        this.update()
        let mouse = rotateVector(p.mouseX, p.mouseY, -this.rad, this.position)
        p.stroke(255)
        p.line(this.position.x, this.position.y, mouse.x, mouse.y)
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

        console.log("i exist")
        // console.log(this, sp)
        let w = this.width / 2, h = this.height / 2,
            spw = sp.width / 2, sph = sp.height / 2
        // i had to do this because jack wanted centered anchors for shit
        let pos = [p.createVector(this.position.x - w, this.position.y - h), p.createVector(this.position.x + w, this.position.y - h), p.createVector(this.position.x + w, this.position.y + h), p.createVector(this.position.x - w, this.position.y + h)]
        let spos = [p.createVector(sp.position.x - spw, sp.position.y - sph), p.createVector(sp.position.x + spw, sp.position.y - sph), p.createVector(sp.position.x + spw, sp.position.y + sph), p.createVector(sp.position.x - spw, sp.position.y + sph)]
        if (distance(this.position, sp.position) < (Math.min(w, h) + Math.min(spw, sph))/100) return this.addCollision(sp) // check if the smallest possible distance between them has been crossed
        
        let dx = sp.position.x - this.position.x // distance between their mid-sections
        let dy = sp.position.y - this.position.y
        
        let dxcol = false, dycol = false;
        if (dx > 0) { // checking which one is further from (0,y)
            //sp right -    since sp is on the right the vectors we need to worry about are only the vectors to it's left
            // this left -  since this is on the left the vectors we need to worry about are only the vectors to it's right
            console.log("sp right - this left")
            for (let i = 0; i < 4; i++) { // looping through the vectors for the spos / sp
                let spoints = []
                let points = []
                let spoint, point;
                if (spos[i].x < sp.position.x) { // if the vector is to the left of sp which is on the right then this vector concerns us
                    spoints.push(spos[i])
                    if (spoints.length > 1) {
                        spoint = spoints[0] > spoints[1] ? spoints[0] : spoints[1]
                    }
                }
                if (pos[i].x > this.position) {
                    points.push(pos[i])
                    if (points.length > 1) {
                        point = points[0] > points[1] ? points[0] : points[1]
                    }
                }
                if(!spoint) spoint = spoints[0]
                if(!point) point = points[0]
                if(spoint - point >= dx) dxcol = true;
            }
        } else if (dx < 0) {
            console.log("sp left - this right")
             //sp left -    since sp is on the left the vectors we need to worry about are only the vectors to it's right
            // this right -  since this is on the right the vectors we need to worry about are only the vectors to it's left
            for (let i = 0; i < 4; i++) { // looping through the vectors for the spos / sp
                let spoints = []
                let points = []
                let spoint, point;
                if (spos[i].x > sp.position.x) { // if the vector is to the right of sp which is on the left then this vector concerns us
                    spoints.push(spos[i])
                    if (spoints.length > 1) {
                        spoint = spoints[0] > spoints[1] ? spoints[0] : spoints[1]
                    }
                }
                if (pos[i].x < this.position.x) {
                    points.push(pos[i])
                    if (points.length > 1) {
                        point = points[0] > points[1] ? points[0] : points[1]
                    }
                }
                if(!spoint) spoint = spoints[0]
                if(!point) point = points[0]
                if(point - spoint >= dx) dxcol = true;
            }
        }
        if (dy > 0) { // checking which one is further from (0,y)
            console.log("sp above - this below")
            // sp above
            // this below 
            for (let i = 0; i < 4; i++) { // looping through the vectors for the spos / sp
                let spoints = []
                let points = []
                let spoint, point;
                if (spos[i].y > sp.position.y) { // if the vector is below sp which is at the top then this vector concerns us
                    spoints.push(spos[i])
                    if (spoints.length > 1) {
                        spoint = spoints[0] > spoints[1] ? spoints[0] : spoints[1]
                    }
                }
                if (pos[i].y < this.position.y) {
                    points.push(pos[i])
                    if (points.length > 1) {
                        point = points[0] > points[1] ? points[0] : points[1]
                    }
                }
                console.log(spoints, points)
                if(!spoint) spoint = spoints[0]
                if(!point) point = points[0]
                if(point - spoint >= dy) dycol = true;
            }
        } else if (dy < 0) {
            console.log("sp below - this above")
            // sp below
            // this above 
            for (let i = 0; i < 4; i++) { // looping through the vectors for the spos / sp
                let spoints = []
                let points = []
                let spoint, point;
                if (spos[i].y < sp.position.y) { // if the vector is above sp which is at the bottom then this vector concerns us
                    spoints.push(spos[i])
                    if (spoints.length > 1) {
                        spoint = spoints[0] > spoints[1] ? spoints[0] : spoints[1]
                    }
                }
                if (pos[i].y > this.position.y) {
                    points.push(pos[i])
                    if (points.length > 1) {
                        point = points[0] > points[1] ? points[0] : points[1]
                    }
                }
                if(!spoint) spoint = spoints[0]
                if(!point) point = points[0]
                if(spoint - point >= dy) dycol = true;
            }
        }
        console.log(dxcol, dycol)
        if(dycol && dxcol) return this.addCollision(sp)
    }

    addCollision(sp) {
        this.isColliding = true;
        this.collisions.push(sp)
        return true
    }
}

module.exports.drawSprites = () => {
    allSprites.layered.forEach(layer => {
        layer.forEach(sprite => {
            sprite.draw()
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