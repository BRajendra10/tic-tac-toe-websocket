
export default function GameBoard({ socket, turn, mySymbol, board }) {

    const handleClick = (index) => {
        if (turn !== mySymbol) return console.log("Not your turn");
        if (board[index]) return console.log("Already filled");

        socket.send(JSON.stringify({ type: 'move', index }));
    };

    const getCellColor = (value) => {
        if (value === 'X') return 'text-pink-500';
        if (value === 'O') return 'text-cyan-400';
        return 'text-white';
    };

    return (
        <div className="flex justify-center items-center">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 p-2 sm:p-4 bg-[#1A1B23] rounded-lg shadow-2xl">
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`w-20 h-20 lg:w-28 lg:h-28 text-2xl sm:text-3xl lg:text-3xl bg-[#2A2B35] hover:bg-[#3A3B45] duration-200 rounded-lg flex items-center justify-center shadow-lg ${getCellColor(cell)}`}
                    >
                        {cell}
                    </button>
                ))}
            </div>
        </div>
    )
}