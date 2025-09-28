import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCreator, roomId } = location.state;
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [rmId, setRmId] = useState("");
  const [mySymbol, setMySymbol] = useState("");
  const [status, setStatus] = useState("");
  const [socket, setSocket] = useState("");
  const [result, setResult] = useState("");
  const clientIdRef = useRef("");

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to server');
      if (isCreator) {
        ws.send(JSON.stringify({ type: 'create' }));
      } else if (roomId) {
        ws.send(JSON.stringify({ type: 'join', roomId }));
      }
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case 'connected':
          clientIdRef.current = msg.clientId;
          console.log('Client connected:', msg.clientId);
          break;

        case 'created':
          setRmId(msg.roomId);
          setMySymbol(msg.state.players[clientIdRef.current]);
          setBoard(msg.state.board);
          setTurn(msg.state.turn);
          setStatus('Waiting for opponent to join...');
          break;

        case 'joined':
          setRmId(msg.roomId);
          setMySymbol(msg.state.players[clientIdRef.current]);
          setBoard(msg.state.board);
          setTurn(msg.state.turn);
          setStatus('Game started!');
          break;

        case 'state':
          setResult(msg.state.result);
          setBoard(msg.state.board);
          setMySymbol(msg.state.turn);
          setTurn(msg.state.turn);
          break;

        case 'left':
          alert("Returning to homepage.");
          navigate("/"); // no need to reset state
          break;

        case 'error':
          alert(`${msg.message}. Returning to homepage.`);
          navigate("/");
          break;
      }
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "close" }));
      }
      ws.close();
    };

  }, [isCreator, roomId, navigate]);

  // Handle a cell click
  const handleClick = (index) => {
    console.log(turn, mySymbol);
    if (turn !== mySymbol) {
      console.log("Not your turn");
      return
    };
    if (board[index]) {
      console.log("Already filled");
      return
    };

    // setBoard(board[index] = turn);
    socket.send(JSON.stringify({ type: 'move', index }));
  };

  const handlePlayAgain = () => {
    socket.send(JSON.stringify({ type: 'reset' }));
  }

  const handleLeave = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // 1️⃣ Notify the server
      socket.send(JSON.stringify({ type: "leave" }));
      // 2️⃣ Delay navigation slightly to ensure the message is sent
      setTimeout(() => {
        navigate("/");
      }, 50); // 50ms is enough
    } else {
      navigate("/"); // fallback if socket is closed
    }
  };


  const getCellColor = (value) => {
    if (value === 'X') return 'text-pink-500';
    if (value === 'O') return 'text-cyan-400';
    return 'text-white';
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] p-6">
      <h1 className="text-5xl font-bold mb-8 drop-shadow-lg">Tic Tac Toe</h1>

      <div className="flex flex-col justify-between lg:flex-row gap-8 w-full max-w-4xl">
        {/* Left: Game Board */}
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-3 gap-4 bg-[#1A1B23] p-4 rounded-lg shadow-2xl">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={`w-28 h-28 bg-[#2A2B35] hover:bg-[#3A3B45] duration-200 rounded-lg text-3xl font-bold flex items-center justify-center shadow-lg ${getCellColor(cell)}`}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Scoreboard & Info */}
        <div className="flex flex-col bg-[#1A1B23] p-6 rounded-xl shadow-2xl w-full max-w-sm text-white">
          <h2 className="text-2xl text-center font-bold mb-5">Game Info</h2>

          <p className="mb-4 text-sm">
            Room ID: <span className="font-bold text-yellow-400">{rmId}</span>
          </p>

          {/* Current Turn */}
          <p className="mb-6 text-lg">
            Current Turn:{" "}
            <span className={`font-bold ${turn === 'X' ? 'text-pink-500' : 'text-cyan-400'}`}>
              {turn}
            </span>
          </p>

          {/* Scoreboard */}
          {/* <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Scoreboard</h3>
            <div className="flex justify-between text-lg">
              <span className="text-pink-500">X: 0</span>
              <span className="text-cyan-400">O: 0</span>
              <span className="text-gray-300">Draw: 0</span>
            </div>
          </div> */}

          {/* Extra Instructions */}
          <div className="text-gray-400 text-sm">
            {result && result.winner
              ? `Winner: ${result.winner}`
              : status}
          </div>

          {/* Play Again Button */}
          {result && result.winner && (
            <>
              <button
                onClick={() => handlePlayAgain()}
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-md"
              >
                Play Again
              </button>

              <button
                onClick={() => handleLeave()}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold shadow-md"
              >
                go back
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Game;
