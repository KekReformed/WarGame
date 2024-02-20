import { p } from "./sketch"
//private
let offsetX = 0;
//private
let offsetY = 0;
//private
let scaleX = 1;
//private
let scaleY = 1;
// let anchorX = 0;
// let anchorY = 0;

export function rotateVector(x: number, y: number, rad: number, org: { x: number, y: number }) {
    const rotatedX = (x - org.x) * Math.cos(rad) - (y - org.y) * Math.sin(rad)
    const rotatedY = (x - org.x) * Math.sin(rad) + (y - org.y) * Math.cos(rad)
    return p.createVector(org.x + rotatedX, org.y + rotatedY)
}

export function setOffset(ox: number, oy: number) {
    offsetX += -ox / scaleX;
    offsetY += -oy / scaleY;
}

export function scaleBy(delta: number) {
    let preScale = screenToWorld(p.mouseX, p.mouseY)
    scaleX *= delta
    scaleY *= delta
    let postScale = screenToWorld(p.mouseX, p.mouseY)

    offsetX += preScale.x - postScale.x
    offsetY += preScale.y - postScale.y
}

export function specificScaleOf(w: number, h: number) {
    return { w: w * scaleX, h: h * scaleY }
}

export function specificScaleOfRadius(r: number) {
    return r * scaleX
}

export function worldToScreen(wx: number, wy: number) {
    return { x: (wx - offsetX) * scaleX, y: (wy - offsetY) * scaleY }
}

export function screenToWorld(sx: number, sy: number) {
    return { x: (sx / scaleX + offsetX), y: (sy / scaleX + offsetY) }
}

// export function normalizeVector(x: number, y: number) {
//     const n = distance(p.createVector(x, y), p.createVector(0, 0))
//     return {x: x/n, y: y/n}
// }

// export function distance(v1: Vector, v2: Vector) {
//     return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
// }

/** Random function I found on Stackoverflow that brightens or darkens a hex colour, feel free to change/improve */
export function shadeColor(color: string, percent: number) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = R * (100 + percent) / 100;
    G = G * (100 + percent) / 100;
    B = B * (100 + percent) / 100;

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}