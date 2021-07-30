import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { SimpleBox } from '../widgets';
import { nWithCommas } from '../../../../utils/numbers';

const Overview = ({ classes, data }) => {
  const { AUM, SPVs, funds, investors } = data;
  return (
    <Grid container spacing={3} className={classes.section} style={{ marginTop: '-15px' }}>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total AUM">
          <Typography style={{ fontSize: '26px' }}>${nWithCommas(AUM || 0)}</Typography>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total Funds">
          <Typography style={{ fontSize: '26px' }}>{nWithCommas(funds || 0)}</Typography>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total SPVs">
          <Typography style={{ fontSize: '26px' }}>{nWithCommas(SPVs || 0)}</Typography>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total Investors">
          <Typography style={{ fontSize: '26px' }}>{nWithCommas(investors || 0)}</Typography>
        </SimpleBox>
      </Grid>
    </Grid>
  );
};

export default Overview;
