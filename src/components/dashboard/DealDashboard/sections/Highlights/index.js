import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Typography, Grid } from '@material-ui/core';
import { colors as allocationsColors } from '@allocations/design-system';
import { DefaultChartTable, DoughnutChart, LineChart } from '../../../../utils/charts';
import { SimpleBox, ChartBox } from '../../widgets';
import { nWithCommas } from '../../../../../utils/numbers';
import { nestedSort } from '../../../../../utils/helpers';
import Loader from '../../../../utils/Loader';
import 'chartjs-plugin-datalabels';

export function getColor(i) {
  const colors = [
    allocationsColors.primary[100],
    allocationsColors.primary[400],
    allocationsColors.success[300],
    allocationsColors.success[600],
  ];
  const modulo = i % colors.length;
  const color = colors[modulo];
  return color;
}

export function formatDoughnutSeries(series) {
  return series.map((s, i) => {
    return {
      backgroundColor: getColor(i),
      label: s.label,
      total: s.total,
    };
  });
}

const Highlights = ({ classes, data, dealData, openTooltip, handleTooltip }) => {
  const dealMultiple = _.toNumber(dealData?.deal?.dealParams?.dealMultiple || 1);

  const setMonthsToShow = (data) => {
    const monthsArray = [];

    data.forEach((item) => {
      const itemMonth = moment(item.Date).format('YYYYMM');
      if (!monthsArray.includes(itemMonth)) monthsArray.push(itemMonth);
    });
    monthsArray.sort();

    return monthsArray;
  };

  const setLabelsAndData = (data, monthsArray) => {
    const labels = [];
    const chartData = [];

    data.forEach((item) => {
      const itemMonth = moment(item.Date).format('YYYYMM');
      const monthsIndex = monthsArray.indexOf(itemMonth);
      const itemLabel = moment(item.Date).format('MMM YYYY');
      const itemAmount = item.Invested * dealMultiple;
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

  const getSteppedChartData = () => {
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

  if (!data) return <Loader />;

  const series = data
    .map((s) => {
      return { label: s.Investment, total: s.Invested };
    })
    .sort((a, b) => nestedSort(a, b, 'total', 'desc'));
  const seriesTotal = series.length ? series.map((s) => s.total).reduce((acc, n) => acc + n, 0) : 0;
  const steppedChartData = getSteppedChartData();

  const investments = dealData?.deal?.investments?.length && dealData.deal.investments;

  const totalRaised = investments
    ? investments
        .filter((i) => ['wired', 'complete'].includes(i.status))
        // .map((i) => i.amount)
        .map((i) => {
          if (i.capitalWiredAmount !== null) {
            return i.capitalWiredAmount;
          }
          return i.amount;
        })
        .reduce((acc, n) => acc + n, 0) || 0
    : 0;

  const totalCommitted = investments
    ? investments.map((i) => i.amount).reduce((acc, n) => acc + n, 0) || 0
    : 0;

  return (
    <Grid container spacing={2} className={classes.section}>
      <Grid item xs={12} lg>
        <SimpleBox
          size="fourth"
          title="Total Capital Received"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="totalRaised"
          tooltipContent={
            <Typography color="inherit">
              This is the total capital received into the private fund's bank account (including
              loans and drawdowns)
            </Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>${nWithCommas(totalRaised)}</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg>
        <SimpleBox
          size="fourth"
          title="Total Committed"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="totalCommitted"
          tooltipContent={
            <Typography color="inherit">This is the total capital committed</Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>${nWithCommas(totalCommitted)}</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg>
        <SimpleBox
          size="fourth"
          title="Total Invested"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="totalInvested"
          tooltipContent={
            <Typography color="inherit">Total capital deployed from the fund</Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>
              ${nWithCommas(_.sumBy(data, 'Invested').toFixed(0))}
            </Typography>
            <Typography className={classes.footerData}>
              {(data || []).length} Total Investments
            </Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg>
        <SimpleBox
          size="fourth"
          title="Multiple (Estimated)"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="multiple"
          tooltipContent={
            <Typography color="inherit">
              This is the estimated multiple IRR on the Total Invested based on data provided by the
              fund manager. Subject to change and not to be relied upon.
            </Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>{dealMultiple.toFixed(2) || 1}x</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg>
        <SimpleBox
          size="fourth"
          title="Total Portfolio Value (Est.)"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="portfolioValue"
          tooltipContent={
            <Typography color="inherit">
              This is the estimated value of the portfolio (Total Invested x Multiple)
            </Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>
              $
              {nWithCommas(
                (_.sumBy(data, 'Invested') * (dealMultiple === 0 ? 1 : dealMultiple)).toFixed(0),
              )}
            </Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} md={6}>
        <ChartBox title="Portfolio Overview" info="Explanation">
          <div className={classes.chartContainer}>
            <DoughnutChart series={formatDoughnutSeries(series)} />
          </div>
          <div className={classes.tableContainer}>
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
      <Grid item xs={12} md={6}>
        <ChartBox title="Total Invested" info="Explanation">
          <LineChart dataset={steppedChartData} />
        </ChartBox>
      </Grid>
    </Grid>
  );
};

export default Highlights;
