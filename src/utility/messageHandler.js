import { ACTION } from './reducer';

export default function handleMessage(msg, dispatch, clientIdRef, navigate) {
    switch (msg.type) {
        case 'connected':
            clientIdRef.current = msg.clientId;
            console.log('Client connected:', msg.clientId);
            return;

        case 'created':
            dispatch({ type: ACTION.CREATE_ROOM, payload: { msg, clientId: clientIdRef.current } });
            return;

        case 'joined':
            dispatch({ type: ACTION.JOIN_ROOM, payload: { msg, clientId: clientIdRef.current } });
            return;

        case 'state':
            dispatch({ type: ACTION.UPDATE_STATE, payload: { msg, clientId: clientIdRef.current } });
            return;

        case 'left':
            alert("Returning to homepage.");
            navigate("/");
            return;

        case 'error':
            alert(`${msg.message}. Returning to homepage.`);
            navigate("/");
            return;
    }
}