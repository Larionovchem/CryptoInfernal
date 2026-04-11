import { useState, useEffect } from "react";
import { useCryptoStore } from "../useCryptoStore";
import { normalizeCoins } from "../utils/mapper";

function useCoinsList() {
  const [isloading, setisloading] = useState(true);
  const { setCoins } = useCryptoStore();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
          { signal },
        );
        if (!response.ok) {
          throw new Error("Нет загрузки первых 100");
        }
        const data = await response.json();
        const objectCoins = normalizeCoins(data);
        setCoins(objectCoins);
        setisloading(false);
      } catch (e) {
        if (e.name != "AbortError") {
          console.log(e);
        }
        setisloading(false);
      }
    };
    fetchCoins();
    return () => {
      controller.abort();
    };
  }, []);
  return { isloading };
}

export default useCoinsList;
