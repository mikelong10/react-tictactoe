import { useState } from "react"

// each individual square on the board
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>{value}</button>
  )
}

// the entire board
export default function Board() {
  // keep track of the state of all 9 squares in Board, lifting state out of Square to the greater Board component
  // initialize 2D array of empty strings
  const [squares, setSquares] = useState(Array(3).fill(Array(3).fill('')))

  // keep track of all moves so we can 'time travel'
  const [moves, setMoves] = useState([squares])

  // initialize game to being player X's turn
  const [playerX, setPlayerX] = useState(true)

  function calculateWinner() {
    // check 3 rows
    for (let row of squares) {
      let rowValues = row[0] + row[1] + row[2]
      if (rowValues === 'XXX' || rowValues === 'OOO') {
        return rowValues[0]
      }
    }
    // check 3 columns
    for (let c = 0; c < squares.length; c++) {
      let colValues = squares[0][c] + squares[1][c] + squares[2][c]
      if (colValues === 'XXX' || colValues === 'OOO') {
        return colValues[0]
      }
    }
    // check 2 diagonals
    let diagValues = squares[0][0] + squares[1][1] + squares[2][2]
    if (diagValues === 'XXX' || diagValues === 'OOO') {
      return diagValues[0]
    }
    diagValues = squares[0][2] + squares[1][1] + squares[2][0]
    if (diagValues === 'XXX' || diagValues === 'OOO') {
      return diagValues[0]
    }
    // otherwise, no winner yet
    return null
  }

  // update board when square (r,c) is clicked
  function handleClick(r, c) {
    // if (r,c) is empty
    if (!calculateWinner() && !squares[r][c]) {
      // make a deep copy of the state of squares array
      const nextSquares = squares.map((row) => row.slice())
      moves.push(nextSquares)
      setMoves(moves)
      playerX ? nextSquares[r][c] = 'X' : nextSquares[r][c] = 'O'
      setSquares(nextSquares);
      // flip to other player's turn
      setPlayerX(!playerX)
    }
  }

  // to determine if the game is over
  function isTie() {
    // false if someone has won
    if (calculateWinner()) return false

    // if there is no winner yet and at least one empty square, false
    for (let row of squares) {
      for (let square of row) {
        if (square === '') return false
      }
    }
    // there is no winner and no empty squares, tie, but game is over
    return true
  }

  // to reset the board to starting state
  function resetGame() {
    // reset all squares to empty
    setSquares(Array(3).fill(Array(3).fill('')));
    // start at playerX again
    setPlayerX(true)
    // reset all previous moves
    setMoves([Array(3).fill(Array(3).fill(''))])
  }

  // calculate if there is a winner or not
  let winner = calculateWinner()
  // determine the current player
  let currentPlayer;
  playerX ? currentPlayer = 'X' : currentPlayer = 'O'
  let status
  // if there is a winner, display winning game message
  if (winner) {
    status = <h1 className="status">{`Player ${winner} Wins!`}</h1>
    // if no winner, display whose turn it is
  } else if (isTie()) {
    status = <h1 className="status">{`Tie - Play Again!`}</h1>
  } else {
    status = <h1 className="status">{`Next Player: ${currentPlayer}`}</h1>
  }

  function timeTravel(move) {
    // reset all squares to state of the given move
    setSquares(moves[move]);
    setMoves(moves.slice(0, move + 1))
    move % 2 === 0 ? setPlayerX(true) : setPlayerX(false)
  }

  let timeTravelList = []
  for (let i = 1; i < moves.length - 1; i++) {
    timeTravelList.push(<li key={i}><button className="time-travel-option" onClick={() => timeTravel(i)}>{`Move ${i}`}</button></li>)
  }

  return (
    <>
      <div className="game">
        <div className="board">
          <div className="board-row">
            {/* give each Square a value prop from the squares state array, and a 
        function object calling handleClick with the appropriate indices */}
            <Square value={squares[0][0]} onSquareClick={() => handleClick(0, 0)} />
            <Square value={squares[0][1]} onSquareClick={() => handleClick(0, 1)} />
            <Square value={squares[0][2]} onSquareClick={() => handleClick(0, 2)} />
          </div>
          <div className="board-row">
            <Square value={squares[1][0]} onSquareClick={() => handleClick(1, 0)} />
            <Square value={squares[1][1]} onSquareClick={() => handleClick(1, 1)} />
            <Square value={squares[1][2]} onSquareClick={() => handleClick(1, 2)} />
          </div>
          <div className="board-row">
            <Square value={squares[2][0]} onSquareClick={() => handleClick(2, 0)} />
            <Square value={squares[2][1]} onSquareClick={() => handleClick(2, 1)} />
            <Square value={squares[2][2]} onSquareClick={() => handleClick(2, 2)} />
          </div>
        </div>
        <div className="game-info">
          {status}
          <button className="reset" onClick={resetGame}>Reset</button>
          <ul className="time-travel">{timeTravelList}</ul>
        </div>
      </div>
    </>
  )
}