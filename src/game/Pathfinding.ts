import { p } from "./sketch";
export const nodeSize = 50
const boxSize = 20
export const nodes: node[][] = [[]]

export interface node {
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
    cameFrom?: node
    direction?: number
}

export const generateNodes = () => {
    let yCounter = 0

    for (let y = 0; y < window.outerHeight; y += nodeSize) {
        nodes[yCounter] = []
        let xCounter = 0
        for (let x = 0; x < window.outerWidth; x += nodeSize) {

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
}

export const findBestPath = (startXIndex: number, startYIndex: number, endXIndex: number, endYIndex: number) => {
    let currentNode: node = nodes[startYIndex][startXIndex]
    let bestPath: node[] = []
    let nodeList = structuredClone(nodes)
    let availableNodes: node[] = exploreSurroundingNode(currentNode, nodeList, startXIndex, startYIndex, endXIndex, endYIndex)

    console.log(currentNode.xIndex, currentNode.yIndex, endXIndex, endYIndex)

    while ((currentNode.xIndex !== endXIndex) || (currentNode.yIndex !== endYIndex)) {
        let surroundingNodes = exploreSurroundingNode(currentNode, nodeList, startXIndex, startYIndex, endXIndex, endYIndex)

        //Check to make sure that we havn't already explored that node
        for (const i in surroundingNodes) {
            let exploredNode = surroundingNodes[i]

            for (const n in availableNodes) {
                let node = availableNodes[n]

                if ((exploredNode.yIndex === node.yIndex && exploredNode.xIndex === node.xIndex)) {
                    surroundingNodes.splice(Number(i), 1)
                }
            }

            availableNodes.push(exploredNode)
        }

        let bestFCost = Infinity
        let bestHCost
        let oldBestFCost = bestFCost

        for (const i in availableNodes) {
            let node = availableNodes[i]

            if (node.explored) {
                continue
            }

            if (node.fCost < bestFCost) {
                currentNode = node
                bestFCost = node.fCost
            }

            if (node.fCost === bestFCost) {
                if (currentNode.hCost > node.hCost) {
                    currentNode = node
                    bestHCost = node.hCost
                }
            }
        }
        console.log(bestFCost, bestHCost)

        if (bestFCost === oldBestFCost) break;

        currentNode.explored = true
    }

    while ((currentNode.xIndex !== startXIndex) || (currentNode.yIndex !== startYIndex)) {
        bestPath.push((currentNode))
        currentNode = currentNode.cameFrom
    }

    console.log(bestPath)
    return bestPath.reverse()
}

export const exploreSurroundingNode = (originNode: node, nodes: node[][], startXIndex: number, startYIndex: number, endXIndex: number, endYIndex: number) => {
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

        if (node.blocked || node.explored) continue;

        let gCost = Math.floor(Math.sqrt(Math.abs(node.xIndex - startXIndex) ** 2 + Math.abs(node.yIndex - startYIndex) ** 2) * 10)
        let hCost = Math.floor(Math.sqrt(Math.abs(node.xIndex - endXIndex) ** 2 + Math.abs(node.yIndex - endYIndex) ** 2) * 10)
        let fCost = gCost + hCost

        if (node.gCost > gCost) {
            node.gCost = gCost
            node.cameFrom = originNode
        }

        if (node.hCost > hCost) {
            node.hCost = hCost
            node.cameFrom = originNode
        }

        if (node.fCost > fCost) {
            node.fCost = fCost
            node.cameFrom = originNode
        }

        node.adjacent = true
    }

    return neighbouringNodes
}

export const debug = () => {
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

            if (node.cameFrom) {
                p.fill(0, 0, 100)
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
