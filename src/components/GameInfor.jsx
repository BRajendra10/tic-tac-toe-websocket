import { useNavigate } from 'react-router';

export default function GameInfo({ socket, roomId, turn, status, result }) {
    console.log(result, roomId, turn, status)
    const navigate = useNavigate();

    const handlePlayAgain = () => socket.send(JSON.stringify({ type: 'reset' }));
    const handleLeave = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "leave" }));
            setTimeout(() => navigate("/"), 50);
        } else navigate("/");
    };

    return (
        <div className="flex flex-col bg-[#1A1B23] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-sm text-white">
            <h2 className="text-xl sm:text-2xl text-center font-bold mb-4 sm:mb-5">Game Info</h2>

            <p className="mb-3 sm:mb-4 text-sm">
                Room ID: <span className="font-bold text-yellow-400">{roomId}</span>
            </p>

            <p className="mb-4 sm:mb-6 text-lg">
                Current Turn:{" "}
                <span className={`font-bold ${turn === 'X' ? 'text-pink-500' : 'text-cyan-400'}`}>
                    {turn}
                </span>
            </p>

            <div className="text-gray-400 text-sm mb-4 sm:mb-6">
                {result && result.winner ? `Winner: ${result.winner}` : status}
            </div>

            {result && result.winner && (
                <>
                    <button
                        onClick={handlePlayAgain}
                        className="mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-md"
                    >
                        Play Again
                    </button>

                    <button
                        onClick={handleLeave}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold shadow-md"
                    >
                        Go Back
                    </button>
                </>
            )}
        </div>
    )
}