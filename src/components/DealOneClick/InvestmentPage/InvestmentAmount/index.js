import React from 'react';
import { Grid, Button } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { PanelContainer, PanelLabel } from '../../../Panel';
import useStyles, { Adornment } from './styles';
import { nWithCommas } from '../../../../utils/numbers';

const InvestmentAmountPanel = ({ setAmount, amount, minimumInvestment }) => {
  const classes = useStyles();
  const placeHolder =
    minimumInvestment !== null && minimumInvestment ? nWithCommas(minimumInvestment) : '1,000';
  return (
    <PanelContainer>
      <PanelLabel label="Investment Amount" />
      <Grid container justifyContent="space-between" className={classes.root}>
        <Grid item className={classes.inputContainer} xs={12} md={7} lg={7}>
          <CurrencyTextField
            InputProps={{
              startAdornment: <Adornment position="start">$</Adornment>,
            }}
            style={{ width: '100%' }}
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
            onChange={(_, value) => setAmount(value.toString())}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={4} className={classes.buttonContainer}>
          <Button
            className={classes.currencyButton}
            onClick={() =>
              setAmount(
                minimumInvestment !== null && minimumInvestment ? minimumInvestment : '1000',
              )
            }
            name="min-investment"
          >
            Minimum investment
          </Button>
        </Grid>
      </Grid>
    </PanelContainer>
  );
};

export default InvestmentAmountPanel;
