import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { SimpleBox } from '../../admin/FundManagerDashboard/widgets';
import Loader from '../../utils/Loader';
import { nWithCommas } from '../../../utils/numbers';

const styles = (theme) => ({});

const Highlights = ({ data }) => {
  if (!data?.fundAdminHighlights) return <Loader />;
  const { funds, SPVs, investments } = data.fundAdminHighlights;
  const totalFunds = funds + SPVs;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total Private Funds">
          <Typography style={{ fontSize: '26px' }}>{nWithCommas(totalFunds)}</Typography>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total Funds">
          <Typography style={{ fontSize: '26px' }}>{nWithCommas(funds)}</Typography>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total SPVs">
          <Typography style={{ fontSize: '26px' }}>{nWithCommas(SPVs)}</Typography>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total Investments">
          <Typography style={{ fontSize: '26px' }}>{nWithCommas(investments)}</Typography>
        </SimpleBox>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(Highlights));
