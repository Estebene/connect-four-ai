import { useState } from 'react'
import './App.css'
import {isTerminal, createGrid, addPiece} from './game'

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
                  if(isTerminal(new_grid, row, i) != -1) {
                    console.log("Game Over" + isTerminal(new_grid, row, i))
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





export default App
