import { useState } from 'react';

function AddCoinForm({ onAdd }) {
  const [coinId, setCoinId] = useState('');
  const [threshold, setThreshold] = useState('');
  const [direction, setDirection] = useState('above');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coinId || !threshold) return;

    onAdd({
      coinId: coinId.toLowerCase().trim(),
      threshold: parseFloat(threshold),
      direction
    });

    setCoinId('');
    setThreshold('');
    setDirection('above');
  };

  return (
    <form className="add-coin-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Coin ID (e.g. bitcoin)"
        value={coinId}
        onChange={(e) => setCoinId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Threshold (USD)"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
      />
      <select value={direction} onChange={(e) => setDirection(e.target.value)}>
        <option value="above">Above</option>
        <option value="below">Below</option>
      </select>
      <button type="submit">Add Coin</button>
    </form>
  );
}

export default AddCoinForm;cl