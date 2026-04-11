import { create } from "zustand";

export const useCryptoStore = create((set) => ({
  coins: {},
  connectionStatus: "connecting",
  setCoins: (data) => set({ coins: data }),
  setConnectionStatus: (data) => set({ connectionStatus: data }),

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
