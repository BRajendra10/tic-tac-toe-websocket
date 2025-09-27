# 🎮 Multiplayer Tic-Tac-Toe (WebSocket + React)

A real-time multiplayer Tic-Tac-Toe game built with **React**, **Tailwind CSS**, and **WebSockets**.
Players from different places can connect, get matched automatically, and play Tic-Tac-Toe live — no database required.

---

## 🚀 Features

* 🔗 Real-time gameplay using WebSocket connections
* 👥 Automatic player matching (no signup required)
* ❌⭕ Assigns players as X and O dynamically
* 🕹️ Validates moves and checks for wins/draws on the server
* 🎨 Modern UI with React + Tailwind CSS
* ⚡ Lightweight, no database – all data stored in memory during play
* 🔌 Handles disconnections gracefully

---

## 📝 How It Works

1. **Connect** – Players open the game page and connect to the WebSocket server.

2. **Matchmaking** – The server waits for two players.

   * If you’re first, you’ll see “Waiting for another player…”
   * When a second player joins, both are paired into a room.

3. **Assign Roles** – The server automatically gives one player **X** and the other **O**.

   * Both see the same empty board.

4. **Play the Game** – Players click on cells to make moves.

   * Moves go to the server.
   * The server updates the board, checks turn, and sends the updated board back to both players in real time.

5. **Game Over** – When someone wins or it’s a draw, the server sends the result to both players and ends the room.

6. **Disconnects** – If a player leaves during a match, the other player is notified immediately.

---

## 🛠️ Tech Stack

* **Frontend:** react, tailwind-css, react-router-dom, WebSocket client
* **Backend:** Node.js with `ws` WebSocket server

---

## 🏃‍♂️ Running Locally

1. Clone the repo

   ```bash
   git clone https://github.com/yourusername/tic-tac-toe-websocket.git
   cd tic-tac-toe-websocket
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the WebSocket server

   ```bash
   node server.js
   ```

4. Open `public/index.html` in two different browsers or devices to test multiplayer.