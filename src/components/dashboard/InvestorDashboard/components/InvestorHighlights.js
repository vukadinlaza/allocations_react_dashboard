/* eslint-disable no-unused-vars */

import React, { useMemo } from 'react';
import { Grid } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import 'chartjs-plugin-datalabels';
import { Box } from '../../Common/components';

const InvestorHighlights = ({ classes, userInvestments }) => {
  const abbreviateAmount = (amount) => {
    const multipleMap = ['', 'k', 'm', 'b'];
    const amountLength = amount.toString().length;
    const thousandsMultiple = Math.floor((amountLength - 1) / 3);
    const abbreviated = (amount / (1000 ** thousandsMultiple || 1)).toFixed(2);
    return `${abbreviated}${multipleMap[thousandsMultiple]}`;
  };

  const getDashboardBoxes = () => {
    const portfolioValue =
      userInvestments
        ?.map((investment) => investment.amount * Number(investment.dealMultiple))
        .reduce((acc, n) => acc + n, 0) || 0;
    const totalInvested = userInvestments.map((i) => i.amount).reduce((acc, n) => acc + n, 0);
    const estimatedMultiple = (portfolioValue / (totalInvested || 1)).toFixed(2);
    const totalInvestments = userInvestments.length;

    const dashboardBoxes = [
      {
        title: 'Portfolio Value',
        value: `$${abbreviateAmount(Math.round(portfolioValue))}`,
      },
      {
        title: 'Total Invested',
        value: `$${abbreviateAmount(Math.round(totalInvested))}`,
      },
      {
        title: 'Est. Multiple',
        value: `${estimatedMultiple}x`,
      },
      {
        title: 'Total Investments',
        value: totalInvestments,
      },
    ];
    return dashboardBoxes;
  };

  const dashboardBoxes = useMemo(() => getDashboardBoxes(), [userInvestments]);

  return (
    <>
      <Grid container spacing={2} className={classes.computerBoxes}>
        <Grid item xs={1} />
        {dashboardBoxes.map((box) => (
          <Box key={uuidv4()} box={box} />
        ))}
        <Grid item xs={1} />
      </Grid>
      <Grid container spacing={2} className={classes.mobileBoxes}>
        {dashboardBoxes.map((box) => (
          <Grid container spacing={2} key={uuidv4()} className={classes.box}>
            <Grid item xs={1} />
            <Box box={box} />
            <Grid item xs={1} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default InvestorHighlights;
