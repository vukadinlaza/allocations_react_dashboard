import React from 'react';
import { Paper, Box } from '@material-ui/core';
import useStyles from '../style';

function CoinvestorsPanel() {
  const classes = useStyles();

  return (
    <Paper className={classes.dealHeader}>
      <Box className={classes.box}>
        <span className={classes.investmentProgress}>Co-Investors/Previous Investors</span>
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
