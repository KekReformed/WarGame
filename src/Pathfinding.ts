import { Color } from "p5";
import { p } from "./sketch";
export const nodeSize = 25
const boxSize = 10
export const nodes: node[][] = [[]]

interface node {
    x: number
    y: number
    xIndex: number
    yIndex: number
    gCost: number
    hCost: number
    fCost: number
    explored: boolean
    adjacent: boolean
    blocked: boolean
}

class Pathfinding {

    constructor() {

    }

    generateNodes() {
        let yCounter = 0
        for (let y = 0; y < window.outerHeight; y += nodeSize) {
            nodes[yCounter] = []
            let xCounter = 0
            for (let x = 0; x < window.outerWidth; x += nodeSize) {
                let colour = p.color(255, 255, 255)
                let node: node = {
                    x,
                    y,
                    xIndex: xCounter,
                    yIndex: yCounter,
                    gCost: Infinity,
                    hCost: Infinity,
                    fCost: Infinity,
                    explored: false,
                    adjacent: false,
                    blocked: false,
                }
                console.log(node)
                nodes[yCounter][xCounter] = node
                xCounter += 1
            }
            yCounter += 1
            console.log(nodes)
        }
        nodes[10][2].blocked = true
        nodes[10][3].blocked = true
        nodes[10][4].blocked = true
        nodes[10][5].blocked = true
        nodes[10][6].blocked = true
        nodes[10][7].blocked = true
    }

    findBestPath(startXIndex: number, startYIndex: number, endXIndex: number, endYIndex: number) {
        let currentNode: node = nodes[startYIndex][startXIndex]
        let bestPath: node[] = []
        let availableNodes: node[] = this.exploreSurroundingNode(currentNode, startXIndex, startYIndex, endXIndex, endYIndex)

        console.log(currentNode.xIndex,currentNode.yIndex,endXIndex,endYIndex) 
        
        while ((currentNode.xIndex !== endXIndex) || (currentNode.yIndex !== endYIndex)) { 
            availableNodes = availableNodes.concat(this.exploreSurroundingNode(currentNode, startXIndex, startYIndex, endXIndex, endYIndex))
            console.log(availableNodes)
            let bestFCost = Infinity

            for (const i in availableNodes) {
                let node = availableNodes[i]

                if (node.explored) continue

                if (node.fCost < bestFCost) {
                    currentNode = node
                    bestFCost = node.fCost
                }

                if (node.fCost === bestFCost) {
                    if (currentNode.hCost > node.hCost) {
                        currentNode = node
                    }
                }
            }

            currentNode.explored = true
            console.log(currentNode.xIndex,currentNode.yIndex,endXIndex,endYIndex) 
        }

        console.log(currentNode.xIndex !== endXIndex && currentNode.yIndex !== endYIndex)
        return bestPath
    }

    exploreSurroundingNode(originNode: node, startXIndex: number, startYIndex: number, endXIndex: number, endYIndex: number) {
        let neighbouringNodes = [
            nodes[originNode.yIndex + 1][originNode.xIndex],
            nodes[originNode.yIndex - 1][originNode.xIndex],
            nodes[originNode.yIndex][originNode.xIndex + 1],
            nodes[originNode.yIndex][originNode.xIndex - 1],
            nodes[originNode.yIndex + 1][originNode.xIndex + 1],
            nodes[originNode.yIndex - 1][originNode.xIndex - 1],
            nodes[originNode.yIndex - 1][originNode.xIndex + 1],
            nodes[originNode.yIndex + 1][originNode.xIndex - 1]
        ]

        for (const i in neighbouringNodes) {
            let node = neighbouringNodes[i]

            if (node.blocked || node.explored) {
                neighbouringNodes.splice(Number(i), 1);
                continue
            }

            let gCost = Math.floor(Math.sqrt(Math.abs(node.xIndex - startXIndex) ** 2 + Math.abs(node.yIndex - startYIndex) ** 2) * 10)
            let hCost = Math.floor(Math.sqrt(Math.abs(node.xIndex - endXIndex) ** 2 + Math.abs(node.yIndex - endYIndex) ** 2) * 10)
            let fCost = gCost + hCost
            node.gCost > gCost ? node.gCost = gCost : gCost
            node.hCost > hCost ? node.hCost = hCost : hCost
            node.fCost > fCost ? node.fCost = fCost : fCost
            node.adjacent = true
        }

        return neighbouringNodes
    }

    debug() {
        for (const y in nodes) {
            let nodeRows = nodes[y]
            for (const x in nodeRows) {
                let node = nodeRows[x]
                if (node.explored) {
                    p.fill(0, 0, 255)
                }
                else if (node.adjacent) {
                    p.fill(0, 255, 0)
                }
                else if (node.blocked) {
                    p.fill(255, 0, 0)
                }
                else {
                    p.fill(255, 255, 255)
                }
                p.rect(node.x - boxSize, node.y - boxSize, node.x + boxSize, node.y + boxSize)
                p.textSize(12)
                p.textAlign(p.CENTER)
                p.fill(0, 0, 0)
                p.noStroke()
                p.text(`${node.gCost},${node.hCost},${node.fCost}`, node.x, node.y)
            }
        }
    }
}

// let bestNodes: node[] = []
// let bestHCost = Infinity
// availableNodes = availableNodes.concat(this.exploreSurroundingNode(currentNode, startXIndex, startYIndex, endXIndex, endYIndex))
// console.log(availableNodes)

// for (const i in availableNodes) {
//     let node = availableNodes[i]
//     if (node.bestNode) continue;

//     node.explored = true
//     if (node.fCost <= bestFCost) {
//         bestFCost = node.fCost
//         bestNodes.push(node)
//     }
// }

// for (const i in bestNodes) {
//     let node = bestNodes[i]
//     console.log(bestNodes.length)

//     node.explored = true
//     if (node.hCost <= bestHCost) {
//         bestHCost = node.hCost
//         currentNode = node
//         currentNode.explored = true
//     }
// }

// currentNode.bestNode = true
// if (currentNode.xIndex === endXIndex && currentNode.yIndex === endYIndex) break;

export default Pathfinding