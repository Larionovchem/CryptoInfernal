import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCryptoStore } from '../../store/useCryptoStore';

const STATUS_COLORS = {
  open: 'bg-[#0ecb81]',
  connecting: 'bg-yellow-400',
  closed: 'bg-[#848e9c]',
  error: 'bg-[#f6465d]',
};

export default function Navbar() {
  const connectionStatus = useCryptoStore((s) => s.connectionStatus);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[#2b2f36] bg-[#1e2026]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#f0b90b]">
          <span className="text-2xl">₿</span>
          CryptoDash
        </Link>

        <form onSubmit={handleSearch} className="hidden md:block">
          <input
            type="text"
            placeholder="Search coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded bg-[#2b2f36] px-3 py-1.5 text-sm text-white placeholder-[#848e9c] outline-none focus:ring-1 focus:ring-[#f0b90b]"
          />
        </form>

        <div className="flex items-center gap-2 text-sm text-[#848e9c]">
          <span
            className={`inline-block h-2 w-2 rounded-full ${STATUS_COLORS[connectionStatus]}`}
          />
          <span className="hidden sm:inline capitalize">{connectionStatus}</span>
        </div>
      </div>
    </header>
  );
}
