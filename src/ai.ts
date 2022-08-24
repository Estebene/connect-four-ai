import {isTerminal, addPieceNoCopy, possiblePlayCount} from './game'

class GameNode {
    won: number
    total: number
    move: number
    parent: GameNode
    children: GameNode[]
    fullyExpanded: boolean

    constructor(parent: GameNode, move: number, ) {
        this.parent = parent
        this.move = move
        this.children = []
        this.won = 0
        this.total = 0
        this.fullyExpanded = false
    }
}

class Tree {
    root: GameNode
    grid: number[][]
    player: number

    constructor(root: GameNode, grid: number[][], player: number) {
        this.root = root
        this.grid = grid
        this.player = player
    }

    select(): GameNode {
        let cells = this.grid.map((arr) => arr.slice())
        let node = this.root
        let player = this.player
        while (node.children.length == possiblePlayCount(cells) || node.children.length != 0) {
            node = max(node.children, (child: GameNode) => UCB1(node, child));
            addPieceNoCopy(cells, node.move, player)
            player = player == 1 ? 2 : 1
        }
        let play = getRandomPlay(this.grid, node.children.map(c => c.move))
        let [_, __, row] = addPieceNoCopy(cells, play, player);

        if (isTerminal(cells, row, play) == -1) {
            node.children.push(new GameNode(node, play))
        } else {
            return node
        }
        
        return node.children[node.children.length - 1]
    }
}

function max(arr: any[], func: Function = (entry: any) => entry) {
    let maxValue = arr[0];
    let maxIndex = 0;
    for (let i = 1; i < arr.length; i++) {
        let newValue = func(arr[i])
       if (newValue > maxValue) {
        maxValue = newValue
        maxIndex = i
       } 
    }
    return arr[maxIndex]
}

function UCB1(parentNode: GameNode, node: GameNode){
    return node.won / node.total + 2**0.5 * (Math.log10(parentNode.total)/node.total)
}

function getRandomPlay(grid: number[][], blacklist: number[]): number {
    let plays = []
    for (let col = 0; col < grid[0].length; col++) {
        if (!grid[0][col] && !blacklist.includes(col)) {
            plays.push(col)
        }
    }
    return plays[getRandomInt(plays.length - 1)]
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}