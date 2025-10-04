import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import http from 'http';  // Node built-in—no install needed

const PORT = process.env.PORT || 8080;
const server = http.createServer();  // Empty HTTP—just for hosting
const wss = new WebSocketServer({ server });  // WS on same port
console.log(`WebSocket server listening on ws://localhost:${PORT}`);

const rooms = new Map();
// rooms (Map)
//  ├─ 'ROOM123' → { 
//  │    players: Map
//  │     ├─ 'clientA' → wsA
//  │     └─ 'clientB' → wsB
//  │    state: { board: [...], turn: 'X', ... }
//  │  }
//  └─ 'ROOM456' → { ...another room... }

function createEmptyState() {
  return {
    board: Array(9).fill(null),
    turn: 'X',
    result: null, // winner info
    players: {},  // clientId -> symbol
  };
}

// Check winner
function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: [a, b, c] };
    }
  }
  if (board.every(Boolean)) return { winner: 'draw', winningLine: [] };
  return null;
}

// Broadcast state to all players in a room
function broadcastRoom(roomId, payload) {
  const room = rooms.get(roomId);
  if (!room) return;
  const str = JSON.stringify(payload);
  for (const [, ws] of room.players) {
    if (ws.readyState === 1) ws.send(str);
  }
}

// Handle connections
wss.on('connection', (ws) => {
  const clientId = uuidv4();
  ws.clientId = clientId; // Assign a unique ID to this client and store it on the socket.
  ws.roomId = null; // Also track which room this client is in (null until they join/create a room).

  ws.send(JSON.stringify({ type: 'connected', clientId }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      switch (msg.type) {

        case 'create': {
          const roomId = uuidv4().slice(0, 6).toUpperCase();
          const state = createEmptyState();
          state.players[clientId] = 'X';
          const players = new Map([[clientId, ws]]);
          rooms.set(roomId, { players, state });
          ws.roomId = roomId;
          ws.symbol = 'X';
          ws.send(JSON.stringify({ type: 'created', roomId, state }));
          break;
        }

        case 'join': {
          const { roomId } = msg;
          const room = rooms.get(roomId);

          if (!room) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
            return;
          }
          if (room.players.size >= 2) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room full' }));
            return;
          }

          room.players.set(clientId, ws); // seting second the 0 user in roomId(roomdId the user provide)
          room.state.players[clientId] = 'O';
          ws.roomId = roomId;
          ws.symbol = 'O';
          broadcastRoom(roomId, { type: 'joined', roomId, state: room.state })
          break;
        }

        case 'move': {
          const { index } = msg;
          const room = rooms.get(ws.roomId);
          const state = room.state;
          const mySymbol = state.players[clientId];
          // Early exit if invalid move
          if (
            state.result ||             // game already finished
            state.turn !== mySymbol ||  // not your turn
            index < 0 || index > 8 ||  // invalid index
            state.board[index]          // cell already filled
          ) return;
          // Make the move
          state.board[index] = mySymbol;
          state.turn = mySymbol === 'X' ? 'O' : 'X';
          // Check for winner
          const result = checkWinner(state.board);
          if (result) state.result = result;
          // Broadcast updated state
          broadcastRoom(ws.roomId, { type: 'state', state });
          break;
        }

        case 'reset': {
          const room = rooms.get(ws.roomId);
          if (!room) return;
          // Reset state
          room.state = createEmptyState();
          // Get players array [p1, p2]
          const [p1, p2] = Array.from(room.players.keys());
          // Swap symbols
          [room.state.players[p1], room.state.players[p2]] = ['O', 'X'];
          // Broadcast
          broadcastRoom(ws.roomId, { type: 'state', state: room.state });
          break;
        }

        case 'leave': {
          const room = rooms.get(ws.roomId);
          if (room) {
            // Notify the other player
            broadcastRoom(ws.roomId, { type: 'left', clientId });
            // Delete the entire room
            rooms.delete(ws.roomId);
          }
          ws.roomId = null;
          break;
        }


        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }

    } catch (err) {
      console.error('Invalid message', err);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  // Handle socket closing (browser close, crash)
  ws.on('close', () => {
    const room = rooms.get(ws.roomId);
    if (room) {
      broadcastRoom(ws.roomId, { type: 'left', clientId });
      rooms.delete(ws.roomId);
    }
  });

});

server.listen(PORT);  // Binds everything