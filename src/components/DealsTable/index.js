import React, { useState } from 'react';
import _ from 'lodash';
import { withRouter, useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import { Typography, Grid, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { SimpleBox } from '../admin/FundManagerDashboard/widgets';
import styles from '../admin/FundManagerDashboard/styles';
import { useAuth } from '../../auth/useAuth';
import UserDocuments from './table';
import { nWithCommas } from '../../utils/numbers';

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const spvData = [
  {
    spvName: 'Space X',
    portfolioCompany: 'Space X',
    size: 440000,
    status: 'Complete',
    createdAt: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    wireDeadline: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    manage: 'manage',
  },
  {
    spvName: 'Tundra Trust SPV',
    portfolioCompany: 'Tundra Trust',
    size: 604060,
    status: 'Complete',
    createdAt: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    wireDeadline: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    manage: 'manage',
  },
  {
    spvName: 'Kraken SPV',
    portfolioCompany: 'Kraken',
    size: 103500,
    status: 'Onboarding',
    createdAt: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    wireDeadline: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    manage: 'manage',
  },
  {
    spvName: 'Stripe SPV',
    portfolioCompany: 'Stripe',
    size: Math.round(_.random(43000, 3200000)),
    status: 'Closed',
    createdAt: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    wireDeadline: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    manage: 'manage',
  },
];
const fundData = [
  {
    spvName: 'Sharding Holdings I',
    portfolioCompany: 'Stripe',
    size: 1000000,
    status: 'Complete',
    createdAt: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    firstClose: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    finalClose: moment(randomDate(new Date(2021, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    multiple: 5,
    manage: 'manage',
  },
  {
    spvName: 'Sharding Holdings II',
    portfolioCompany: 'Tundra Trust',
    size: 5000000,
    status: 'Complete',
    createdAt: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    firstClose: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    finalClose: moment(randomDate(new Date(2021, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    multiple: 3,
    manage: 'manage',
  },
  {
    spvName: 'Sharding Holdings III',
    portfolioCompany: 'Axiom Space',
    size: 10000000,
    status: 'Onboarding',
    createdAt: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    firstClose: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    finalClose: moment(randomDate(new Date(2021, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    multiple: 2,
    manage: 'manage',
  },
  {
    spvName: 'Sharding Holdings IV',
    portfolioCompany: 'Revolut',
    size: 15000000,
    status: 'Closed',
    createdAt: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    firstClose: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    finalClose: moment(randomDate(new Date(2021, 0, 1), new Date()).toString()).format(
      'DD MMM YYYY',
    ),
    multiple: 1,
    manage: 'manage',
  },
];

const DealTable = ({ classes }) => {
  const { type } = useParams();

  const data = type === 'spvs' ? spvData : fundData;
  const typeDisplay = type === 'spvs' ? 'SPVs' : 'Funds';

  const [openTooltip, setOpenTooltip] = useState('');

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };

  const totalDeals = data.length;
  const totalAUM = data.reduce((acc, c) => acc + c.size, 0);
  const avgMultiple =
    type === 'spvs' ? 2.5 : data.reduce((acc, c) => acc + c.multiple, 0) / data.length;

  return (
    <Grid container spacing={1} className={classes.section} style={{ paddingTop: '0px' }}>
      <Grid sm={12} lg={12} style={{ margin: '.75rem', fontWeight: '900' }}>
        <Typography color="inherit" variant="h3">
          {typeDisplay}
        </Typography>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox
          size="fourth"
          title={`Total ${typeDisplay}`}
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="totalInvested"
          tooltipContent={
            <Typography color="inherit">Total number of {typeDisplay} you've created</Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>{totalDeals}</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox
          size="fourth"
          title="Total AUM"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="multiple"
          tooltipContent={
            <Typography color="inherit">
              This is the total USD value of assest under management across all your {typeDisplay}.
            </Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>
              ${nWithCommas(Math.round(totalAUM * avgMultiple))}
            </Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox
          size="fourth"
          title="Multiple"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="portfolioValue"
          tooltipContent={
            <Typography color="inherit">
              This is the estimated summed multiple of all your {typeDisplay}.
            </Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}> {avgMultiple}x</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox
          size="fourth"
          title="Total Raised"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="totalRaised"
          tooltipContent={
            <Typography color="inherit">
              This is the total USD value of funds raised across all {typeDisplay}.
            </Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>${nWithCommas(totalAUM)}</Typography>
            {/* <Typography className={classes.footerData}>0% Realized | 100% Unrealized</Typography> */}
          </div>
        </SimpleBox>
      </Grid>

      <Grid sm={12} lg={12}>
        {/* <Paper
          style={{
            margin: '.5rem',
            background: '#FBFCFF 0% 0% no-repeat padding-box',
            boxShadow: '0px 3px 6px #00000029',
            border: '1px solid #8493A640',
            borderRadius: '10px',
          }}
        > */}
        <div className={classes.contentContainer}>
          <UserDocuments data={data} type={type} />
        </div>
        {/* </Paper> */}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(DealTable));
