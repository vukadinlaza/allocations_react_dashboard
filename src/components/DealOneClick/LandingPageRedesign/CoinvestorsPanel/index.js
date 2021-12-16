import React, { useEffect } from 'react';
import { Paper, Box } from '@material-ui/core';
import useStyles from '../DealStyles';

function CoinvestorsPanel({ deal }) {
  const { coinvestors } = deal;

  const classes = useStyles();

  const coinvestorItems = (deal.coinvestors || []).map((item) => {
    return <li>{item}</li>;
  });

  return (
    <Paper className={classes.dealHeader}>
      <Box className={classes.box}>
        <h5>Co-Investors/Previous Investors</h5>
      </Box>

      <Box className={classes.box}>
        <div className={classes.coinvestorTagBubble}>
          <span className={classes.coinvestorTagText}>Place Holder</span>
        </div>
        <div className={classes.coinvestorTagBubble}>
          <span className={classes.coinvestorTagText}>Place Holder</span>
        </div>
        <div className={classes.coinvestorTagBubble}>
          <span className={classes.coinvestorTagText}>Place Holder</span>
        </div>
      </Box>
    </Paper>
  );
}

export default CoinvestorsPanel;
