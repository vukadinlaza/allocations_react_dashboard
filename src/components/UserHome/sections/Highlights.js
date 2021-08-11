/* eslint-disable no-param-reassign */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';
import Loader from '../../utils/Loader';
import { nWithCommas } from '../../../utils/numbers';
import { DefaultChartTable, DoughnutChart, LineChart } from '../../utils/charts';
import { SimpleBox, ChartBox } from '../../admin/FundManagerDashboard/widgets';
import { nestedSort } from '../../../utils/helpers';

export function getColor(i) {
  const colors = ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C'];
  const modulo = i % colors.length;
  const color = colors[modulo];
  return color;
}

export function formatDoughnutSeries(series) {
  return series.map(({ label, total }, i) => {
    return {
      label,
      total,
      backgroundColor: getColor(i),
    };
  });
}

const Highlights = ({ classes, data, userProfile, refetch }) => {
  const setMonthsToShow = (data) => {
    return [...new Set(data.map((item) => moment(item.Date).format('YYYYMM')))].sort();
  };

  const setLabelsAndData = (data, monthsArray) => {
    const labels = [];
    const chartData = [];

    data.forEach((item) => {
      const itemMonth = moment(item.Date).format('YYYYMM');
      const monthsIndex = monthsArray.indexOf(itemMonth);
      const itemLabel = moment(item.Date).format('MMM YYYY');
      const itemAmount = item.amount;
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

  const getSteppedChartData = (data) => {
    const monthsArray = setMonthsToShow(data);
    const { labels, chartData } = setLabelsAndData(data, monthsArray);
    let accAmount = 0;

    const steppedData = chartData.map((item) => {
      accAmount += item;
      return accAmount;
    });
    const steppedChartData = { labels, data: steppedData };
    return steppedChartData;
  };

  if (!data || !data.length) return <Loader />;

  const series = data
    .map((s) => {
      return { label: s.deal?.company_name, total: s.amount };
    })
    .sort((a, b) => nestedSort(a, b, 'total', 'desc'));
  const seriesTotal = series.length ? series.map((s) => s.total).reduce((acc, n) => acc + n) : 0;
  const steppedChartData = getSteppedChartData(data);
  const multiplesTotal = data.reduce((acc, n) => {
    const dealMultiple = _.toNumber(n.deal?.dealData?.dealParams?.dealMultiple || 1);
    return acc + dealMultiple;
  }, 0);
  const avgMultiple = multiplesTotal / data.length;

  return (
    <Grid container spacing={3} className={classes.section}>
      <Grid item xs={12} lg={4}>
        <SimpleBox
          size="third"
          title="Portfolio Value"
          info="This is the estimated value of the portfolio"
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>
              $
              {nWithCommas(
                (_.sumBy(data, 'amount') * (avgMultiple === 0 ? 1 : avgMultiple)).toFixed(0),
              )}
            </Typography>
            <Typography className={classes.footerData}>0% Realized | 100% Unrealized</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={4}>
        <SimpleBox
          size="third"
          title="Total amount"
          info="This is the total amount invested on the platform"
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>
              ${nWithCommas(_.sumBy(data, 'amount').toFixed(0))}
            </Typography>
            <Typography className={classes.footerData}>
              {(data || []).length} Total Investments
            </Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={4}>
        <SimpleBox size="third" title="Multiple" info="Explanation">
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>{avgMultiple.toFixed(2) || 1}x</Typography>
            <Typography className={classes.footerData}>Last Updated: June 1st, 2021</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item lg={6}>
        <ChartBox title="Portfolio Overview" info="Explanation">
          <div className={classes.chartContainer}>
            <DoughnutChart series={formatDoughnutSeries(series)} />
          </div>
          <div className={classes.chartTableContainer}>
            <DefaultChartTable
              series={formatDoughnutSeries(series)}
              title="Investments"
              secondColumnHeader="USD"
              sumLabel="Total"
              seriesTotal={seriesTotal}
              seriesLabelKey="label"
            />
          </div>
        </ChartBox>
      </Grid>
      <Grid item lg={6}>
        <ChartBox title="Value" info="Explanation">
          <LineChart dataset={steppedChartData} />
        </ChartBox>
      </Grid>
    </Grid>
  );
};

export default Highlights;
