import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=6, ncols=6, chanceLightStartsOn= 0.25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    //array-of-arrays of true/false values
    for( let y = 0; y < nrows; y++) {
      let row = [];
      for(let x = 0; x < ncols; x++){
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  function hasWon() {
    // check the board in state to determine whether the player has won.
    const winner = board.every(row => row.every(cell => !cell));
    return winner;
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      //Make a (deep) copy of the oldBoard
      const copy = oldBoard.map(row => [...row]);

      //in the copy, flip this cell and the cells around it -> flipcell()
      //flip selected cell
      flipCell(y, x, copy); 
      //flip surrounding cells. 
      flipCell(y - 1, x, copy); 
      flipCell(y + 1, x, copy); 
      flipCell(y, x - 1, copy);
      flipCell(y, x + 1, copy);

      //return the copy
      return copy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  //but a simple “You Won” message should show in its place.
  if(hasWon()){
    return <div>You Won!</div>
  }
  // make table board
  let tableBoard = [];

  for(let y = 0; y < nrows; y++) {
    let row =[];
    for(let x = 0; x < ncols; x++) {
      let location = `${y}-${x}`;
      row.push(
        <Cell
          key={location}
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(location)}
        />
      );
    }
    tableBoard.push(<tr key={y}>{row}</tr>);
  }

  // TODO
  return(
    <table className="Board">
      <tbody>{tableBoard}</tbody>
    </table>
  );
}

export default Board;
