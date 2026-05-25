import { create } from 'zustand';
import type { CoinStore } from '../types/crypto';

type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';

interface CryptoState {
  coins: CoinStore;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  updateCoin: (symbol: string, data: { price: number }) => void;
  bulkUpdate: (updates: CoinStore) => void;
}

export const useCryptoStore = create<CryptoState>((set) => ({
  coins: {},
  connectionStatus: 'connecting',

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  updateCoin: (symbol, data) =>
    set((state) => ({
      coins: {
        ...state.coins,
        [symbol]: { ...state.coins[symbol], ...data },
      },
    })),

  // для батчевых обновлений из WebSocket
  bulkUpdate: (updates) =>
    set((state) => ({
      coins: { ...state.coins, ...updates },
    })),
}));
