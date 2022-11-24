import { colors, Typography, Icon } from '@allocations/design-system';
import React from 'react';
import useStyles from '../styles';

const paymentMethods = [
  {
    name: 'bank',
    icon: 'account_balance',
    label: 'US Bank Account',
  },
  {
    name: 'card',
    icon: 'credit_card',
    label: 'Card',
  },
];

export default function PaymentMethods({ setMethod, method }) {
  const classes = useStyles();

  return (
    <div className={classes.paymentMethods}>
      {paymentMethods.map((pm, index) => (
        <span
          className={classes.paymentMethod}
          onClick={() => setMethod(pm.name)}
          style={{ borderColor: pm.name === method ? colors.brand[300] : '#64748B' }}
          key={`pm-${index}`}
        >
          <div
            style={{
              height: '24px',
            }}
          >
            <Icon
              iconName={pm.icon}
              iconColor={pm.name === method ? colors.brand[300] : '#64748B'}
            />
          </div>
          <div style={{ height: '24px' }}>
            <Typography
              variant="paragraph3"
              fontColor={pm.name === method ? colors.brand[300] : '#64748B'}
              fontWeight={500}
              content={pm.label}
              component="span"
            />
          </div>
        </span>
      ))}
    </div>
  );
}
