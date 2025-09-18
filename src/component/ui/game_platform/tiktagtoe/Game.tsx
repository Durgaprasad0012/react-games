import React, { useState, useEffect } from 'react';

interface Wallet {
  wallet: number;
  setWallet: React.Dispatch<React.SetStateAction<number>>;
}

const Game: React.FC<Wallet> = ({ wallet, setWallet }) => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [board, setBoard] = useState<string[][]>(Array(3).fill(null).map(() => Array(3).fill('')));
  const [playerTurn, setPlayerTurn] = useState<boolean>(true); // true = player (X), false = computer (O)
  const [winner, setWinner] = useState<string | null>(null); // 'X', 'O', 'draw'
  const [resultMessage, setResultMessage] = useState<string>('');

  // Check for winner or draw
  const checkWinner = (currentBoard: string[][]): string | null => {
    const lines = [
      // Rows
      [0, 0, 0, 1, 0, 2],
      [1, 0, 1, 1, 1, 2],
      [2, 0, 2, 1, 2, 2],
      // Columns
      [0, 0, 1, 0, 2, 0],
      [0, 1, 1, 1, 2, 1],
      [0, 2, 1, 2, 2, 2],
      // Diagonals
      [0, 0, 1, 1, 2, 2],
      [0, 2, 1, 1, 2, 0],
    ];
    for (const [aRow, aCol, bRow, bCol, cRow, cCol] of lines) {
      if (
        currentBoard[aRow][aCol] &&
        currentBoard[aRow][aCol] === currentBoard[bRow][bCol] &&
        currentBoard[aRow][aCol] === currentBoard[cRow][cCol]
      ) {
        return currentBoard[aRow][aCol];
      }
    }
    if (currentBoard.every(row => row.every(cell => cell !== ''))) {
      return 'draw';
    }
    return null;
  };

  // Minimax AI evaluation
  const evaluateBoard = (board: string[][]) => {
    const win = checkWinner(board);
    if (win === 'O') return +10;
    if (win === 'X') return -10;
    return 0;
  };

  const minimax = (board: string[][], depth: number, isMax: boolean) => {
    const score = evaluateBoard(board);
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (board.every(row => row.every(cell => cell !== ''))) return 0;

    if (isMax) {
      let best = -Infinity;
      board.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell === '') {
            board[r][c] = 'O';
            best = Math.max(best, minimax(board, depth + 1, false));
            board[r][c] = '';
          }
        });
      });
      return best;
    } else {
      let best = Infinity;
      board.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell === '') {
            board[r][c] = 'X';
            best = Math.min(best, minimax(board, depth + 1, true));
            board[r][c] = '';
          }
        });
      });
      return best;
    }
  };

  // const getBestMove = (board: string[][]): [number, number] | null => {
  //   let bestVal = -Infinity;
  //   let bestMove: [number, number] | null = null;

  //   board.forEach((row, r) => {
  //     row.forEach((cell, c) => {
  //       if (cell === '') {
  //         board[r][c] = 'O';
  //         const moveVal = minimax(board, 0, false);
  //         board[r][c] = '';
  //         if (moveVal > bestVal) {
  //           bestMove = [r, c];
  //           bestVal = moveVal;
  //         }
  //       }
  //     });
  //   });

  //   return bestMove;
  // };

  const getBestMove = (board: string[][]): [number, number] | null => {
  let bestVal = -Infinity;
  let bestMove: [number, number] | null = null;

  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === '') {
        board[r][c] = 'O';
        const moveVal = minimax(board, 0, false);
        board[r][c] = '';
        if (moveVal > bestVal) {
          bestMove = [r, c];
          bestVal = moveVal;
        }
      }
    });
  });

  // 👇 Compromise logic: 30% chance AI plays a random move instead of the best
  if (Math.random() < 0.3) {
    const emptyCells: [number, number][] = [];
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === '') emptyCells.push([r, c]);
      });
    });
    if (emptyCells.length > 0) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  }

  return bestMove;
};



  // Player move
  const handleCellClick = (row: number, col: number) => {
    if (!playerTurn || board[row][col] !== '' || winner) return;
    const newBoard = board.map(r => r.slice());
    newBoard[row][col] = 'X';
    setBoard(newBoard);
    const win = checkWinner(newBoard);
    if (win) {
      handleGameEnd(win);
    } else {
      setPlayerTurn(false);
    }
  };

  // Computer move
  useEffect(() => {
    if (!playerTurn && !winner && gameStarted) {
      const bestMove = getBestMove(board);
      setTimeout(() => {
        if (bestMove) {
          const newBoard = board.map(r => r.slice());
          newBoard[bestMove[0]][bestMove[1]] = 'O';
          setBoard(newBoard);
          const win = checkWinner(newBoard);
          if (win) {
            handleGameEnd(win);
          } else {
            setPlayerTurn(true);
          }
        }
      }, 500);
    }
  }, [playerTurn, board, winner, gameStarted]);

  // Restart game with option for computer first
  const restartGame = (computerFirst = false) => {
    const newBoard = Array(3).fill(null).map(() => Array(3).fill(''));
    setBoard(newBoard);
    setWinner(null);
    setResultMessage('');

    if (computerFirst) {
      const emptyCells: [number, number][] = [];
      newBoard.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell === '') emptyCells.push([r, c]);
        });
      });
      const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newBoard[randomMove[0]][randomMove[1]] = 'O';
      setBoard(newBoard);
      setPlayerTurn(true);
    } else {
      setPlayerTurn(true);
    }
  };

  // Handle game end
  const handleGameEnd = (win: string | null) => {
    setWinner(win);
    if (win === 'X') {
      setWallet(prev => prev + betAmount * 1.8);
      setResultMessage(`You win! +${(betAmount * 1.8).toFixed(2)} added to wallet.`);
    } else if (win === 'O') {
      setResultMessage('Computer wins! You lose the bet.');
    } else if (win === 'draw') {
      setResultMessage('It\'s a draw! Restarting game...');
      setTimeout(() => {
        restartGame(Math.random() < 0.5); // 50% chance computer starts
      }, 2000);
    }
  };

  // Start game
  const handleBet = () => {
    if (betAmount > wallet || betAmount < 10) return;
    setWallet(prev => prev - betAmount);
    setGameStarted(true);
    setBoard(Array(3).fill(null).map(() => Array(3).fill('')));
    setPlayerTurn(true);
    setWinner(null);
    setResultMessage('');
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setBetAmount(10);
    setResultMessage('');
  };

  const increaseBet = () => setBetAmount(prev => Math.min(prev === 10 ? prev + 90 : prev + 100, wallet));
  const decreaseBet = () => setBetAmount(prev => Math.max(prev - 100, 10));

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>
      {!gameStarted ? (
        <div className="bg-white/10 p-6 rounded shadow-md text-center">
          <h2 className="text-2xl mb-4">Place Your Bet</h2>
          <div className="flex justify-center items-center mb-4">
            <button onClick={decreaseBet} className="bg-black/20 text-white px-4 py-2 rounded mr-2 hover:bg-red-600">-</button>
            <span className="text-xl mx-4">${betAmount}</span>
            <button onClick={increaseBet} className="bg-black/20 text-white px-4 py-2 rounded ml-2 hover:bg-green-600">+</button>
          </div>
          <button onClick={handleBet} disabled={betAmount > wallet || betAmount < 10} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">Bet</button>
          {betAmount > wallet && <p className="text-red-500 mt-2">Insufficient wallet balance!</p>}
        </div>
      ) : (
        <div className="text-center">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className="w-20 h-20 bg-white/10 border-2 border-gray-300 rounded-lg text-4xl font-bold flex items-center justify-center hover:bg-gray-100"
                  disabled={!!winner || cell !== ''}
                >
                  {cell}
                </button>
              ))
            )}
          </div>
          {resultMessage && (
            <div className="mt-4">
              <p className="text-xl mb-2">{resultMessage}</p>
              {winner !== 'draw' && (
                <button onClick={handlePlayAgain} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                  Play Again
                </button>
              )}
            </div>
          )}
          {!winner && <p className="text-lg">{playerTurn ? 'Your turn (X)' : 'Computer\'s turn (O)'}</p>}
        </div>
      )}
    </div>
  );
};

export default Game;
