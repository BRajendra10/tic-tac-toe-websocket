import React, { useReducer, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

import GameBoard from '../components/GameBoard.jsx';
import GameInfo from '../components/GameInfor.jsx';

import { ACTION, initialState } from '../utility/reducer.js';
import reducer from '../utility/reducer.js';

import handleMessage from '../utility/messageHandler.js';

export default function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isCreator, roomId } = location.state;
    const clientIdRef = useRef("");

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
        const ws = new WebSocket(wsUrl);
        dispatch({ type: ACTION.SET_SOCKET, payload: ws });

        ws.onopen = () => {
            console.log('Connected to server');
            if (isCreator) ws.send(JSON.stringify({ type: 'create' }));
            else if (roomId) ws.send(JSON.stringify({ type: 'join', roomId }));
        }

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            handleMessage(msg, dispatch, clientIdRef, navigate);
        }

        return () => {
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "close" }));
            ws.close();
        }
    }, [isCreator, roomId, navigate])


    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] p-4 sm:p-6">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 drop-shadow-lg text-center text-white">Tic Tac Toe</h1>


            <div className="flex flex-col md:flex-col lg:flex-row items-center gap-8 w-full max-w-4xl">
                {/* Game Board */}
                <GameBoard
                    turn={state.turn}
                    board={state.board}
                    socket={state.socket}
                    mySymbol={state.mySymbol}
                />

                {/* Game Info Panel */}
                <GameInfo
                    turn={state.turn}
                    socket={state.socket}
                    roomId={state.roomId}
                    status={state.status}
                    result={state.result}
                />
            </div>
        </div>
    )
}