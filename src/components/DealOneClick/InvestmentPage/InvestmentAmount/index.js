import React from 'react';
import { Button, TextField } from '@material-ui/core';
import './styles.scss';

function InvestmentAmountPanel({ setAmount, amount }) {
  return (
    <section className="InvestmentAmountPanel">
      <p className="section-label">Investment Amount</p>

      <div className="investment-amount-container">
        <TextField
          className="investment-amount-input"
          variant="outlined"
          placeholder="Enter investment amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="buttons">
          <Button className="min-investment-button">Min investment</Button>

          <Button className="max-investment-button">Max investment</Button>
        </div>
      </div>
    </section>
  );
}

export default InvestmentAmountPanel;
