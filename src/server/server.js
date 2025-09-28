import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server listening on ws://localhost:8080");

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
          if (state.result) return; // already finished
          const mySymbol = state.players[clientId];
          if (state.turn !== mySymbol) return;
          if (index < 0 || index > 8 || state.board[index]) return;

          state.board[index] = mySymbol;
          state.turn = mySymbol === 'X' ? 'O' : 'X';

          const result = checkWinner(state.board);
          if (result) state.result = result;

          broadcastRoom(ws.roomId, { type: 'state', state });
          break;
        }

        case 'reset': {
          const room = rooms.get(ws.roomId);
          if (!room) return;
          // Save old symbols before resetting
          const oldPlayers = { ...room.state.players };
          // Reset state
          room.state = createEmptyState();
          // Get players
          const players = Array.from(room.players.keys()); // [p1, p2]
          // Swap symbols
          room.state.players[players[0]] = oldPlayers[players[1]] || 'X';
          room.state.players[players[1]] = oldPlayers[players[0]] || 'O';
          // Broadcast new state
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
