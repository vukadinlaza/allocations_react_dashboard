import React from 'react';
import { Grid, Button } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { PanelContainer, PanelLabel } from '../../../Panel';
import useStyles, { Adornment } from './styles';
import { nWithCommas } from '../../../../utils/numbers';

const InvestmentAmountPanel = ({ setAmount, amount, minimumInvestment, isFromModal = false }) => {
  const classes = useStyles();
  const placeHolder =
    minimumInvestment !== null && minimumInvestment ? nWithCommas(minimumInvestment) : '1,000';
  return (
    <PanelContainer isFromModal={isFromModal}>
      <PanelLabel label="Investment Amount" isFromModal={isFromModal} />
      <Grid container justifyContent="space-between" wrap="nowrap" className={classes.root}>
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
            decimalPlaces={2}
            digitGroupSeparator=","
            onChange={(_, value) => setAmount(value.toString())}
            modifyValueOnWheel="false"
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
