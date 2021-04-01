import React from 'react';
import { Button, TextField, InputAdornment } from '@material-ui/core';
import './styles.scss';

function InvestmentAmountPanel({ setAmount, amount, minimumInvestment, maximumInvestment }) {

  return (
    <section className="InvestmentAmountPanel">
      <p className="section-label">Investment Amount</p>

      <div className="investment-amount-container">
        <TextField
          className="investment-amount-input"
          variant="outlined"
          placeholder="Enter investment amount"
          value={amount}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="buttons">
          <Button
            disabled={minimumInvestment === null}
            onClick={() => setAmount(minimumInvestment)}
            name="min-investment"
            className={`min-investment-button ${maximumInvestment === null && 'disabled'}`}
          >
            Min investment
          </Button>

          <Button
            disabled={maximumInvestment === null}
            onClick={() => setAmount(maximumInvestment)}
            name="max-investment"
            className={`max-investment-button ${maximumInvestment === null && 'disabled'}`}
          >
            Max investment
          </Button>
        </div>
      </div>
    </section>
  );
}

export default InvestmentAmountPanel;
