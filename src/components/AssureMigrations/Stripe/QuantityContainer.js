import React from 'react';
import { Grid } from '@material-ui/core';
import { colors, Typography, Icon } from '@allocations/design-system';
import { amountFormat } from '@allocations/nextjs-common';

import { currentPrice } from './constants';
import useStyles from '../styles';

export default function QuantityContainer({ quantity, setQuantity }) {
  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.quantityContainer}>
      <Grid
        item
        md={6}
        xs={12}
        className={classes.bottomInformation}
        style={{ alignItems: 'flex-start' }}
      >
        <Typography
          variant="paragraph3"
          fontWeight={500}
          content="SPV Self Service Migration"
          component="div"
        />
        <div className={classes.quantity}>
          <Typography
            variant="paragraph3"
            fontColor="#64748B"
            fontWeight={400}
            content="SPV Quantity:"
            component="span"
          />
          <span className={classes.quantityModifier}>
            <Icon
              iconColor={colors.brand[300]}
              iconName="remove_circle"
              onClick={() => {
                if (quantity === 1) return;
                const newQuantity = quantity - 1;
                setQuantity(newQuantity);
              }}
              small
            />
          </span>
          <Typography
            variant="caption"
            fontColor="#64748B"
            fontWeight={400}
            content={quantity}
            component="span"
          />
          <span className={classes.quantityModifier}>
            <Icon
              iconColor={colors.brand[300]}
              iconName="add_circle"
              onClick={() => {
                const newQuantity = quantity + 1;
                setQuantity(newQuantity);
              }}
              small
            />
          </span>
        </div>
      </Grid>
      <Grid
        item
        md={6}
        xs={12}
        style={{ alignItems: 'flex-end' }}
        className={classes.bottomInformation}
      >
        <Typography
          variant="heading3"
          fontWeight={700}
          content={`$${amountFormat(currentPrice * quantity)}`}
          component="div"
        />
        <Typography
          variant="paragraph3"
          fontColor="#64748B"
          fontWeight={400}
          content="$99.00 each billed monthly"
          component="div"
        />
      </Grid>
    </Grid>
  );
}
