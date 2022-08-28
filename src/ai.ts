import {isTerminal, addPieceNoCopy, possiblePlayCount} from './game'
import {max} from './utilities'

export class GameNode {
    won: number
    total: number
    move: number
    parent: GameNode | null
    children: GameNode[]
    fullyExpanded: boolean

    constructor(parent: GameNode | null, move: number, ) {
        this.parent = parent
        this.move = move
        this.children = []
        this.won = 0
        this.total = 0
        this.fullyExpanded = false
    }

    printChildren(level: number = 0) {
        console.log("   ".repeat(level) + `${this.move}: ${this.won}/${this.total}`)
        for (let child of this.children) {
            child.printChildren(level + 1)
        }
    }
}

export class Tree {
    root: GameNode
    grid: number[][]
    player: number

    constructor(root: GameNode, grid: number[][], player: number) {
        this.root = root
        this.grid = grid
        this.player = player
    }

    select(): [GameNode, number[][], number] {
        let cells = this.grid.map((arr) => arr.slice())
        // console.log(cells.map((arr) => arr.slice()))
        let node = this.root
        let player = this.player
        while (node.children.length == possiblePlayCount(cells) && node.children.length != 0) {
            node = max(node.children, (child: GameNode) => UCB1(node, child, player));
            // console.log(node.move)
            addPieceNoCopy(cells, node.move, player)
            player = player == 1 ? 2 : 1
        }
        let play = getRandomPlay(cells, node.children.map(c => c.move))
        // console.log(cells.map((arr) => arr.slice()))
        let [,, row] = addPieceNoCopy(cells, play, player);
        // console.log(cells.map((arr) => arr.slice()))

        if (isTerminal(cells, row, play) == -1) {
            node.children.push(new GameNode(node, play))
            player = player == 1 ? 2 : 1
        } else {
            return [node, cells, player]
        }
        
        return [node.children[node.children.length - 1], cells, player]
    }

    playout(cells: number[][], player: number): number {
        let state = -1
        while (state == -1) {
            let column = getRandomPlay(cells)
            let [,,row] = addPieceNoCopy(cells, column, player)
            player = player == 2 ? 1 : 2
            state = isTerminal(cells, row, column)
        }
        // assume computer is player 2
        return state == 0 ? 0.3 : (state == 2 ? 1 : 0)
    }

    backPropagate(node: GameNode, utility: number) {
        let currentNode: GameNode | null = node;
        while (currentNode != this.root && currentNode) {
            currentNode.won += utility
            currentNode.total += 1
            currentNode = currentNode.parent
        }
    }

    update() {
        let [leafNode, grid, player] = this.select()
        let utility = this.playout(grid, player)
        this.backPropagate(leafNode, utility)
    }
}

function UCB1(parentNode: GameNode, node: GameNode, player: number){
    let utility = player == 2 ? node.won / node.total : 1 - node.won / node.total
    
    if (parentNode.total != 0) {
        utility += 2**0.5 * (Math.log10(parentNode.total)/node.total)**0.5
    }

    if (node.total == 0) {
        utility = 0
    }
    // console.log(`${node.move} ${parentNode.move} ${utility}`)
    return utility
}

function getRandomPlay(grid: number[][], blacklist: number[] = []): number {
    let plays = []
    for (let col = 0; col < grid[0].length; col++) {
        if (!grid[0][col] && !blacklist.includes(col)) {
            plays.push(col)
        }
    }
    let play = plays[getRandomInt(plays.length - 1)]
    // console.log(plays, plays.length, play)o
    return play 
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

// export function heuristc(grid: number[][], row: number, column: number) {
//   let directions: number[][] = [[1, 0], [0, 1], [1, 1], [-1, 1]]
//   let states: number[][] = []
//   for (let [diri, direction] of directions.entries()) {
//     states.push([])
//     for (let i = -4; i < 4; i++) {
//       let currentRow = row + i * direction[0]
//       let currentColumn = column + i * direction[1]
//       if (currentRow >= 0 && currentRow < ROWS && currentColumn >= 0 && currentColumn < COLS) {
//         states[diri].push(grid[currentRow][currentColumn])
//       }
//     }
//   }
//   for (let direction of states) {
//    let consec = 0;
//    let prev = 0;
//    for (let value of direction) {
//     if ((value == 1 || value == 2) && value == prev) {
//       consec++
//     } else if (value != prev) {
//       consec = 0;
//     }
//     if (consec == 3) {
//       return value
//     }
//     prev = value;
//    } 
//   }
//   for (let col = 0; col < COLS; col++) {
//     if (grid[0][col] == 0) {
//       return -1
//     }
//   }
//   return 0
// }