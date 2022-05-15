import { p } from "./sketch"
//private
let offsetX = 0;
//private
let offsetY = 0;

// let anchorX = 0;
// let anchorY = 0;

export function rotateVector(x: number, y: number, rad: number, org: {x:number, y:number}) {
    const rotatedX = (x - org.x) * Math.cos(rad) - (y - org.y) * Math.sin(rad)
    const rotatedY = (x - org.x) * Math.sin(rad) + (y - org.y) * Math.cos(rad)
    return p.createVector(org.x + rotatedX, org.y + rotatedY)
}

export function setOffset(ox: number, oy: number) {
    offsetX += -ox;
    offsetY += -oy;
}

export function worldToScreen(wx: number, wy: number) {
    return {x: wx-offsetX, y: wy-offsetY}
}

export function screenToWorld(sx: number, sy: number) {
    return {x: sx+offsetX, y: sy+offsetY}
}

// export function normalizeVector(x: number, y: number) {
//     const n = distance(p.createVector(x, y), p.createVector(0, 0))
//     return {x: x/n, y: y/n}
// }

// export function distance(v1: Vector, v2: Vector) {
//     return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
// }