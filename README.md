# 🎮 Multiplayer Tic-Tac-Toe (React + WebSocket)

A **real-time multiplayer Tic-Tac-Toe** game built with **React**, **Tailwind CSS**, and **WebSocket** — no database or backend frameworks required.
Players can connect from anywhere, get auto-matched, and play instantly in real-time.

---

## 🚀 Features

* 🔗 **Real-Time Gameplay** – Moves sync instantly using WebSocket
* 👥 **Auto Player Matching** – No signup or login needed
* ❌⭕ **Dynamic Player Assignment** – Auto assigns X and O
* 🕹️ **Game Logic on Server** – Server validates moves & checks results
* 🎨 **Modern UI** – Clean Tailwind CSS interface
* ⚡ **Lightweight & Fast** – No database; uses in-memory state
* 🔌 **Graceful Handling** – Detects and responds to player disconnections

---

## 🧭 Learnings

* Understanding how **WebSocket maintains a live, two-way connection**
* Handling **real-time state synchronization** between players
* Managing **connection events** like join, move, reset, and leave
* Seeing how **WebSocket differs from HTTP** in persistent communication


---

## 🧠 How It Works

1. **Connect**
   Each player opens the game and connects to the WebSocket server.

2. **Matchmaking**

   * If only one player is online → shows *“Waiting for another player…”*
   * When a second player joins → both are paired into a private room.

3. **Assign Roles**

   * One player becomes **X**, the other **O**.
   * The same board is displayed to both clients.

4. **Gameplay**

   * Players take turns making moves.
   * Each move is sent to the server → validated → broadcast to both players.
   * The board updates in real-time.

5. **Game End**

   * When someone wins or it’s a draw → both are notified instantly.
   * Option to restart the game.

6. **Disconnect Handling**

   * If a player leaves mid-game → the opponent gets notified immediately.

---

## 🛠️ Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| **Frontend** | React, Tailwind CSS, React Router DOM, WebSocket client |
| **Backend**  | `ws` WebSocket server                                   |
| **Hosting**  | Netlify (Frontend), Local/Cloud (WebSocket Server)      |

---

## 🏃‍♂️ Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/BRajendra10/socketxo.git
   cd socketxo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the WebSocket server**

   ```bash
   node server.js
   ```

4. **Start the client**

   ```bash
   npm run dev
   ```

5. Open the app in **two different devices or ask frend** and play!

