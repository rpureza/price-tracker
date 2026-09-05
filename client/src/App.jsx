import { useState, useEffect } from 'react';
import CoinList from './components/CoinList';
import AddCoinForm from './components/AddCoinForm';
import './App.css';

const API_BASE = 'https://price-tracker-dkuw.onrender.com';

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/tracked`);
      if (!res.ok) throw new Error('Failed to fetch tracked coins');
      const data = await res.json();
      setCoins(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleAddCoin = async (newCoin) => {
    try {
      const res = await fetch(`${API_BASE}/api/tracked`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoin)
      });
      if (!res.ok) throw new Error('Failed to add coin');
      await fetchCoins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCoin = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/tracked/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete coin');
      await fetchCoins();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <h1>Price Tracker</h1>
      <p className="subtitle">
        Track crypto prices and get email alerts when they cross your threshold.
      </p>

      <AddCoinForm onAdd={handleAddCoin} />

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading tracked coins...</p>
      ) : (
        <CoinList coins={coins} onDelete={handleDeleteCoin} />
      )}
    </div>
  );
}

export default App;