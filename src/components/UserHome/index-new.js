import React from 'react';
import { gql } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import moment from 'moment';
import { Typography, Grid } from '@material-ui/core';
import { useAuth } from '../../auth/useAuth';
import { DefaultChartTable, DoughnutChart, LineChart } from '../utils/charts';
import { SimpleBox, ChartBox } from '../admin/FundManagerDashboard/widgets';
import { nWithCommas } from '../../utils/numbers';
import { nestedSort, tablet, phone } from '../../utils/helpers';
import Loader from '../utils/Loader';
import 'chartjs-plugin-datalabels';
import InvestorTable from './InvestorTable';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      name
      first_name
      last_name
      entity_name
      country
      signer_full_name
      accredited_investor_status
      investor_type
      email
      organizations
      admin
      organizations_admin {
        _id
        slug
        name
        logo
      }
      investments {
        _id
        value
        amount
        status
        created_at
        documents {
          path
          link
        }
        deal {
          _id
          slug
          company_name
          company_description
          date_closed
          status
          dealParams {
            dealMultiple
          }
          organization {
            _id
            slug
          }
        }
      }
      invitedDeals {
        _id
        slug
        company_name
        company_description
        date_closed
        status
        organization {
          _id
          slug
        }
      }
    }
  }
`;

const styles = (theme) => ({
  chartContainer: {
    width: '70%',
    width: '60%',
    padding: '5% 0',
    [theme.breakpoints.down(tablet)]: {
      padding: 0,
      width: '100%',
      marginBottom: '20px',
      height: '250px',
    },
  },
  footerData: {
    fontSize: '14px',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    padding: '20px 0px',
    margin: '10px 0 20px 0',
  },
  section: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    // padding: "40px",
    [theme.breakpoints.down(phone)]: {
      padding: '4vw',
    },
  },
  simpleBoxDataRow: {
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  subSection: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  tableContainer: {
    maxHeight: '100%',
    width: '35%',
    minWidth: '175px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    '& table *': {},
    '& tr': {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      '& > *': {
        display: 'flex',
      },
      '& > *:first-child': {
        marginRight: '1em',
      },
    },
    [theme.breakpoints.down(tablet)]: {
      width: '100%',
    },
  },
});

export function getColor(i) {
  const colors = ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C'];
  let modulo = i % colors.length;
  let color = colors[modulo];
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

const UserHome = ({ classes, dealData }) => {
  const { userProfile, refetch } = useAuth(GET_INVESTOR);

  const setMonthsToShow = (data) => {
    let monthsArray = [];

    data.forEach((item) => {
      let itemMonth = moment(item['Date']).format('YYYYMM');
      if (!monthsArray.includes(itemMonth)) monthsArray.push(itemMonth);
    });
    monthsArray.sort();

    return monthsArray;
  };

  const setLabelsAndData = (data, monthsArray) => {
    let labels = [];
    let chartData = [];

    data.forEach((item) => {
      let itemMonth = moment(item['Date']).format('YYYYMM');
      let monthsIndex = monthsArray.indexOf(itemMonth);
      let itemLabel = moment(item['Date']).format('MMM YYYY');
      let itemAmount = item['amount'];
      if (labels.includes(itemLabel)) {
        chartData[monthsIndex] += itemAmount;
      } else {
        labels[monthsIndex] = itemLabel;
        chartData[monthsIndex] = itemAmount;
      }
    });
    let nextMonth = moment(monthsArray[monthsArray.length - 1])
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

    let steppedData = chartData.map((item, i) => {
      accAmount += item;
      return accAmount;
    });
    let steppedChartData = { labels, data: steppedData };
    return steppedChartData;
  };

  const data = userProfile.investments;

  if (!data || !data.length) return <Loader />;

  let series = data
    .map((s) => {
      return { label: s.deal?.company_name, total: s['amount'] };
    })
    .sort((a, b) => nestedSort(a, b, 'total', 'desc'));
  let seriesTotal = series.length ? series.map((s) => s.total).reduce((acc, n) => acc + n) : 0;
  let steppedChartData = getSteppedChartData(data);
  let multiplesTotal = data.reduce((acc, n) => {
    let dealMultiple = _.toNumber(n.deal?.dealData?.dealParams?.dealMultiple || 1);
    return acc + dealMultiple;
  }, 0);
  let avgMultiple = multiplesTotal / data.length;

  return (
    <div className={classes.section}>
      <Typography className={classes.mainTitle}>Overview</Typography>
      <Grid container xs={12} spacing={3} className={classes.section}>
        <Grid item lg={4}>
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
        <Grid item lg={4}>
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
        <Grid item lg={4}>
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
        <Grid item lg={6}>
          <ChartBox title="Value" info="Explanation">
            <LineChart dataset={steppedChartData} />
          </ChartBox>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.mainTitle}>Investments</Typography>
          <InvestorTable userProfile={userProfile} refetch={refetch} />
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(UserHome);
