import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CoinDetail from './pages/CoinDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/coin/:id" element={<CoinDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
