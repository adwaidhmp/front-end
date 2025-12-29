import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "../redux/chatSlice";

export const useChatSocket = (roomId) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    const ws = new WebSocket(
      `ws://localhost:8001/ws/chat/${roomId}/?token=${token}`
    );

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      dispatch(addMessage({ roomId, message }));
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [roomId, dispatch]);

  const sendText = (text) => {
    if (!socketRef.current || socketRef.current.readyState !== 1) return;
    socketRef.current.send(JSON.stringify({ text }));
  };

  return { sendText };
};
