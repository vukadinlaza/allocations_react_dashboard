import React from 'react';
import { Button } from '@material-ui/core';
import './styles.scss';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

function InvestmentAmountPanel({ setAmount, amount, minimumInvestment }) {
  return (
    <section className="InvestmentAmountPanel">
      <p className="section-label">Investment Amount</p>
      <div className="investment-amount-container">
        <CurrencyTextField
          className="investment-amount-input"
          variant="outlined"
          value={amount}
          placeholder={minimumInvestment}
          currencySymbol="$"
          textAlign="left"
          outputFormat="string"
          decimalCharacter="."
          digitGroupSeparator=","
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && amount === minimumInvestment) setAmount('');
          }}
          onChange={(event, value) => setAmount(value.toString())}
        />

        <Button
          onClick={() => setAmount(minimumInvestment !== null && minimumInvestment ? minimumInvestment : '1000')}
          name="min-investment"
          className="min-investment-button"
        >
          Minimum investment
        </Button>
      </div>
    </section>
  );
}

export default InvestmentAmountPanel;
