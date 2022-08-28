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
    let [new_grid, success, row] = addPiece(game_grid, i, 1)
    // console.log(`move: ${i}`)
    let child = tree.root.children.find((child) => child.move == i)
    // console.log(`length ${tree.root.children.length}`)
    tree.root.children.forEach((child) => console.log(child.move))
    tree.root = child ? child : new GameNode(tree.root, 5)
    if (child) {
      // console.log("child1")
    } else {
      tree.root.total = 1000
    }
    if (success) {
      setGrid(new_grid)
      if(isTerminal(new_grid, row, i) != -1) {
        console.log("Game Over" + isTerminal(new_grid, row, i))
      } else {
        let move = getNextMove(tree, new_grid);
        let child1 = tree.root.children.find((child) => child.move == move)
        tree.root = child1 ? child1 : new GameNode(tree.root, 5)
        if (child1) {
          // console.log("child2")
          // console.log(tree.root.printChildren())
        } else {
          tree.root.total = 1000
        }
        // console.log(move);
        [new_grid, success, row] = addPiece(new_grid, move, 2)
        if (success) {
          if(isTerminal(new_grid, row, move) != -1) {
            console.log("Game Over" + isTerminal(new_grid, row, move))
          }
          setTree(tree);
          setGrid(new_grid)
        }
      }
    }
  }
}

export default App
