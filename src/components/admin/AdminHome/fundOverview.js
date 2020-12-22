import React from 'react';
import { Paper, Grid } from '@material-ui/core';
import _ from 'lodash';
import Chart from 'react-google-charts';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { nWithCommas } from '../../../utils/numbers';

export default ({ data, children, orgData }) => {
  const history = useHistory();
  if (!data) return null;
  const chartEvents = [
    {
      eventName: 'select',
      callback({ chartWrapper }) {
        history.push(`/investments`);
      },
    },
  ];
  const multipleSum =
    _.sum(
      orgData?.deals
        .map((deal) => {
          return deal?.dealParams?.dealMultiple || 1;
        })
        .map((n) => _.toNumber(n)),
    ) / (orgData?.deals.length === 0 ? 1 : orgData?.deals.length);

  const chartOptionsA = {
    title: '',
    pieHole: 0.5,
  };
  const chartOptionsB = {
    title: '',
    vAxis: { title: '' },
    isStacked: true,
  };
  const groupedByMonth = _.groupBy(data, (inv) => {
    const addedDate = moment(inv.Date).format('MMM YYYY DD');
    return addedDate.substring(0, 8);
  });

  const groupedData = _.mapValues(groupedByMonth, (monthData) => {
    const monthSum = _.sumBy(
      monthData.map((inv) => ({
        ...inv,
        amount: inv.Invested,
      })),
      'amount',
    );
    return monthSum;
  });

  const arrayData = Object.keys(groupedData)
    .map((key, index) => {
      return [key, groupedData[key]];
    })
    .map((a) => {
      return [new Date(a[0]), a[1]];
    })
    .sort((a, b) => a[0] - b[0]);

  const graphBData = arrayData.map((data, index) => {
    const prevMonths = arrayData[index - 1] ? arrayData.slice(0, index) : [];
    const prevMonthsTotal = prevMonths.reduce((acc, m) => {
      return acc + m[1];
    }, 0);
    return [moment(data[0]).format('MMM YY'), prevMonthsTotal + data[1]];
  });
  return (
    <div className="blue-container">
      {children}

      <Grid container justify="space-between" style={{ marginTop: '40px' }}>
        <Grid item xs={12} sm={12} md={4} style={{ border: '1em solid transparent' }}>
          <Paper style={{ minHeight: '100px' }}>
            <Grid container style={{ padding: '0.1rem', justifyContent: 'space-between' }}>
              <Grid item sm={8} md={8}>
                <p
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                    paddingLeft: '10px',
                    paddingTop: '10px',
                  }}
                >
                  Portfolio Value
                </p>
                <h2 align="left" style={{ color: 'rgba(0,0,0,0.8)', paddingLeft: '10px' }}>
                  ${nWithCommas((_.sumBy(data, 'Invested') * (multipleSum === 0 ? 1 : multipleSum)).toFixed(0))}
                </h2>

                <p
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                    paddingLeft: '10px',
                    paddingTop: '10px',
                  }}
                >
                  0% realized | 100% unrealized
                </p>
              </Grid>
              <Grid item sm={4} md={4}>
                <img
                  src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-dollar-sign.svg"
                  alt="oops"
                  style={{ width: '50px', height: '50px', marginTop: '30%' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} style={{ border: '1em solid transparent' }}>
          <Paper style={{ minHeight: '100px' }}>
            <Grid container style={{ padding: '0.1rem', justifyContent: 'space-between' }}>
              <Grid item sm={8} md={8}>
                <p
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                    paddingLeft: '10px',
                    paddingTop: '10px',
                  }}
                >
                  Total Invested
                </p>
                <h2 align="left" style={{ color: 'rgba(0,0,0,0.8)', paddingLeft: '10px' }}>
                  ${nWithCommas(_.sumBy(data, 'Invested').toFixed(0))}
                </h2>

                <p
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                    paddingLeft: '10px',
                    paddingTop: '10px',
                  }}
                >
                  {(data || []).length} Total Investments
                </p>
              </Grid>
              <Grid item sm={4} md={4}>
                <img
                  src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-dollar-sign.svg"
                  alt="oops"
                  style={{ width: '50px', height: '50px', marginTop: '30%' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} style={{ border: '1em solid transparent' }}>
          <Paper style={{ minHeight: '100px' }}>
            <Grid container style={{ padding: '0.1rem', justifyContent: 'space-between' }}>
              <Grid item sm={8} md={8}>
                <p
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                    paddingLeft: '10px',
                    paddingTop: '10px',
                  }}
                >
                  Multiple
                </p>
                <h2 align="left" style={{ color: 'rgba(0,0,0,0.8)', paddingLeft: '10px' }}>
                  {multipleSum.toFixed(2) || 1}x
                </h2>
                <p
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                    paddingLeft: '10px',
                    paddingTop: '10px',
                  }}
                >
                  Last Update: 15th Oct 2020
                </p>
              </Grid>
              <Grid item sm={4} md={4} justify="center" align="center">
                <img
                  src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-mulitple.svg"
                  alt="oops"
                  style={{ width: '50px', height: '50px', marginTop: '30%' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container justify="space-between" style={{ marginTop: '1em' }}>
        <Grid item xs={12} sm={6} md={6} style={{ border: '1em solid transparent' }}>
          <Paper style={{ minHeight: '400px' }}>
            <p
              style={{
                color: 'rgba(0,0,0,0.4)',
                paddingLeft: '10px',
                paddingTop: '10px',
              }}
            >
              Portfolio Overview
            </p>
            <Grid item sm={12} md={12}>
              <Chart
                chartType="PieChart"
                width="100%"
                height="300px"
                chartEvents={chartEvents}
                data={[
                  ['Investment', 'Amount'],
                  ...data.map((investment) => [investment.Investment, investment.Invested]),
                ]}
                options={chartOptionsA}
              />
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6} style={{ border: '1em solid transparent' }}>
          <Paper style={{ minHeight: '400px' }}>
            <p
              style={{
                color: 'rgba(0,0,0,0.4)',
                paddingLeft: '10px',
                paddingTop: '10px',
              }}
            >
              Value
            </p>

            <Grid item sm={12} md={12}>
              <Chart
                chartType="SteppedAreaChart"
                width="100%"
                height="300px"
                options={{
                  legend: 'none',
                }}
                chartEvents={chartEvents}
                data={[['Time', 'Value'], ...graphBData]}
                optionsA={chartOptionsB}
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
