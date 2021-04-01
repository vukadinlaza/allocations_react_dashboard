import React from 'react';
import { Button } from '@material-ui/core';
import './styles.scss';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'


function InvestmentAmountPanel({ setAmount, amount, minimumInvestment, maximumInvestment }) {

  const [value, setValue] = React.useState();


  return (
    <section className="InvestmentAmountPanel">
      <p className="section-label">Investment Amount</p>

      <div className="investment-amount-container">
        <CurrencyTextField
          className="investment-amount-input"
          variant="outlined"
          value={amount}
          currencySymbol="$"
          //minimumValue="0"
          textAlign="left"
          outputFormat="string"
          decimalCharacter="."
          digitGroupSeparator=","
          onChange={(event, value) => setAmount(value)}
        />

        <div className="buttons">
          <Button
            onClick={() => setAmount(1000)}
            name="min-investment"
            className={'min-investment-button'}
          >
            Min investment
          </Button>
        </div>
      </div>
    </section>
  );
}

export default InvestmentAmountPanel;
