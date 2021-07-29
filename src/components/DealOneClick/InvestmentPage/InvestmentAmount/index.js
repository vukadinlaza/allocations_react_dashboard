import React from 'react';
import { Button } from '@material-ui/core';
import './styles.scss';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { nWithCommas } from '../../../../utils/numbers';

function InvestmentAmountPanel({ setAmount, amount, minimumInvestment }) {
  const placeHolder =
    minimumInvestment !== null && minimumInvestment ? nWithCommas(minimumInvestment) : '1,000';

  return (
    <section className="InvestmentAmountPanel">
      <p className="section-label">Investment Amount</p>
      <div className="investment-amount-container">
        <CurrencyTextField
          className="investment-amount-input"
          variant="outlined"
          value={amount}
          placeholder={placeHolder}
          currencySymbol="$"
          textAlign="left"
          outputFormat="string"
          decimalCharacter="."
          decimalPlaces={0}
          digitGroupSeparator=","
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && amount === minimumInvestment) setAmount('');
          }}
          onChange={(event, value) => setAmount(value.toString())}
        />

        <Button
          onClick={() =>
            setAmount(minimumInvestment !== null && minimumInvestment ? minimumInvestment : '1000')
          }
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
