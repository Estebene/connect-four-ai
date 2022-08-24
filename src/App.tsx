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
            {Array(ROWS + 1).fill(0).map((_, i) => (
              <td key={i} onClick={() => {
                setGrid(addPiece(game_grid, i, player))
                setPlayer(player == 1 ? 2 : 1)
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

function addPiece(grid: number[][], column: number, player: number) {
  let cells = grid.map(function(arr) {
      return arr.slice();
  });
  for (let i = ROWS - 1; i >= 0; i--) {
    if (cells[i][column] == 0) {
      console.log(player);
      
      cells[i][column] = player
      return cells
    }
  }
  return cells
}

function isTerminal(grid: number[][], row: number, column: number) {}





export default App
