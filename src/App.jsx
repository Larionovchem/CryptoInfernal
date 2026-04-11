import { useCryptoStore } from "./components/useCryptoStore";
import useWebSocket from "./components/cryptoptable/useWebSocket";
const App = () => {
  const { coins, connectionStatus } = useCryptoStore();
  useWebSocket();
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center text-blue-600">
        CryptoInfernal
      </h1>
      <h1>Валюта: {Object.keys(coins)}</h1>
      <h1>Соединение: {connectionStatus}</h1>
      <h1>Цена: {coins?.BTC?.price}</h1>
    </div>
  );
};

export default App;
