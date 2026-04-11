import { create } from "zustand";

export const useCryptoStore = create((set) => ({
  coins: {},
  connectionStatusWebSocket: "connecting",
  setCoins: (data) => set({ coins: data }),
  setConnectionStatusWebSocket: (data) =>
    set({ connectionStatusWebSocket: data }),

  updateCoin: (sym, particalData) =>
    set((state) => ({
      coins: {
        ...state.coins,
        [sym]: {
          ...(state.coins[sym] || {}),
          ...particalData,
        },
      },
    })),
}));
