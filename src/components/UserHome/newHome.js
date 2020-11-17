/* eslint-disable no-param-reassign */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Hidden,
  Modal,
  FormControl,
  Input,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import _, { isNumber, toNumber } from 'lodash';
import moment from 'moment';
import Chart from 'react-google-charts';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../utils/Loader';
import { nWithCommas } from '../../utils/numbers';
import { useAuth } from '../../auth/useAuth';
import Document from '../utils/Document';
import { useSimpleReducer } from '../../utils/hooks';
import './style.scss';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  tableHeader: {
    textTransform: 'uppercase !important',
    color: '#3A506B !important',
    fontSize: '.75rem',
    fontWeight: 'bold',
  },
  paper: {
    padding: theme.spacing(2),
  },
  banner: {
    minWidth: '100%',
  },
  blue: {
    color: '#205DF5',
  },
  grey: {
    color: '#5C6E84',
  },
  modal: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '12vh',
    borderRadius: '1rem',
    padding: theme.spacing(2),
  },
  input: {
    border: '1px solid #707070',
    borderRadius: '10px',
    padding: '.25rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
  },
}));

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
          appLink
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
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($order: OrderInput!) {
    createOrder(order: $order) {
      _id
    }
  }
`;
const POST_ZAP = gql`
  mutation PostZap($body: Object) {
    postZap(data: $body) {
      _id
    }
  }
