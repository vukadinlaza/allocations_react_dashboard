import React from 'react';
import { Button, Typography } from '@material-ui/core';
import './styles.scss';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { nWithCommas } from '../../../../utils/numbers';

function InvestmentAmountPanel({ setAmount, amount, userMax, totalInvested }) {
  console.log('amount', amount);

  // eslint-disable-next-line radix
  const aboveLimit = totalInvested + parseInt(amount) > userMax;

  return (
    <section className="InvestmentAmountPanel">
      <p className="section-label">Investment Amount</p>
      <div className="investment-amount-container">
        <CurrencyTextField
          className="investment-amount-input"
          variant="outlined"
          value={amount}
          placeholder="1,000.00"
          currencySymbol="$"
          textAlign="left"
          outputFormat="string"
          decimalCharacter="."
          digitGroupSeparator=","
          onChange={(event, value) => setAmount(value.toString())}
        />

        <Button onClick={() => setAmount('1000')} name="min-investment" className="min-investment-button">
          Minimum investment
        </Button>
      </div>
      <div className="subtitleText">
        <Typography variant="subtitle2">
          This amount is {aboveLimit ? 'not' : ''} within your remaining investing limit (${nWithCommas(userMax)}.00).
          To update your limit, please <a href="mailto:support@allocations.com">contact us.</a>
        </Typography>
      </div>
    </section>
  );
}

export default InvestmentAmountPanel;
