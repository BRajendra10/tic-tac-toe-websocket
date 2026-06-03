export const ACTION = {
    SET_SOCKET: 'SET_SOCKET',
    CREATE_ROOM: 'CREATE_ROOM',
    JOIN_ROOM: 'JOIN_ROOM',
    UPDATE_STATE: 'UPDATE_STATE'
};

export const initialState = {
    board: Array(9).fill(null),
    turn: "X",
    roomId: "",
    mySymbol: "",
    status: "",
    result: null
};

export default function reducer(state, action) {
    switch (action.type) {
        case ACTION.SET_SOCKET:
            return { ...state, socket: action.payload };

        case ACTION.CREATE_ROOM:
            return {
                ...state,
                roomId: action.payload.msg.roomId,
                mySymbol: action.payload.msg.state.players[action.payload.clientId],
                board: action.payload.msg.state.board,
                turn: action.payload.msg.state.turn,
                status: 'Waiting for opponent to join...'
            };

        case ACTION.JOIN_ROOM:
            return {
                ...state,
                roomId: action.payload.msg.roomId,
                mySymbol: action.payload.msg.state.players[action.payload.clientId],
                board: action.payload.msg.state.board,
                turn: action.payload.msg.state.turn,
                status: 'Game started!'
            };

        case ACTION.UPDATE_STATE:
            return {
                ...state,
                board: action.payload.msg.state.board,
                turn: action.payload.msg.state.turn,
                status: action.payload.msg.state.status,
                result: action.payload.msg.state.result
            };

        default:
            return state;

    }
}
