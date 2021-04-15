import React from 'react';
import './styles.scss';

function CoinvestorsPanel({ deal }) {
  const coinvestorItems = (deal.coinvestors || []).map((item) => {
    return <li>{item}</li>;
  });

  return coinvestorItems.length > 0 ? (
    <section className="CoinvestorsPanel">
      <p className="section-label">Coinvestors</p>
      <ul>{coinvestorItems}</ul>
    </section>
  ) : null;
}

export default CoinvestorsPanel;
