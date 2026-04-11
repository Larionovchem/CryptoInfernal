import { useEffect, useRef } from "react";
import { useCryptoStore } from "../useCryptoStore";
import { mapSocketData } from "../utils/mapper";

function useWebSocket() {
  const { connectionStatus, setConnectionStatus, updateCoin, coins } =
    useCryptoStore();
  const socketRef = useRef(null);
  const valueRef = useRef(null);

  useEffect(() => {
    let socket = new WebSocket("wss://advanced-trade-ws.coinbase.com");
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus("open");
      socket.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: ["BTC-USD"],
          channel: "ticker",
        }),
      );
    };
    socket.onmessage = (event) => {
      valueRef.current = mapSocketData(JSON.parse(event.data));
      console.log(valueRef.current);
      // if(valueRef.current)
    };

    //Обновляем UI раз в 1с, чтобы не было перегрузок
    const intervalId = setInterval(() => {
      if (valueRef.current != null)
        updateCoin(valueRef.current.symbol, valueRef.current.data);
    }, 1000);

    socket.onerror = (error) => {
      console.log("Ошибка", error);
      setConnectionStatus("error");
    };

    return () => {
      clearInterval(intervalId);
      if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    massage: coins,
    isConnection: connectionStatus,
  };
}

export default useWebSocket;
