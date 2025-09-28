import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function Home() {
  const navigate = useNavigate();
  const [roomInput, setRoomInput] = useState('');

  const handleCreateRoom = () => {
    navigate('/game', { state: { isCreator: true } });
  };

  const handleJoinRoom = () => {
    if (!roomInput.trim()) return alert('Enter a valid Room ID');
    navigate('/game', { state: { isCreator: false, roomId: roomInput.toUpperCase() } });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-4">
      <div className="bg-[#1C1D23] rounded-xl shadow-xl p-8 flex flex-col items-center w-full max-w-md">
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg text-center">
          Tic Tac Toe
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          Challenge your friends online or play solo. Create a room or join an existing one!
        </p>

        {/* Create Room */}
        <button
          onClick={handleCreateRoom}
          className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white font-semibold mb-4 shadow-md hover:scale-105 duration-200"
        >
          Create Room
        </button>

        <p className="text-gray-400 mb-2">OR</p>

        {/* Join Room */}
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Enter Room ID"
            className="flex-1 px-3 py-2 rounded-xl text-white outline-none focus:border-gray-800"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-semibold shadow-md hover:scale-105 duration-200"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
