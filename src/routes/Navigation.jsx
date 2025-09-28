import React from 'react'
import { Routes, Route } from "react-router";
import Home from '../components/Home';
import Game from '../components/Game';

function Navigation() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
    </Routes>
  )
}

export default Navigation