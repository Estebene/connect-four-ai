import { useState } from 'react'
import './App.css'

const ROWS = 6
const COLS = 7

function App() {
  const [game_grid, setGrid] = useState(createGrid(ROWS,COLS))
  const [player, setPlayer] = useState(1)


  return (
    <div className="App">
      <table>
        <tbody>
          <tr>
            {Array(COLS).fill(0).map((_, i) => (
              <td key={i} onClick={() => {
                let [new_grid, success, row] = addPiece(game_grid, i, player)
                if (success) {
                  setGrid(new_grid)
                  setPlayer(player == 1 ? 2 : 1)
                  if(isTerminal(new_grid, row, i)) {
                    console.log("Game Over")
                  }
                }
              }
              }></td>
            ))}
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          {Array(ROWS).fill(0).map((_, row) => (
            <tr key={row}>
            {game_grid[row].map((state, col) => (
            <td key={`${row},${col}`} className={state==0 ? '' : (state==1 ? 'yellow' : 'red')}>{state}</td>
            ))}
            </tr>
          ))}
        </tbody>
     </table>
    </div>
  )
}

function createGrid(rows: number, columns: number) { 
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

function addPiece(grid: number[][], column: number, player: number): any[] {
  let cells = grid.map(function(arr) {
      return arr.slice();
  });
  for (let i = ROWS - 1; i >= 0; i--) {
    if (cells[i][column] == 0) {
      console.log(player);
      
      cells[i][column] = player
      return [cells, true, i]
    }
  }
  return [cells, false, 0]
}

function isTerminal(grid: number[][], row: number, column: number) {
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
      return true
    }
    prev = value;
   } 
  }
  return false
}






export default App
