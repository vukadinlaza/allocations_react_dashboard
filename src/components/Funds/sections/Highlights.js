import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { SimpleBox } from '../../admin/FundManagerDashboard/widgets';

const styles = (theme) => ({});

const Highlights = ({ classes, history }) => {
  return (
    <Grid container spacing={3} className={classes.section}>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total Private Funds">
          <Typography style={{ fontSize: '26px' }}>245</Typography>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total Funds">
          <Typography style={{ fontSize: '26px' }}>40</Typography>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total SPVs">
          <Typography style={{ fontSize: '26px' }}>115</Typography>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox size="fourth" title="Total Investments">
          <Typography style={{ fontSize: '26px' }}>432</Typography>
        </SimpleBox>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(Highlights));
