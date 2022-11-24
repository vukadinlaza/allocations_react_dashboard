import { Button, Logo, Typography } from '@allocations/design-system';
import { openInNewTab } from '@allocations/nextjs-common';
import { Paper } from '@material-ui/core';
import React from 'react';
import useStyles from '../styles';

export default function Congratulations() {
  const classes = useStyles();

  return (
    <Paper className={classes.thankyou}>
      <Logo width={300} />
      <div className={classes.thankyouText}>
        <Typography content="Congratulations!" variant="heading4" fontWeight={500} />
      </div>
      <Typography
        variant="paragraph3"
        fontWeight={400}
        content="You are one step further into your migration. Please schedule time below to continue your white-glove migration by clicking the button below. "
        component="div"
        align="center"
      />
      <div style={{ height: '16px' }} />
      <Button
        onClick={() =>
          openInNewTab('https://info.allocations.com/meetings/carlos-biazotto/assure-migrations')
        }
        text="Schedule Now"
      />
    </Paper>
  );
}
