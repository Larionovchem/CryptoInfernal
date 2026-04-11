export const mapCoin = (coin) => {
  return {
    symbol: coin.symbol?.toUpperCase(),
    price: coin?.current_price,
    volume: coin?.total_volume,
    change24h: coin?.price_change_percentage_24h,
    image: coin?.image,
  };
};

export const normalizeCoins = (coinsArray) => {
  return coinsArray.reduce((acc, cur) => {
    const map = mapCoin(cur);
    acc[map.symbol] = map;
    return acc;
  }, {});
};

export const mapSocketData = (data) => {
  const ticker = data.events?.[0]?.tickers?.[0];
  if (!ticker) return null;
  return {
    symbol: ticker.product_id.split("-")[0],
    data: { price: Number(ticker.price) },
  };
};
