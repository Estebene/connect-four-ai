import { useState } from 'react'
import './App.css'
import { Tree, GameNode } from './ai'
import {isTerminal, createGrid, addPiece, getNextMove} from './game'

const ROWS = 6
const COLS = 7

function App() {
  const [game_grid, setGrid] = useState(createGrid(ROWS,COLS))
  const [player, setPlayer] = useState(1)
  const [tree, setTree] = useState(new Tree(new GameNode(null, 5), game_grid, 2))


  return (
    <div className="App">
      <table>
        <tbody>
          <tr>
            {Array(COLS).fill(0).map((_, i) => (
              <td key={i} onClick={() => {handlePlay(i)}}>
              
              </td>
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

  function handlePlay(i: number) {
    let new_grid = playTurns(i);
    setTree(tree);
    setGrid(new_grid)
  }

  function playTurns(i: number) {
    let [new_grid, success, row] = addPiece(game_grid, i, 1)
    if (!success) return new_grid
    changeToChild(tree, i)
    if (checkEnd(new_grid, row, i)) return new_grid
    let move = getNextMove(tree, new_grid);
    changeToChild(tree, move);
    [new_grid,, row] = addPiece(new_grid, move, 2)
    checkEnd(new_grid, row, move)
    return new_grid
  }

  function changeToChild(tree: Tree, move: number) {
    let child = tree.root.children.find((child) => child.move == move)
    tree.root = child ? child : new GameNode(tree.root, 5)
  }

  function checkEnd(grid: number[][], row: number, i: number): boolean{
    let terminality = isTerminal(grid, row, i)
    if(terminality != -1) {
      console.log("Game Over: " + terminality)
      return true
    }
    return false
  }
}

export default App
