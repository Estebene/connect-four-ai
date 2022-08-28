import {Tree, GameNode} from './ai'
import {max} from './utilities'

const ROWS = 6
const COLS = 7

export function isTerminal(grid: number[][], row: number, column: number) {
  let directions: number[][] = [[1, 0], [0, 1], [1, 1], [-1, 1]]
  let states: number[][] = []
  for (let [diri, direction] of directions.entries()) {
    states.push([])
    for (let i = -4; i < 4; i++) {
      let currentRow = row + i * direction[0]
      let currentColumn = column + i * direction[1]
      if (currentRow >= 0 && currentRow < ROWS && currentColumn >= 0 && currentColumn < COLS) {
        states[diri].push(grid[currentRow][currentColumn])
      }
    }
  }
  for (let direction of states) {
   let consec = 0;
   let prev = 0;
   for (let value of direction) {
    if ((value == 1 || value == 2) && value == prev) {
      consec++
    } else if (value != prev) {
      consec = 0;
    }
    if (consec == 3) {
      return value
    }
    prev = value;
   } 
  }
  for (let col = 0; col < COLS; col++) {
    if (grid[0][col] == 0) {
      return -1
    }
  }
  return 0
}

export function createGrid(rows: number, columns: number) { 
    rows = rows
    columns = columns
    let cells: number[][] = []
    for (let i = 0; i < rows; i++) {
      cells[i] = []
      for (let j = 0; j < columns; j++) {
        cells[i][j] = 0
      }
    }
    return cells
}

export function addPiece(grid: number[][], column: number, player: number): any[] {
  let cells = grid.map(function(arr) {
      return arr.slice();
  });
  for (let i = ROWS - 1; i >= 0; i--) {
    if (cells[i][column] == 0) {
      cells[i][column] = player
      return [cells, true, i]
    }
  }
  return [cells, false, 0]
}

export function addPieceNoCopy(grid: number[][], column: number, player: number): any[] {
  for (let i = ROWS - 1; i >= 0; i--) {
    if (grid[i][column] == 0) {
      grid[i][column] = player
      return [grid, true, i]
    }
  }
  return [grid, false, 0]
}

export function possiblePlayCount(grid: number[][]): number {
  let count = 0
  for (let col = 0; col < grid[0].length; col++) {
    if (!grid[0][col]) {
      count++
    }
  }
  return count
}

export function getNextMove(tree: Tree, grid: number[][]): number {
  // console.log("new")
  // console.log(grid.map(arr => arr.slice()))
  for (let i = 0; i < 100; i++) {
    tree.update()
  }
  tree.root.printChildren()
  return max(tree.root.children, (child: GameNode) => child.total).move
}






