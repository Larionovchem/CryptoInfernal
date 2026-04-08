import { useState, useEffect, useRef } from "react";

function useWebSocket() {
  const [Connection, setConnection] = useState(false);
  const [update, setupdate] = useState([]);
  const socketRef = useRef(null);
  const valueRef = useRef(null);

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
      valueRef.current = JSON.parse(event.data);
    };

    //Обновляем UI раз в 1с, чтобы не было перегрузок
    const intervalId = setInterval(() => {
      setupdate(valueRef.current);
    }, 1000);

    socket.onerror = (error) => {
      console.log("Ошибка", error);
    };

    return () => {
      clearInterval(intervalId);
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
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
