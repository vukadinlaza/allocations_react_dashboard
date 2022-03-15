/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { Paper, Grid } from '@material-ui/core';
import { Chip, List, Typography } from '@allocations/design-system';
import { v4 as uuidv4 } from 'uuid';
import {
  nWithCommas,
  getMomentFromId,
  sortByNumber,
  customStringSort,
  titleCase,
  sortByDate,
} from '@allocations/nextjs-common';
import { useAuth } from '../../../auth/useAuth';
import 'chartjs-plugin-datalabels';
import UserInvestments from './sections/UserInvestments';
import UserDocuments from './sections/UserDocuments';
import Highlights from './sections/Highlights';
import styles from './styles';
import AllocationsLoader from '../../utils/AllocationsLoader';
import AllocationsTable from '../../utils/AllocationsTable';
import { useFetch } from '../../../utils/hooks';
import { DoughnutChart, LineChart, DefaultChartTable } from '../../utils/charts';
import { Box } from '../Common/components';

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
      documents
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
        submissionData {
          submissionId
        }
        deal {
          _id
          slug
          company_name
          company_description
          date_closed
          status
          investmentType
          deal_lead
          dealParams {
            dealMultiple
            wireDeadline
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

const headers = [
  {
    id: 'portfolioCompany',
    label: 'Portolio Company',
    withSort: true,
  },
  {
    id: 'company_name',
    label: 'Deal Name',
    withSort: true,
  },
  {
    id: 'amount',
    label: 'Investment',
    withSort: true,
    customSort: true,
  },
  {
    id: 'dealMultiple',
    label: 'Multiple',
    withSort: true,
    customSort: true,
  },
  {
    id: 'value',
    label: 'Value',
    withSort: true,
    customSort: true,
  },
  {
    id: 'type',
    label: 'Type',
    withSort: true,
  },
  {
    id: 'status',
    label: 'Status',
    withSort: true,
    customSort: true,
  },
  {
    id: 'investmentDate',
    label: 'Investment Date',
    withSort: true,
    customSort: true,
  },
];

const getChipColor = {
  'post-build': 'gray',
  'pre-onboarding': 'blue',
  onboarding: 'green',
  closing: 'yellow',
  'post-closing': 'red',
  closed: 'black',
};

export function getColor(i) {
  const colors = ['#68EE76', '#186EFF', '#7BCAEB'];
  const modulo = i % colors.length;
  const color = colors[modulo];
  return color;
}

const investorTabs = ['Highlights', 'Investments', 'Documents'];

const OPS_ACCOUNTING = 'app3m4OJvAWUg0hng';
const INVESTMENTS_TABLE = 'Investments';
const DEALS_TABLE = 'Deals';

const UserHome = ({ classes }) => {
  const { userProfile, loading, refetch } = useAuth(GET_INVESTOR);
  const [tabIndex, setTabIndex] = useState(0);
  const [userFunds, setUserFunds] = useState([]);
  const [dealsData, setDealsData] = useState({});
  const [funds, setFunds] = useState([]);
  const [fundInvestments, setFundInvestments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const userInvestments = useMemo(
    () =>
      userProfile.investments?.map((investment) => ({
        _id: investment._id,
        amount: investment.amount,
        type: investment.deal?.investmentType,
        dealName: investment.deal?.company_name,
        dealMultiple: investment.deal?.dealParams?.dealMultiple || 1,
        dealStatus: investment.deal?.status,
        investmentDate: getMomentFromId(investment._id).format('MM/DD/YYYY'),
      })) || [],
    [userProfile],
  );

  useEffect(() => {
    if (!loading) {
      const funds = userProfile?.investments
        ?.filter((investment) => investment?.deal?.investmentType === 'fund')
        .map((investment) => investment.deal);
      setUserFunds(funds);
    }
  }, [loading]);

  const createDealsATFilter = () => {
    if (!userFunds.length) return `({Deal Name}="Invalid deal")`;
    const dealsFilters = userFunds
      .map((fund) => `({Deal Name}="${encodeURIComponent(fund.company_name || 'Invalid name')}")`)
      .join(', ');

    return `OR(${dealsFilters})`;
  };

  const createInvestmentsATFilter = () => {
    if (!userFunds.length) return `(FIND("No Funds found", {Deals}))`;
    const fundsFilters = userFunds
      .map((fund) => `FIND("${encodeURIComponent(fund.company_name || 'Invalid name')}" , {Deals})`)
      .join(', ');

    return `OR(${fundsFilters})`;
  };

  const { data: atDeal } = useFetch(
    OPS_ACCOUNTING,
    userFunds?.length && DEALS_TABLE,
    userFunds?.length && createDealsATFilter(),
  );

  const { data: atFundData } = useFetch(
    OPS_ACCOUNTING,
    Object.keys(dealsData)?.length && INVESTMENTS_TABLE,
    Object.keys(dealsData)?.length && createInvestmentsATFilter(),
  );

  useEffect(() => {
    if (atDeal?.length) {
      const dealsData = {};
      atDeal.forEach((deal) => (dealsData[deal.fields['Deal Name']] = deal.id));
      setDealsData(dealsData);
    }
  }, [atDeal]);

  useEffect(() => {
    if (atFundData?.length) {
      const funds = userFunds.map((deal) => {
        const dealInvestments = atFundData
          .filter((investment) => investment.fields.Deals.includes(dealsData[deal.company_name]))
          .map((investment) => {
            return { ...investment.fields, createdTime: investment.createdTime };
          });
        const AUM = dealInvestments.map((inv) => inv.Invested).reduce((acc, n) => acc + n, 0);
        return { ...deal, investments: dealInvestments, AUM };
      });
      setFunds(funds);
    }
  }, [atFundData]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const showInvestments = ({ investment }) => {
    setSearchTerm('');
    if (!investment) {
      setFundInvestments({});
    } else {
      const fund = funds.find((f) => f._id === investment.deal._id);
      setFundInvestments(fund);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
          <Highlights
            data={userProfile.investments}
            classes={classes}
            userProfile={userProfile}
            refetch={refetch}
          />
        );

      case 1:
        return (
          <UserInvestments
            data={userProfile.investments}
            classes={classes}
            showInvestments={showInvestments}
            userProfile={userProfile}
            refetch={refetch}
          />
        );

      case 2:
        return <UserDocuments data={userProfile} classes={classes} />;

      default:
        return <p>No Data</p>;
    }
  };

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'date':
        return moment(row[headerValue]).format('MM/DD/YYYY');
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      default:
        return <div />;
    }
  };

  if (!Object.keys(userProfile).length || loading) return <AllocationsLoader fullHeight />;

  const fundInvestmentsCopy =
    fundInvestments?.investments?.filter((inv) =>
      inv.Investment.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const abbreviateAmount = (amount) => {
    const multipleMap = ['', 'k', 'm', 'b'];
    const amountLength = amount.toString().length;
    const thousandsMultiple = Math.floor((amountLength - 1) / 3);
    const abbreviated = Math.round(amount / (1000 ** thousandsMultiple || 1));
    return `${abbreviated}${multipleMap[thousandsMultiple]}`;
  };

  const getDashboardBoxes = () => {
    const portfolioValue =
      userInvestments
        ?.map((investment) => investment.amount * Number(investment.dealMultiple))
        .reduce((acc, n) => acc + n, 0) || 0;

    const totalInvested = userInvestments.map((i) => i.amount).reduce((acc, n) => acc + n, 0);

    const estimatedMultiple = Math.round(portfolioValue / totalInvested).toFixed(2);

    const totalInvestments = userInvestments.length;

    const dashboardBoxes = [
      {
        title: 'Portfolio Value',
        value: `$${abbreviateAmount(portfolioValue)}`,
      },
      {
        title: 'Total Invested',
        value: `$${abbreviateAmount(totalInvested)}`,
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

  const getFormattedData = () =>
    userInvestments.length
      ? userInvestments.map(({ dealName, amount, dealMultiple, type, dealStatus, _id }) => ({
          portfolioCompany: titleCase(dealName || ''),
          dealName: titleCase(dealName || ''),
          amount: `$${nWithCommas(amount)}`,
          dealMultiple: `${Number(dealMultiple).toFixed(2)}x`,
          value: `$${nWithCommas(Math.round(amount * Number(dealMultiple)))}`,
          type: titleCase(type || 'spv'),
          dealStatus: (
            <Chip
              chipColor={getChipColor[dealStatus]}
              chipSize="small"
              icons="none"
              text={`${titleCase(dealStatus || '')}`}
            />
          ),
          investmentDate: getMomentFromId(_id).format('MM/DD/YYYY'),
        }))
      : [{}];

  const handleSort = (data, orderBy, direction) => {
    const statusOrder = {
      'Post-build': 1,
      'Pre-onboarding': 2,
      Onboarding: 3,
      Closing: 4,
      'Post-closing': 5,
      Closed: 6,
    };
    const numberAmount = (amount) => {
      return Number(amount?.replace(/[^\d.-]/g, ''));
    };

    switch (orderBy) {
      case 'amount':
      case 'value':
      case 'dealMultiple':
        return data.sort((a, b) =>
          sortByNumber(numberAmount(a[orderBy]), numberAmount(b[orderBy]), '', direction),
        );
      case 'status':
        return data.sort((a, b) => {
          return customStringSort(
            a.dealStatus.props.text,
            b.dealStatus.props.text,
            statusOrder,
            '',
            direction,
          );
        });
      case 'investmentDate':
        return data.sort((a, b) =>
          sortByDate(new Date(a.investmentDate), new Date(b.investmentDate), '', direction),
        );
      default:
        return data;
    }
  };

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
    <Grid container spacing={2} className={classes.mainContainer}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={1} />
          <Grid
            item
            xs={10}
            container
            spacing={2}
            className={classes.titleContainer}
            alignItems="center"
          >
            <Grid item xs={12} lg={8}>
              <Typography
                component="div"
                content="Investor Dashboard"
                fontWeight={700}
                variant="heading2"
              />
            </Grid>
            <Grid item xs={12} lg={4} className={classes.buttonsContainer} />
          </Grid>
          <Grid item xs={1} />
        </Grid>
        <Grid container spacing={2} className={classes.computerBoxes}>
          <Grid item xs={1} />
          {getDashboardBoxes().map((box) => (
            <Box key={uuidv4()} box={box} />
          ))}
          <Grid item xs={1} />
        </Grid>
        <Grid container spacing={2} className={classes.mobileBoxes}>
          {getDashboardBoxes().map((box) => (
            <Grid container spacing={2} key={uuidv4()} className={classes.box}>
              <Grid item xs={1} />
              <Box box={box} />
              <Grid item xs={1} />
            </Grid>
          ))}
        </Grid>
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
        <Grid container spacing={2} className={classes.listsContainer}>
          <Grid item xs={1} />
          <Grid item xs={10} className={classes.list}>
            <div className={classes.listTitleContainer}>
              <Typography
                component="div"
                content="Investments"
                fontWeight={700}
                variant="heading3"
              />
            </div>
            <List
              data={getFormattedData()}
              headers={headers}
              customSort={handleSort}
              sortBy="amount"
              sortDirection="desc"
              withPagination
              itemsPerPage={5}
            />
          </Grid>
          <Grid item xs={false} md={1} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(UserHome);
