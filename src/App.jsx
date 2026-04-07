import useWebSocket from "./components/cryptoptable/useWebSocket";
const App = () => {
  const { massage, isConnection } = useWebSocket();
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center text-blue-600">
        CryptoInfernal
      </h1>
      <h1>Цена: {massage?.events?.[0]?.tickers?.[0]?.price}</h1>
      <h1>Соединение: {isConnection ? "Есть" : "Нет"}</h1>
    </div>
  );
};

export default App;
