import React from 'react';
import './App.css';

function Square(props) {
  return (
    <button className="square" {...props}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, j) {
    const index = getIndex(i, j);
    const isWinningSquare = this.props.winningSquares?.includes(index);
    return (
      <Square
        key={index}
        value={this.props.squares[index]}
        onClick={() => this.props.onClick(i, j)}
        style={{backgroundColor: isWinningSquare ? 'lightgreen' : ''}}
      />
    );
  }

  render() {
    return (
      <div>
        {[0, 1, 2].map(i => 
          <div key={i} className="board-row">
            {[0, 1, 2].map(j => this.renderSquare(i, j))}
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortAsc: true
    };
  }

  handleClick(i, j) {
    const index = getIndex(i, j);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[index]) {
      return;
    }
    squares[index] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: i+1,
          col: j+1
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const isCurrentMove = move === this.state.stepNumber;
      const desc = move ?
        `Go to move # ${move} (C${step.col},R${step.row})` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={{fontWeight: (isCurrentMove) ? 'bold' : ''}}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else if(this.state.stepNumber === 9){
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
            winningSquares={winner && winner.winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>{ this.setState({sortAsc: !this.state.sortAsc})}}>Sort {(this.state.sortAsc) ? 'Desc' : 'Asc'}</button>
          <ol style={{flexDirection: (this.state.sortAsc) ? 'column' : 'column-reverse'}}>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i]
      }
    }
  }
  return null;
}

function getIndex(i, j){
  return i * 3 + j;
}

export default Game;
