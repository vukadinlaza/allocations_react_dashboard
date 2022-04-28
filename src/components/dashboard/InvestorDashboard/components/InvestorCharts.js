/* eslint-disable no-unused-vars */

import React from 'react';
import moment from 'moment';
import { Paper, Grid } from '@material-ui/core';
import { Typography, colors as allocationsColors } from '@allocations/design-system';
import { getMomentFromId, sortByNumber } from '@allocations/nextjs-common';
import 'chartjs-plugin-datalabels';
import { DoughnutChart, LineChart, DefaultChartTable } from '../../../utils/charts';

export function getColor(i) {
  const colors = [
    allocationsColors.success[300],
    allocationsColors.primary[500],
    allocationsColors.brand[100],
  ];
  const modulo = i % colors.length;
  const color = colors[modulo];
  return color;
}

const InvestorCharts = ({ classes, userInvestments }) => {
  const setMonthsToShow = (data) => {
    return [...new Set(data.map((item) => getMomentFromId(item._id).format('YYYYMM')))].sort();
  };

  const setLabelsAndData = (data, monthsArray) => {
    const labels = [];
    const chartData = [];

    data.forEach((item) => {
      const multiple = parseFloat(item.dealMultiple);
      const itemMoment = getMomentFromId(item._id);
      const itemMonth = itemMoment.format('YYYYMM');
      const monthsIndex = monthsArray.indexOf(itemMonth);
      const itemLabel = itemMoment.format('MMM YYYY');
      const itemAmount = item.amount * multiple;

      if (labels.includes(itemLabel)) {
        chartData[monthsIndex] += itemAmount;
      } else {
        labels[monthsIndex] = itemLabel;
        chartData[monthsIndex] = itemAmount;
      }
    });

    const nextMonth = moment(monthsArray[monthsArray.length - 1])
      .add(1, 'month')
      .format('MMM YYYY');

    labels.push(nextMonth);
    chartData.push(0);

    return { labels, chartData };
  };

  const getLineChartData = () => {
    const monthsArray = setMonthsToShow(userInvestments);
    const { labels, chartData } = setLabelsAndData(userInvestments, monthsArray);
    let accAmount = 0;

    const steppedData = chartData.map((item) => {
      accAmount += item;
      return accAmount;
    });
    const steppedChartData = { labels, data: steppedData };
    return steppedChartData;
  };

  const getPieChartData = () => {
    return userInvestments
      .sort((a, b) => sortByNumber(a, b, 'amount', 'desc'))
      .map((s, i) => {
        return { label: s.dealName, total: s.amount, backgroundColor: getColor(i) };
      });
  };

  const seriesTotal = userInvestments.length
    ? userInvestments.map((s) => s.amount).reduce((acc, n) => acc + n, 0)
    : 0;

  return (
    <Grid container spacing={2} className={classes.listsContainer}>
      <Grid item xs={1} />
      <Grid item xs={10}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} lg={6} className={classes.chart}>
            <div className={classes.listTitleContainer}>
              <Typography
                component="div"
                content="Portfolio Overview"
                fontWeight={700}
                variant="heading3"
              />
            </div>
            <Grid item xs={12}>
              <Paper elevation={0} className={classes.chartBox}>
                <div className={classes.doughnut}>
                  <DoughnutChart series={getPieChartData()} />
                </div>
                <div className={classes.tableContainer}>
                  <DefaultChartTable
                    series={getPieChartData()}
                    title="Investments"
                    secondColumnHeader="USD"
                    sumLabel="Total"
                    seriesTotal={seriesTotal}
                    seriesLabelKey="label"
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6} className={classes.chart}>
            <div className={classes.listTitleContainer}>
              <Typography
                component="div"
                content="Portfolio Value"
                fontWeight={700}
                variant="heading3"
              />
            </div>
            <Grid item xs={12}>
              <Paper elevation={0} className={classes.chartBox}>
                <LineChart dataset={getLineChartData()} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={false} md={1} />
    </Grid>
  );
};

export default InvestorCharts;
