import p5, { Image, Vector } from 'p5'
import { p } from './sketch'
import { specificScaleOf, worldToScreen } from './Util'
import { QuadTree, Rectangle, Point } from './QuadTree'

let qt: QuadTree;

export enum Anchor {
    top,
    right,
    bottom,
    left
}

interface Scene {
    layered: Sprite[][]
    sprites: Sprite[]
}

let allSprites: Scene = {
    layered: [[]],
    sprites: []
}

function rotateVector(x: number, y: number, rad: number, org: { x: number, y: number }) {
    const rotatedX = (x - org.x) * Math.cos(rad) - (y - org.y) * Math.sin(rad)
    const rotatedY = (x - org.x) * Math.sin(rad) + (y - org.y) * Math.cos(rad)
    return p.createVector(org.x + rotatedX, org.y + rotatedY)
}

function normalizeVector(x: number, y: number) {
    const n = distance(p.createVector(x, y), p.createVector(0, 0))
    return { x: x / n, y: y / n }
}

function distance(v1: Vector, v2: Vector) {
    return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
}

export class Sprite {
    position: Vector
    height: number
    width: number
    layer: number
    anchor: Anchor
    userData: any
    color: string
    isColliding: boolean
    velocityRotate: boolean
    rad: number
    id: number
    collisions: Sprite[]
    image?: Image
    velocity?: Vector
    scaled: { w: number, h: number }

    constructor(x: number, y: number, width: number, height: number, userData?: any, layer = 0, anchor = Anchor.top, image?: Image, velocity?: Vector) {
        this.position = p.createVector(x, y)
        this.velocity = velocity || p.createVector(0, 0)
        this.height = height
        this.width = width
        this.scaled = { w: width, h: height }
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

        let pos = worldToScreen(this.position.x, this.position.y)
        let mouse = rotateVector(p.mouseX, p.mouseY, -this.rad, { x: pos.x, y: pos.y })
        if (
            mouse.x <= pos.x + (this.scaled.w / 2) &&
            mouse.x >= pos.x - (this.scaled.w / 2) &&
            mouse.y <= pos.y + (this.scaled.h / 2) &&
            mouse.y >= pos.y - (this.scaled.h / 2)
        ) {
            return true
        }
        return false
    }

    update() {
        let temp = specificScaleOf(this.width, this.height);
        this.scaled.w = temp.w;
        this.scaled.h = temp.h;
        this.position.set(this.position.x + this.velocity.x, this.position.y + this.velocity.y);

        const others = qt.search(new Rectangle(this.position.x, this.position.y, this.width * 2, this.height * 2))

        // reduced sample size
        if (others.length) for (let point of others) {
            this.collisionDetection(point.sprite)
        }
        else this.resetCollisions()
    }

    draw() {
        this.update()
        // let mouse = rotateVector(p.mouseX, p.mouseY, -this.rad, this.position)
        // p.stroke(255)
        // p.line(this.position.x, this.position.y, mouse.x, mouse.y)
        let pos = worldToScreen(this.position.x, this.position.y)
        p.translate(pos.x, pos.y)
        p.rotate(this.rad)
        p.translate(-pos.x, -pos.y)
        p.fill(this.color)
        p.rect(pos.x - (this.scaled.w / 2), pos.y - (this.scaled.h / 2), pos.x + (this.scaled.w / 2), pos.y + (this.scaled.h / 2))
        p.translate(pos.x, pos.y)
        p.rotate(-this.rad)
        p.translate(-pos.x, -pos.y)
    }

    rotate(deg: number) {
        this.rad = (deg * Math.PI) / 180
    }

    setVelocity(x: number, y: number) {
        this.velocity.set(x, y)
        if (this.velocityRotate) this.rad = p.atan2(y, x) || 0;
    }

    remove() {
        allSprites.layered[this.layer] = allSprites.layered[this.layer].filter((x) => { if (x.id !== this.id) return x })
        delete allSprites.sprites[this.id - 1];
    }

    overlap(sp: Sprite) {
        if (!this.isColliding) return false;
        for (let i = 0; i < this.collisions.length; i++) {
            if (this.collisions[i].id === sp.id) return true;
        }
        return false;
    }

    collisionDetection(sp: Sprite) {

        if (this.id === sp.id) return;

        let w = this.width / 2, h = this.height / 2, spw = sp.width / 2, sph = sp.height / 2;

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
            let scalars: [number[], number[]] = [[], []]; // projection array   
            let axis = axes[i]; // axis to project to
            // projecting
            for (let j = 0; j < 8; j++) {
                let vec = vecs[j]
                let c = (vec.x * axis.x + vec.y * axis.y) / axis.x ** 2 + axis.y ** 2 // 90 deg projection
                scalars[p.round(j / 7)].push(c * (axis.x ** 2) + c * (axis.y ** 2))
            }
            if (p.min(scalars[1]) >= p.max(scalars[0]) || p.max(scalars[1]) <= p.min(scalars[0])) return collision = false
        }
        if (collision) this.addCollision(sp)
        else {
            console.log("no")
            this.collisions = this.collisions.filter((x) => { if (x.id !== sp.id) return x })
            this.isColliding = !!this.collisions
            sp.collisions = sp.collisions.filter((x) => { if (x.id !== this.id) return x })
            sp.isColliding = !!sp.collisions
        }
    }

    addCollision(sp: Sprite) {
        if (this.collisions.filter(x => x.id == sp.id).length || sp.collisions.filter(x => x.id == this.id).length) return;
        // if(this.collisions.filter((x) => { if (x.id !== sp.id) return x }).length || sp.collisions.filter((x) => { if (x.id !== this.id) return x }).length) return console.log(false);
        this.isColliding = true;
        this.collisions.push(sp)
        sp.isColliding = true;
        sp.collisions.push(this)
        return true
    }

    resetCollisions() {
        this.collisions = []
        this.isColliding = false
    }
}

export const drawSprites = () => {

    qt = new QuadTree(new Rectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2))

    allSprites.sprites.forEach(sprite => { // change from foreach
        qt.add(new Point(sprite.position.x, sprite.position.y, sprite))
    })

    
    allSprites.layered.forEach(layer => { // change from foreach
        layer.forEach(sprite => {
            sprite.draw()
        })
    })

    qt = null
}

export const updateSprites = () => { // change from foreach
    allSprites.layered.forEach(layer => {
        layer.forEach(sprite => {
            sprite.update()
        })
    })
}

export const initalize = () => {
    p.rectMode(p.CORNERS)
}