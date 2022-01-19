/* eslint-disable no-param-reassign */
/* eslint-disable radix */
import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';
import Loader from '../../../../utils/Loader';
import { nWithCommas } from '../../../../../utils/numbers';
import { DefaultChartTable, DoughnutChart, LineChart } from '../../../../utils/charts';
import { SimpleBox, ChartBox } from '../../../FundManagerDashboard/widgets';
import { nestedSort, getMomentFromId } from '../../../../../utils/helpers';

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

const Highlights = ({ classes, data }) => {
  const [openTooltip, setOpenTooltip] = useState('');

  const setMonthsToShow = (data) => {
    return [...new Set(data.map((item) => getMomentFromId(item._id).format('YYYYMM')))].sort();
  };

  const setLabelsAndData = (data, monthsArray) => {
    const labels = [];
    const chartData = [];

    data.forEach((item) => {
      const multiple = parseFloat(item.deal?.dealParams?.dealMultiple || '1');
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

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };

  if (!data) return <Loader />;

  const series = data
    .map((s) => {
      return { label: s.deal?.company_name, total: s.amount };
    })
    .sort((a, b) => nestedSort(a, b, 'total', 'desc'));

  const seriesTotal = series.length ? series.map((s) => s.total).reduce((acc, n) => acc + n) : 0;
  const steppedChartData = getSteppedChartData(data);

  const totalInvested = _.sumBy(data, 'amount');
  const portfolioValue = data.reduce((acc, n) => {
    const dealMultiple = _.toNumber(n.deal?.dealParams?.dealMultiple || 1);
    const investmentWithReturn = dealMultiple * n.amount;
    return acc + investmentWithReturn;
  }, 0);
  const avgMultiple = portfolioValue / totalInvested || 1;

  return (
    <Grid container spacing={3} className={classes.section} style={{ paddingTop: '25px' }}>
      <Grid item xs={12} lg={4}>
        <SimpleBox
          size="third"
          title="Portfolio Value"
          info="This is the estimated value of the portfolio"
          handleTooltip={handleTooltip}
          tooltipContent={
            <Typography color="inherit">
              This is the estimated value of the portfolio (Total Invested x Multiple)
            </Typography>
          }
          openTooltip={openTooltip}
          id="inv-portfolio-value"
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>
              ${nWithCommas(portfolioValue.toFixed(0))}
            </Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={4}>
        <SimpleBox
          size="third"
          title="Total Invested"
          handleTooltip={handleTooltip}
          tooltipContent={
            <Typography color="inherit">Total capital invested by the investor</Typography>
          }
          openTooltip={openTooltip}
          id="inv-total-invested"
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>
              ${nWithCommas(totalInvested.toFixed(0))}
            </Typography>
            <Typography className={classes.footerData}>
              {(data || []).length} Total Investments
            </Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={4}>
        <SimpleBox
          size="third"
          title="Estimated Multiple"
          handleTooltip={handleTooltip}
          tooltipContent={
            <Typography color="inherit">
              This is the estimated multiple IRR on the Total Invested amount based on data provided
              by the fund manager. Subject to change and not to be relied upon.
            </Typography>
          }
          openTooltip={openTooltip}
          id="inv-multiple"
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>{avgMultiple.toFixed(2) || 1}x</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={6}>
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
      <Grid item xs={12} lg={6}>
        <ChartBox title="Total Portfolio Value Over Time" info="Explanation">
          <LineChart dataset={steppedChartData} />
        </ChartBox>
      </Grid>
    </Grid>
  );
};

export default Highlights;