`;

export default () => {
  const classes = useStyles();
  const location = useLocation();
  const [showDocs, setShowDocs] = useState();
  const [text, setText] = useState('');
  const [postZap, {}] = useMutation(POST_ZAP);

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [confirmation, setConfirmation] = useState(false);
  const [tradeData, setTradeData] = useSimpleReducer({
    price: '',
    amount: '',
    direction: 'sell',
    cost: 0,
  });
  const demo = location.search === '?demo=true';
  console.log(demo);
  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      setConfirmation(false);
      setTradeData({ showLoading: true });
    },
  });

  useEffect(() => {
    if (tradeData.showLoading) {
      setTimeout(() => {
        setTradeData({ showFinal: true });
      }, 3000);
    }
  }, [setTradeData, tradeData.showLoading]);

  const { userProfile } = useAuth(GET_INVESTOR);

  const chartOptionsA = {
    title: '',
    pieHole: 0.5,
  };
  const chartOptionsB = {
    title: '',
    vAxis: { title: '' },
    legend: 'none',
  };

  if (!userProfile.email) return <Loader />;

  let investments = userProfile.investments.filter((inv) => inv.status !== 'invited');

  if (demo) {
    investments = investments.map((inv) => {
      inv.deal.company_name = _.sample([
        'Airbnb',
        'Coinbase',
        'Stripe',
        'Tundra Trust',
        'BlockFi',
        'Instacart',
        'SpaceX',
        'Lightning Labs',
        'Snowflake',
        'Flexport',
        'Pinterest',
        'Discord',
      ]);
      return inv;
    });
  }
  const groupedByMonth = _.groupBy(investments, (inv) => {
    const timestamp = inv?._id.toString().substring(0, 8);
    const date = new Date(parseInt(timestamp, 16) * 1000);
    const addedDate = moment(date).format('MMM YY');
    return addedDate.substring(0, 6);
  });
  const groupedData = _.mapValues(groupedByMonth, (monthData) => {
    const monthSum = _.sumBy(monthData, 'value');
    return monthSum;
  });
  const arrayData = Object.keys(groupedData).map((key) => {
    return [key, groupedData[key]];
  });
  const graphBData = arrayData.map((data, index) => {
    const prevMonths = arrayData[index - 1] ? arrayData.slice(0, index) : [];
    const prevMonthsTotal = prevMonths.reduce((acc, m) => {
      return acc + m[1];
    }, 0);
    return [data[0], prevMonthsTotal + data[1]];
  });
  const investmentTotal = _.sumBy(investments, 'amount');
  const investmentsValue = _.sumBy(investments, 'value');
  const multipleSum = (investmentsValue / investmentTotal).toFixed(2);
  console.log(multipleSum, investments);

  // const weightedInvestments = investments.map((inv) => {
  //   const dm = inv.value - inv.amount;
  //   const x = dm / inv.amount;
  //   const weight = inv.amount / investmentTotal;
  //   return weight * x;
  // });

  // console.log('TOTAL', _.sum(weightedInvestments) + 1);

  const orderDate = new Date();
  const orderConfirmDate = moment(orderDate).format('DD MMM YY');
  const handleInputChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (value === '') {
      setTradeData({ amount: 0 });
      setTradeData({ percent: 0.0 });
    }
    if (isNaN(parseInt(value))) return null;

    switch (name) {
      case 'amount':
        setTradeData({ amount: parseInt(value) });
        setTradeData({
          percent: ((parseInt(value) * 100) / parseInt(tradeData.investment.amount)).toFixed(2),
        });
        break;
      case 'percent':
        setTradeData({ percent: parseInt(value) });
        setTradeData({
          amount: (parseInt(value) / 100) * parseInt(tradeData.investment.amount),
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="blue-container">
      <Grid container spacing={12} justify="space-between" style={{ marginTop: '40px', marginBottom: '1rem' }}>
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
                  $ {investmentsValue === 0 ? `${nWithCommas(investmentTotal)}.00` : nWithCommas(investmentsValue)}
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
                  $ {investmentsValue === 0 ? `${nWithCommas(investmentTotal)}.00` : nWithCommas(investmentsValue)}
                </h2>
                <p
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                    paddingLeft: '10px',
                    paddingTop: '10px',
                  }}
                >
                  {investments?.length} Total Investments
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
                  {!isNaN(multipleSum) ? multipleSum : '0.00'}x
                </h2>
                <p
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                    paddingLeft: '10px',
                    paddingTop: '10px',
                  }}
                >
                  Last Update: 4th Nov 2020
                </p>
              </Grid>
              <Grid item sm={4} md={4}>
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
      {investments.length >= 1 ? (
        <>
          <Grid container justify="space-between" style={{ marginTop: '1em' }}>
            <Grid item xs={12} sm={12} md={6} style={{ border: '1em solid transparent' }}>
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
                  {investments.length !== 0 ? (
                    <Chart
                      chartType="PieChart"
                      width="100%"
                      height="300px"
                      data={[
                        ['Investment', 'Amount'],
                        ...investments.map((inv) => [inv.deal.company_name, inv.amount]),
                      ]}
                      options={chartOptionsA}
                    />
                  ) : null}
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={12} md={6} style={{ border: '1em solid transparent' }}>
              <Paper style={{ minHeight: '400px' }}>
                <p
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                    paddingLeft: '10px',
                    paddingTop: '10px',
                  }}
                >
                  Portfolio Value
                </p>
                <Grid item sm={12} md={12}>
                  {investments.length !== 0 ? (
                    <Chart
                      chartType="SteppedAreaChart"
                      width="100%"
                      height="300px"
                      data={[['Time', 'Value'], ...graphBData]}
                      options={chartOptionsB}
                    />
                  ) : null}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Grid item sm={12} md={12} style={{ border: '1em solid transparent' }}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow style={{ borderBottom: 'solid black 1px' }}>
                    <TableCell className={classes.tableHeader} align="left">
                      Name
                    </TableCell>
                    <Hidden only="xs">
                      <TableCell className={classes.tableHeader} align="center">
                        Status
                      </TableCell>
                    </Hidden>
                    <Hidden only="xs">
                      <TableCell className={classes.tableHeader} align="center">
                        Investment Date
                      </TableCell>
                    </Hidden>
                    <TableCell className={classes.tableHeader} align="center">
                      Investment Amount
                    </TableCell>
                    <Hidden only="xs">
                      <TableCell className={classes.tableHeader} align="center">
                        Investment Value
                      </TableCell>
                    </Hidden>
                    <Hidden only="xs">
                      <TableCell className={classes.tableHeader} align="center">
                        Multiple
                      </TableCell>
                    </Hidden>
                    <TableCell className={classes.tableHeader} align="center">
                      Deal Page
                    </TableCell>
                    <Hidden only="xs">
                      <TableCell className={classes.tableHeader} align="center">
                        Documents
                      </TableCell>
                    </Hidden>
                    <TableCell className={classes.tableHeader} align="center">
                      Buy
                    </TableCell>
                    <TableCell className={classes.tableHeader} align="center">
                      Sell
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {investments.map((investment) =>
                    showDocs?._id === investment?._id ? (
                      <>
                        <TR
                          demo={demo}
                          investment={investment}
                          setShowDocs={setShowDocs}
                          showDocs={showDocs}
                          setTradeData={setTradeData}
                        />
                        <DocsRow key={`${showDocs._id}-docs`} docs={showDocs.documents} investment={investment} />
                      </>
                    ) : (
                      <TR
                        demo={demo}
                        investment={investment}
                        setShowDocs={setShowDocs}
                        showDocs={showDocs}
                        setTradeData={setTradeData}
                      />
                    ),
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </>
      ) : (
        <Paper style={{ margin: '1rem', padding: '2rem' }}>
          <Typography variant="h6" style={{ color: '#5C6E84', textAlign: 'center', padding: '1rem' }}>
            Having trouble finding your investment?
          </Typography>
          <Grid container sm={12} md={12} lg={12}>
            <Grid item xs={12} sm={12} md={8} lg={8}>
              <Typography variant="subtitle2" style={{ color: '#5C6E84', padding: '.25rem' }}>
                Enter your deal name
              </Typography>
              <TextField
                style={{ width: '100%', padding: '.5rem', marginBottom: '1rem' }}
                size="lg"
                type="text"
                onChange={(e) => {
                  setText(e.target.value);
                }}
                label="Deal Name"
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              lg={4}
              style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '.5rem' }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{ width: '100%', height: '50%', margin: '1rem' }}
                size="medium"
                onClick={() => {
                  toast.success('Success! Allocations has been notified');
                  postZap({
                    variables: {
                      body: { zapUrl: 'https://hooks.zapier.com/hooks/catch/7904699/ola4wwb', dealName: text },
                    },
                  });
                }}
              >
                Find Investment
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Modal
        open={tradeData?.open}
        onClose={() =>
          setTradeData({
            price: '',
            amount: '',
            direction: 'sell',
            cost: 0,
            open: false,
          })
        }
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid container xs={12} sm={12} md={4} lg={4}>
          {tradeData.showLoading ? (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Paper className={classes.modalPaper}>
                {tradeData.showFinal ? (
                  <Grid
                    container
                    style={{
                      minHeight: '40vh',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Grid>
                        <Typography
                          variant="h5"
                          onClick={() =>
                            setTradeData({
                              price: '',
                              amount: '',
                              direction: 'sell',
                              cost: 0,
                              open: false,
                              showLoading: false,
                              showFinal: false,
                            })
                          }
                          className={classes.grey}
                          style={{
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            textAlign: 'end',
                          }}
                        >
                          <CancelIcon color="black" fontSize="medium" />
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography
                          className={classes.grey}
                          style={{ textAlign: 'center', marginTop: '2rem' }}
                          variant="h5"
                        >
                          Your trade request has been submitted
                        </Typography>
                      </Grid>
                      <Grid
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          fontSize: '5rem',
                        }}
                      >
                        <CheckCircleIcon
                          color="secondary"
                          style={{
                            fontSize: '8rem',
                          }}
                        />
                      </Grid>
                      <Grid>
                        <Typography
                          className={classes.grey}
                          style={{ textAlign: 'center', marginBottom: '2rem' }}
                          variant="paragraph"
                        >
                          An Allocations team member will reach out to you shortly about your order request. Please give
                          up to 30 days for a response. Thank you.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid
                    container
                    style={{
                      maxWidth: '100%',
                      minWidth: '30%',
                      minHeight: '40vh',
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                    >
                      <Loader />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography className={classes.grey} style={{ textAlign: 'center' }} variant="h5">
                        Creating your trade request
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Grid>
          ) : (
            <Grid container xs={12} sm={12} md={12} lg={12}>
              <form noValidate autoComplete="off" style={{ width: '100%' }}>
                <Grid xs={12} sm={12} md={12} lg={12}>
                  <Paper className={classes.modalPaper}>
                    {/* HEADER */}
                    <Grid container justify="space-between">
                      <Grid item>
                        <Typography
                          variant="h5"
                          className={classes.grey}
                          style={{ marginBottom: '1rem', fontWeight: 'bold' }}
                        >
                          Create Your Order
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="h5"
                          onClick={() =>
                            setTradeData({
                              price: '',
                              amount: '',
                              direction: 'sell',
                              cost: 0,
                              open: false,
                            })
                          }
                          className={classes.grey}
                          style={{ fontWeight: 'bold', fontSize: '1.5rem' }}
                        >
                          <CancelIcon color="black" fontSize="medium" />
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="h6" className={classes.grey}>
                      You'll {_.startCase(_.toLower(tradeData?.type))}
                    </Typography>

                    <Grid container xs={12} sm={12} md={12} lg={12} className={classes.input}>
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '.8rem',
                          fontWeight: '50',
                        }}
                      >
                        {tradeData?.type === 'sell' && (
                          <FormControl className={classes.margin} xs={6} sm={6} md={6} lg={6}>
                            <Input
                              className="trade-input-amount"
                              id="input-with-icon-adornment"
                              placeholder="Percent"
                              variant="outlined"
                              disableUnderline
                              startAdornment={<InputAdornment position="start">%</InputAdornment>}
                              onChange={handleInputChange}
                              name="percent"
                              value={tradeData.percent}
                            />
                          </FormControl>
                        )}
                        <FormControl className={classes.margin} xs={6} sm={6} md={6} lg={6}>
                          <Input
                            className="trade-input-amount"
                            id="input-with-icon-adornment"
                            placeholder="Dollar"
                            variant="outlined"
                            disableUnderline
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            onChange={handleInputChange}
                            name="amount"
                            value={tradeData?.amount}
                          />
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        className={classes.grey}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '1rem',
                          fontWeight: '50',
                        }}
                      >
                        <div
                          onClick={() =>
                            setTradeData({
                              amount: parseInt(tradeData.investment.amount).toFixed(2),
                              percent: parseInt('100').toFixed(2),
                            })
                          }
                          className="max-btn"
                          style={{
                            backgroundColor: '#C8DCFF',
                            borderRadius: '1rem',
                            fontSize: '1rem',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                          }}
                        >
                          MAX
                        </div>
                        {tradeData?.deal?.company_name || ''}
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}
                    >
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        className={classes.grey}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          fontSize: '.6rem',
                          fontWeight: '50',
                        }}
                      >
                        OWNERSHIP
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        className={classes.grey}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          fontSize: '.6rem',
                          fontWeight: '50',
                        }}
                      >
                        DEAL
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={classes.grey}
                      style={{
                        display: 'flex',
                      }}
                    >
                      <ArrowDownwardIcon
                        color="primary"
                        fontSize="large"
                        style={{
                          marginTop: '0.5rem',
                          marginBottom: '0.5rem',
                        }}
                      />
                    </Grid>

                    <Typography variant="h6" className={classes.grey}>
                      You'll {tradeData.type === 'buy' ? 'Pay' : 'Receive'}
                    </Typography>

                    <Grid container xs={12} sm={12} md={12} lg={12} className={classes.input}>
                      <Grid item xs={6} sm={6} md={6} lg={6}>
                        <FormControl className={classes.margin} xs={6} sm={6} md={6} lg={6}>
                          <Input
                            className="trade-input-amount"
                            id="input-with-icon-adornment"
                            placeholder="0"
                            variant="outlined"
                            disableUnderline
                            readOnly
                            value={tradeData?.amount || 0}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        className={classes.grey}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          fontSize: '1rem',
                          fontWeight: '50',
                        }}
                      >
                        USD ($)
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ paddingLeft: '.5rem', paddingRight: '.5rem' }}
                    >
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        className={classes.grey}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          fontSize: '.6rem',
                          fontWeight: '50',
                        }}
                      >
                        AMOUNT
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        className={classes.grey}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          fontSize: '.6rem',
                          fontWeight: '50',
                        }}
                      >
                        CURRENCY
                      </Grid>
                    </Grid>

                    <Grid justify="center">
                      <Button
                        variant="contained"
                        onClick={() => setConfirmation(true)}
                        color="secondary"
                        style={{
                          width: '100%',
                          marginTop: '1rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          fontSize: '1rem',
                        }}
                      >
                        Create Order
                      </Button>
                    </Grid>
                  </Paper>
                </Grid>
              </form>
            </Grid>
          )}
        </Grid>
      </Modal>
      <Modal
        open={confirmation}
        onClose={() => setConfirmation(false)}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid container xs={12} sm={12} md={4} lg={4}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper className={classes.modalPaper}>
              {/* HEADER */}
              <Grid container justify="space-between">
                <Grid item>
                  <Typography
                    variant="h5"
                    className={classes.grey}
                    style={{ marginBottom: '1rem', fontWeight: 'bold' }}
                  >
                    Confirm Your Order
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    onClick={() => setConfirmation(false)}
                    variant="h5"
                    className={classes.grey}
                    style={{ fontWeight: 'bold', fontSize: '1.5rem' }}
                  >
                    <CancelIcon color="black" fontSize="medium" />
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="paragraph" className={classes.grey}>
                You'll {_.startCase(_.toLower(tradeData?.type))}
              </Typography>

              <Typography variant="h6" className={classes.grey}>
                $ {tradeData?.amount} of {tradeData?.deal?.company_name}
              </Typography>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.grey}
                style={{
                  display: 'flex',
                }}
              >
                <ArrowDownwardIcon
                  color="primary"
                  fontSize="large"
                  style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
                />
              </Grid>
              <Typography variant="paragraph" className={classes.grey}>
                You'll {tradeData.type === 'buy' ? 'Pay' : 'Receive'}
              </Typography>
              <Typography variant="h6" className={classes.grey}>
                $ {tradeData?.amount} for {tradeData?.deal?.company_name}
              </Typography>
              <Typography variant="subtitle2" className={classes.grey} style={{ marginTop: '1rem' }}>
                After you confirm your order an Allocations team member will reachout with more information. Orders are
                open for 30 days before expiring and you can contact us to cancel your open order at anytime.
              </Typography>
              {/* FOOTER */}
              <Grid>
                <Grid
                  container
                  style={{ marginTop: '2rem' }}
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle2" className={classes.grey}>
                    Trade Date:
                  </Typography>
                  <Typography variant="subtitle2" className={classes.grey}>
                    {orderConfirmDate}
                  </Typography>
                </Grid>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Typography variant="subtitle2" className={classes.grey}>
                    Trade Type:
                  </Typography>
                  <Typography variant="subtitle2" className={classes.grey}>
                    {_.startCase(_.toLower(tradeData?.type))}
                  </Typography>
                </Grid>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Typography variant="subtitle2" className={classes.grey}>
                    Fees:
                  </Typography>
                  <Typography variant="subtitle2" className={classes.grey}>
                    $0.00
                  </Typography>
                </Grid>
              </Grid>

              <Grid justify="center">
                <Button
                  variant="contained"
                  onClick={() => {
                    createOrder({
                      variables: {
                        order: {
                          amount: Number(tradeData.amount),
                          side: tradeData.type,
                          deal_id: tradeData.deal._id,
                          user_id: userProfile._id,
                          investment_id: tradeData.investment._id,
                        },
                      },
                    });
                  }}
                  color="secondary"
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                  }}
                >
                  Confirm Order
                </Button>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Modal>
    </div>
  );
};

const TR = ({ investment, setShowDocs, showDocs, setTradeData, demo }) => {
  const history = useHistory();
  // const timestamp = investment._id.toString().substring(0, 8);
  // const date = new Date(parseInt(timestamp, 16) * 1000);
  const addedDate = moment(investment?.deal?.dealParams?.wireDeadline).format('Do MMM YYYY');
  const showDocsFn = () => setShowDocs(showDocs ? false : investment);
  return (
    <TableRow key={investment._id} className="investment-row">
      <TableCell align="left" onClick={showDocsFn}>
        {investment.deal.company_name}
      </TableCell>
      <Hidden only="xs">
        <TableCell onClick={showDocsFn} align="center">
          <InvestmentStatus investment={investment} />
        </TableCell>
      </Hidden>
      <Hidden only="xs">
        <TableCell onClick={showDocsFn} align="center">
          {addedDate}
        </TableCell>
      </Hidden>
      <TableCell onClick={showDocsFn} align="center">
        ${nWithCommas(investment.amount)}
      </TableCell>
      <Hidden only="xs">
        <TableCell onClick={showDocsFn} align="center">
          ${nWithCommas(investment.value)}
        </TableCell>
      </Hidden>
      <Hidden only="xs">
        <TableCell onClick={showDocsFn} align="center">
          {investment.deal.dealParams.dealMultiple}x
        </TableCell>
      </Hidden>
      <Hidden only="xs">
        <TableCell onClick={showDocsFn} align="center">
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => history.push(_.get(investment, 'deal.appLink', ''))}
          >
            View
          </Button>
        </TableCell>
      </Hidden>
      <TableCell align="center">
        <Button variant="contained" size="small" color="primary" onClick={showDocsFn} disabled={!!demo}>
          View
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={() =>
            setTradeData({
              open: true,
              type: 'buy',
              deal: investment.deal,
              investment,
            })
          }
        >
          Buy
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          size="small"
          color="secondary"
          style={{ backgroundColor: '#F53C56', color: '#ffffff' }}
          onClick={() =>
            setTradeData({
              open: true,
              type: 'sell',
              deal: investment.deal,
              investment,
            })
          }
        >
          sell
        </Button>
      </TableCell>
    </TableRow>
  );
};
function InvestmentStatus({ investment }) {
  const { status } = investment;
  return <span className={`investment-status investment-status-${status}`}>{status}</span>;
}

function DocsRow({ docs, investment }) {
  return (
    <>
      <TableRow>
        <TableCell colSpan={6}>
          <Typography variant="subtitle2" style={{ marginBottom: '1rem' }}>
            Documents may take up to 7 days to appear here after signing.
          </Typography>
          <Grid container xs={12} md={12} sm={12} lg={12} spacing={1}>
            {docs.map((doc) => (
              <Document doc={doc} investment={investment} />
            ))}
          </Grid>
        </TableCell>
      </TableRow>
    </>
  );
}
