import React, { useState } from 'react';

import { Button, ButtonGroup } from '@material-ui/core';
import useStyles from '../styles';
// import CardCheckout from './CardCheckout';
// import BankCheckout from './BankCheckout';

const CheckoutForm = () => {
  const styles = useStyles();
  const [selectedForm, setSelectedForm] = useState('bank');

  // const forms = {
  //   card: CardCheckout,
  //   bank: BankCheckout,
  // };
  // console.log(forms[selectedForm], 'ELEMENTS');
  return (
    <ButtonGroup
      classes={{
        groupedOutlinedHorizontal: styles.groupedOutlinedHorizontalOverride,
        groupedHorizontal: styles.groupedHorizontalOverride,
      }}
    >
      {[
        { label: 'US Bank Account', value: 'bank' },
        { label: 'Card', value: 'card' },
      ].map((choice) => (
        <Button
          key={choice}
          name={choice.value}
          variant={selectedForm === choice.value ? 'contained' : 'outlined'}
          color="primary"
          className={styles.button}
          classes={{
            containedPrimary: styles.containedOverride,
            root: styles.rootOverride,
          }}
          onClick={() => {
            setSelectedForm(choice.value);
          }}
        >
          {choice.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default CheckoutForm;
