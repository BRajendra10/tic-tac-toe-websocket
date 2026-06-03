import { Routes, Route } from "react-router";
import Home from './pages/Home.jsx';
import Game from './pages/Game.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  )
}

export default App