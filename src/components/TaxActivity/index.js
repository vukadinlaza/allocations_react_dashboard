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

const data = [
  {
    name: 'Countdown Capital IV',
    portfolioCompany: 'Space X',
    taxYear: '2020',
    investmentDate: moment(
      randomDate(new Date(2019, 0, 1), new Date(2020, 0, 1)).toString(),
    ).format('DD MMM YYYY'),
    taxDeadline: moment(new Date(2020, 0, 9).toString()).format('DD MMM YYYY'),
    extensionDeadline: moment(new Date(2020, 0, 12).toString()).format('DD MMM YYYY'),
    status: 'Ready',
  },
  {
    name: 'Countdown Capital I',
    portfolioCompany: 'Space X',
    taxYear: '2021',
    investmentDate: moment(
      randomDate(new Date(2019, 0, 1), new Date(2020, 0, 1)).toString(),
    ).format('DD MMM YYYY'),
    taxDeadline: moment(new Date(2020, 0, 9).toString()).format('DD MMM YYYY'),
    extensionDeadline: moment(new Date(2020, 0, 12).toString()).format('DD MMM YYYY'),
    status: 'Will not file',
  },
  {
    name: 'Countdown Capital VI',
    portfolioCompany: 'Space X',
    taxYear: '2020',
    investmentDate: moment(
      randomDate(new Date(2019, 0, 1), new Date(2020, 0, 1)).toString(),
    ).format('DD MMM YYYY'),
    taxDeadline: moment(new Date(2020, 0, 9).toString()).format('DD MMM YYYY'),
    extensionDeadline: moment(new Date(2020, 0, 12).toString()).format('DD MMM YYYY'),
    status: 'Ready',
  },
  {
    name: 'Countdown Capital II',
    portfolioCompany: 'Space X',
    taxYear: '2021',
    investmentDate: moment(
      randomDate(new Date(2019, 0, 1), new Date(2020, 0, 1)).toString(),
    ).format('DD MMM YYYY'),
    taxDeadline: moment(new Date(2020, 0, 9).toString()).format('DD MMM YYYY'),
    extensionDeadline: moment(new Date(2020, 0, 12).toString()).format('DD MMM YYYY'),
    status: 'Will not file',
  },
];

const TaxTable = ({ classes }) => {
  return (
    <Grid container spacing={1} className={classes.section} style={{ padding: '0' }}>
      <Grid sm={12} lg={12} style={{ margin: '.75rem', fontWeight: '900' }}>
        <Typography color="inherit" variant="h3">
          Tax Activity
        </Typography>
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
          <UserDocuments data={data} />
        </div>
        {/* </Paper> */}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(TaxTable));

// <Grid item xs={12} lg={3}>
// <SimpleBox
//   size="fourth"
//   title={`Total ${typeDisplay}`}
//   openTooltip={openTooltip}
//   handleTooltip={handleTooltip}
//   id="totalInvested"
//   tooltipContent={
//     <Typography color="inherit">Total number of {typeDisplay} you've created</Typography>
//   }
// >
//   <div
//     className={classes.simpleBoxDataRow}
//     style={{ flexDirection: 'column', alignItems: 'flex-start' }}
//   >
//     <Typography style={{ fontSize: '26px' }}>{totalDeals}</Typography>
//   </div>
// </SimpleBox>
// </Grid>
// <Grid item xs={12} lg={3}>
// <SimpleBox
//   size="fourth"
//   title="Total AUM"
//   openTooltip={openTooltip}
//   handleTooltip={handleTooltip}
//   id="multiple"
//   tooltipContent={
//     <Typography color="inherit">
//       This is the total USD value of assest under management across all your {typeDisplay}.
//     </Typography>
//   }
// >
//   <div
//     className={classes.simpleBoxDataRow}
//     style={{ flexDirection: 'column', alignItems: 'flex-start' }}
//   >
//     <Typography style={{ fontSize: '26px' }}>
//       ${nWithCommas(Math.round(totalAUM * 4.3))}.00
//     </Typography>
//     <Typography className={classes.footerData}>Last Updated: June 1st, 2021</Typography>
//   </div>
// </SimpleBox>
// </Grid>
// <Grid item xs={12} lg={3}>
// <SimpleBox
//   size="fourth"
//   title="Multiple"
//   openTooltip={openTooltip}
//   handleTooltip={handleTooltip}
//   id="portfolioValue"
//   tooltipContent={
//     <Typography color="inherit">
//       This is the estimated summed multiple of all your {typeDisplay}.
//     </Typography>
//   }
// >
//   <div
//     className={classes.simpleBoxDataRow}
//     style={{ flexDirection: 'column', alignItems: 'flex-start' }}
//   >
//     <Typography style={{ fontSize: '26px' }}> 4.3x</Typography>
//   </div>
// </SimpleBox>
// </Grid>
// <Grid item xs={12} lg={3}>
// <SimpleBox
//   size="fourth"
//   title="Total Raised"
//   openTooltip={openTooltip}
//   handleTooltip={handleTooltip}
//   id="totalRaised"
//   tooltipContent={
//     <Typography color="inherit">
//       This is the total USD value of funds raised across all {typeDisplay}.
//     </Typography>
//   }
// >
//   <div
//     className={classes.simpleBoxDataRow}
//     style={{ flexDirection: 'column', alignItems: 'flex-start' }}
//   >
//     <Typography style={{ fontSize: '26px' }}>${nWithCommas(totalAUM)}.00</Typography>
//     {/* <Typography className={classes.footerData}>0% Realized | 100% Unrealized</Typography> */}
//   </div>
// </SimpleBox>
// </Grid>
