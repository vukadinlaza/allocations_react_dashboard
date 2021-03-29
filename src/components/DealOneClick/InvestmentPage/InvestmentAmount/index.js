import React from 'react';
import { Button, TextField } from '@material-ui/core';
import './styles.scss';

function InvestmentAmountPanel({ setAmount, amount, minimumInvestment, maximumInvestment }) {

  const handleClick = ({ target }) => {
    maximumInvestment && target.name === 'max-investment' && setAmount(maximumInvestment)
    minimumInvestment && target.name === 'min-investment' && setAmount(minimumInvestment)
  }

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
          <Button
            onClick={handleClick}
            name="min-investment"
            className="min-investment-button"
          >
            Min investment
          </Button>

          <Button
            onClick={handleClick}
            name="max-investment"
            className="max-investment-button"
          >
            Max investment
          </Button>
        </div>
      </div>
    </section>
  );
}

export default InvestmentAmountPanel;
