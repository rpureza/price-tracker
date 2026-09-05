function CoinList({ coins, onDelete }) {
  if (coins.length === 0) {
    return <p>No coins tracked yet. Add one above.</p>;
  }

  return (
    <ul className="coin-list">
      {coins.map((coin) => (
        <li key={coin._id} className="coin-item">
          <span>
            <strong>{coin.coinId}</strong> — alert when price is{' '}
            {coin.direction} ${coin.threshold}
          </span>
          <button onClick={() => onDelete(coin._id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}

export default CoinList;