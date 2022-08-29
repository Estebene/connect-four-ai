import { useEffect, useLayoutEffect, useState } from 'react'
import './App.css'
import { Tree, GameNode, getRandomInt, getRandomPlay } from './ai'
import {isTerminal, createGrid, addPiece, getNextMove} from './game'
import { array2, array1, array3 } from './test_grids'
import { flushSync } from 'react-dom'

const ROWS = 6
const COLS = 7

function App() {
  const [game_grid, setGrid] = useState(createGrid(ROWS,COLS))
  const [tree, setTree] = useState(new Tree(new GameNode(null, 5), 2))
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (pending) {
      opponentMove(game_grid, tree).then(([new_grid, new_tree]) => {
        setTree(new_tree)
        setGrid(new_grid)
        setPending(false)
      }) 
    }
 }, [game_grid])

    return (
    <div className="App">
      <table className="topTable">
        <tbody>
          <tr>
            {Array(COLS).fill(0).map((_, i) => (
              <td className="hoverButton" key={i} onClick={() => {handlePlay(i)}}></td>
            ))}
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          {Array(ROWS).fill(0).map((_, row) => (
            <tr key={row}>
            {game_grid[row].map((state, col) => (
            <td key={`${row},${col}`} className={state==0 ? '' : (state==1 ? 'yellow' : 'red')}></td>
            ))}
            </tr>
          ))}
        </tbody>
     </table>
    </div>
  )

  function opponentMove(grid2: number[][], tree2: Tree) {
    return new Promise<[number[][], Tree]>(async (resolve, reject) => {
      await new Promise<void>((resolve) => setTimeout(resolve, 100))
      let move = await getNextMove(tree2, grid2);
      // let move = 0;
      // await new Promise(resolve => setTimeout(resolve, 1000))
      let new_tree = changeToChild(tree2, move);
      let [new_grid,,row] = addPiece(grid2, move, 2)
      checkEnd(new_grid, row, move)
      resolve([new_grid, new_tree])
    })
  }

  function handlePlay(i: number) {
    let [new_grid, new_tree]= playTurns(i);
    setTree(new_tree);
    setPending(true);
    setGrid(new_grid);
  }

  function playTurns(i: number) {
    let [new_grid, success, row] = addPiece(game_grid, i, 1)
    if (!success) return new_grid
    let new_tree = changeToChild(tree, i)
    if (checkEnd(new_grid, row, i)) return new_grid
    // let move = getNextMove(tree, new_grid);
    // changeToChild(tree, move);
    // [new_grid,, row] = addPiece(new_grid, move, 2)
    // checkEnd(new_grid, row, move)
    return [new_grid, new_tree]
  }

  function changeToChild(tree: Tree, move: number) {
    let child = tree.root.children.find((child) => child.move == move)
    let new_tree = new Tree(new GameNode(null, 5), 2)
    new_tree.root = child ? child : new GameNode(tree.root, 5)
    return new_tree
  }

  function checkEnd(grid: number[][], row: number, i: number): boolean{
    let terminality = isTerminal(grid, row, i)
    if(terminality != -1) {
      alert("Game Over: Player " + terminality + " Won")
      return true
    }
    return false
  }
}

export default App
