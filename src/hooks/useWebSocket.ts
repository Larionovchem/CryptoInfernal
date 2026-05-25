import { useEffect, useRef } from 'react';
import { useCryptoStore } from '../store/useCryptoStore';
import { mapSocketData } from '../utils/mapper';
import type { CoinStore } from '../types/crypto';

function useWebSocket(productIds: string[]) {
  const { setConnectionStatus, bulkUpdate } = useCryptoStore();
  const socketRef = useRef<WebSocket | null>(null);
  // Копим обновления между интервалами, чтобы не слать по одному
  const pendingRef = useRef<CoinStore>({});

  const productIdsKey = productIds.join(',');

  useEffect(() => {
    if (!productIds.length) return;

    const socket = new WebSocket('wss://advanced-trade-ws.coinbase.com');
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus('open');
      socket.send(
        JSON.stringify({
          type: 'subscribe',
          product_ids: productIds,
          channel: 'ticker',
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const parsed = mapSocketData(JSON.parse(event.data));
        if (parsed) {
          pendingRef.current[parsed.symbol] = { price: parsed.data.price };
        }
      } catch {
        // ignore parse errors
      }
    };

    socket.onerror = () => setConnectionStatus('error');
    socket.onclose = () => setConnectionStatus('closed');

    // Обновляем стор раз в секунду батчем
    const intervalId = setInterval(() => {
      if (Object.keys(pendingRef.current).length > 0) {
        bulkUpdate(pendingRef.current);
        pendingRef.current = {};
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
    // productIdsKey стабилизирует deps без постоянных пересозданий
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIdsKey]);
}

export default useWebSocket;
