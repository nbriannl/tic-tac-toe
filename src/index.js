import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Instead of the Square above. THis is an example of a functional component
// It is useful for component types that only consist of a render method
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      // history is an Array initialised with a single Element: squares, which is an Array size 9 all filled with null
      history: [{
        squares: Array(9).fill(null),
      }],
      // stepNumber is 0 and X is init to be the next move
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // For a given input step, the state of the Game will change.
  // i.e. the stepNumber and the xIsNext 
  // KIV: render() will render according to the start of the board.
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    })
  }

  // For a given square i.
  handleClick(i) {
    // arr.slice(begin , end) returns a shallow copy of a portion of arr into a new Array obj selected
    // from begin inclusive to end exclusive
    // this.state.history obtains a reference to the state of the Game object.
    //
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // If the game has been won or the square has already been filled. Then just return this function.
    // Note that null is falsy value while 'X' or 'O' is a truthy value 
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Else fill the given square as in the Array sqaure an 'X' or an 'O'
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Finally set the state of Game
    this.setState({
      // concatenate the latest Array of squares to history
      history: history.concat([{
        squares: squares,
      }]),
      // update the stepNumber
      stepNumber: history.length,
      // flip from X to O or vice versa
      xIsNext: !this.state.xIsNext,
    })
  }

  // Renders the game board according to the state
  // Recall: State consists of history Array of squares and stepNumber and xIsNext 
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // (1) 
    // (param1, param2, ..., paramN) => { statements } OE
    // (param1, param2, ..., paramN) => expression
    // equaivalent to: 
    // (param1, param2, ..., paramN) => { return expression; }  
    // (2) 
    // Array.map() creates a new array 
    // with the the results of calling a provided function on every element in the calling array

    // moves is a array of moves in the side of the Board
    const moves = history.map((step, move) => {
      console.log("move: " + move);
      console.log("step: " + step);
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        //keys are important in dynamic lists!
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          {/* I need to figure out what is goin on here.*/}
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        {/* I need to figure out what is goin on here.*/}
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
