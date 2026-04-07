import { useState, useEffect, useRef } from "react";

function useWebSocket() {
  const [Connection, setConnection] = useState(false);
  const [update, setupdate] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    let socket = new WebSocket("wss://advanced-trade-ws.coinbase.com");
    socketRef.current = socket;

    socket.onopen = () => {
      setConnection(true);
      socket.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: ["BTC-USD"],
          channel: "ticker",
        }),
      );
    };
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log("Получены данные:", newData);
      setupdate(newData);
    };
    socket.onerror = (error) => {
      console.log("Ошибка", error);
    };
    return () => {
      console.log("readyState:", socket.readyState);
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        console.log("readyState:", socket.readyState);
        console.log("ref:", socketRef.current);
        socketRef.current.close();
      }
    };
  }, []);

  return {
    massage: update,
    isConnection: Connection,
  };
}

export default useWebSocket;
