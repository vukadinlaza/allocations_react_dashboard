/* eslint-disable no-param-reassign */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
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
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { useMutation, useQuery } from '@apollo/react-hooks';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import _, { toLower, orderBy, get } from 'lodash';
import moment from 'moment';
import Chart from 'react-google-charts';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../utils/Loader';
import { nWithCommas } from '../../utils/numbers';
import { useAuth } from '../../auth/useAuth';
import Document from '../utils/Document';
import InvestmentEdit from '../InvestmentEdit';
import { useSimpleReducer, useFetchWithEmail } from '../../utils/hooks';
import CapitalAccountModal from './capitalAccountsModal';
import ResignModal from './resignModal';
import './style.scss';

const useStyles = makeStyles((theme) => ({
  tableHeader: {
    textTransform: 'uppercase !important',
    color: '#3A506B !important',
    fontSize: '.75rem',
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
  investmentRow: {
    backgroundColor: "#FBFCFF",
    "&:hover": {
      backgroundColor: "rgb(241, 244, 251)"
    }
  }
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
      accountInvestments {
        _id
        value
        amount
        status
        created_at
        submissionData {
          investmentId
          submissionId
        }
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
            signDeadline
          }
          organization {
            _id
            slug
          }
        }
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
const BASE = 'appLhEikZfHgNQtrL';
const TABLE = 'Ledger';
const InvestorTable = ({ userProfile, refetch }) => {
  const classes = useStyles();
  const location = useLocation();
  const [showDocs, setShowDocs] = useState();
  const [showResignModal, setShowResignModal] = useState(false);
  const [sortByProp, setSortByProp] = useState({ prop: 'deal.company_name', direction: 'asc' });
  const [editInvestmentModal, setEditInvestmentModal] = useState({});
  const [investmentUpdated, setInvestmentUpdated] = useState();
  const { data: capitalAccounts } = useFetchWithEmail(BASE, TABLE, userProfile?.email || '');
  const [demo, setDemo] = useState(false);
  const [showCapitalAccounts, setShowCaptialAccounts] = useState(false);
  const [postZap, {}] = useMutation(POST_ZAP);
  const investmentsRef = React.useRef(null);

  const [confirmation, setConfirmation] = useState(false);
  const [tradeData, setTradeData] = useSimpleReducer({
    price: '',
    amount: '',
    direction: 'sell',
    cost: 0,
  });
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

  useEffect(() => {
    const demo = location.search === '?demo=true';
    if (demo && userProfile?.investments) {
      investmentsRef.current = userProfile?.investments.map((inv) => {
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
      setDemo(true);
    }
  }, [demo, location.search, userProfile, userProfile?.investments]);
  const chartOptionsA = {
    title: '',
    pieHole: 0.5,
  };
  const chartOptionsB = {
    title: '',
    vAxis: { title: '' },
    legend: 'none',
  };

  if (!userProfile?.email) return <Loader />;
  let { investments } = userProfile || {};
  investments = userProfile?.investments;

  if (userProfile.email === 'kadvani1@gmail.com') {
    investments = investments.filter((i) => i.status !== 'invited');
  }
  if (demo && investmentsRef.current) {
    investments = investmentsRef.current;
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

  const sortedInvestments = (investments) => {
    return orderBy(investments, (inv) => get(inv, sortByProp.prop), [sortByProp.direction]);
  };
  return (
    <div style={{width: "100%", marginBottom: "40px"}}>
        <Grid item sm={12} md={12}>
          <Paper style={{ overflowX: 'scroll' }}>
            <Table>
              <TableHead>
                <TableRow style={{ borderBottom: 'solid black 1px' }}>
                  <TableCell className={classes.tableHeader} align="left">
                    <div className="sort-btns">
                      <div>Name</div>
                      {sortByProp.direction !== 'asc' ? (
                        <ArrowDropUpIcon
                          onClick={() => setSortByProp({ prop: 'deal.company_name', direction: 'asc' })}
                        />
                      ) : (
                        <ArrowDropDownIcon
                          onClick={() => setSortByProp({ prop: 'deal.company_name', direction: 'desc' })}
                        />
                      )}
                    </div>
                  </TableCell>
                  <Hidden only="xs">
                    <TableCell className={classes.tableHeader} align="center">
                      Status
                    </TableCell>
                  </Hidden>
                  <Hidden only="xs">
                    <TableCell className={classes.tableHeader} align="center">
                      <div className="sort-btns">
                        <div>Investment Date</div>
                        {sortByProp.direction !== 'asc' ? (
                          <ArrowDropUpIcon
                            onClick={() => setSortByProp({ prop: 'deal.dealParams.wireDeadline', direction: 'asc' })}
                          />
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => setSortByProp({ prop: 'deal.dealParams.wireDeadline', direction: 'desc' })}
                          />
                        )}
                      </div>
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
                  <Hidden only="xs">
                    <TableCell className={classes.tableHeader} align="center">
                      Capital Accounts
                    </TableCell>
                  </Hidden>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedInvestments(investments).map((investment) =>
                  showDocs?._id === investment?._id ? (
                    <>
                      <TR
                        demo={demo}
                        investment={investment}
                        setShowDocs={setShowDocs}
                        showDocs={showDocs}
                        setTradeData={setTradeData}
                        setShowCaptialAccounts={setShowCaptialAccounts}
                        capitalAccounts={capitalAccounts}
                        userProfile={userProfile}
                        classes={classes}
                      />
                      <DocsRow
                        key={`${showDocs._id}-docs`}
                        docs={showDocs.documents}
                        investment={investment}
                        setShowResignModal={setShowResignModal}
                        demo={demo}
                        setEditInvestmentModal={setEditInvestmentModal}
                        isAdmin={userProfile.admin || location.pathname.includes('investor')}
                      />
                    </>
                  ) : (
                    <TR
                      demo={demo}
                      investment={investment}
                      setShowDocs={setShowDocs}
                      showDocs={showDocs}
                      setTradeData={setTradeData}
                      setShowCaptialAccounts={setShowCaptialAccounts}
                      capitalAccounts={capitalAccounts}
                      userProfile={userProfile}
                      classes={classes}
                    />
                  ),
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

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

      <CapitalAccountModal
        showCapitalAccounts={showCapitalAccounts}
        setShowCaptialAccounts={setShowCaptialAccounts}
        classes={classes}
      />
      <EditInvestmentModal
        editInvestmentModal={editInvestmentModal}
        setEditInvestmentModal={setEditInvestmentModal}
        investmentUpdated={investmentUpdated}
        setInvestmentUpdated={setInvestmentUpdated}
      />
      <ResignModal
        setShowDocs={setShowDocs}
        setShowResignModal={setShowResignModal}
        showResignModal={showResignModal}
        refetch={refetch}
      />
    </div>
  );
};

const TR = ({
  investment,
  setShowDocs,
  showDocs,
  setTradeData,
  classes,
  demo,
  setShowCaptialAccounts,
  capitalAccounts,
  userProfile,
}) => {
  const history = useHistory();
  const capFields = (capitalAccounts || []).map((r) => r.fields);

  const capitalAccountInfo = capFields.find((r) => {
    return _.get(r, 'Deal Name (webapp)[0]') === investment.deal.company_name;
  });

  const addedDate = moment(investment?.deal?.dealParams?.wireDeadline).format('Do MMM YYYY');
  const showDocsFn = () => setShowDocs(showDocs ? false : investment);
  return (
    <TableRow key={investment._id} className={classes.investmentRow}>
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
      <Hidden only="xs">
        <TableCell align="center">
          <Button variant="contained" size="small" color="primary" onClick={showDocsFn} disabled={!!demo}>
            View
          </Button>
        </TableCell>
      </Hidden>
      <Hidden only="xs">
        <TableCell align="center">
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => setShowCaptialAccounts(capitalAccountInfo)}
            disabled={!capitalAccountInfo?.Email}
          >
            View
          </Button>
        </TableCell>
      </Hidden>
    </TableRow>
  );
};
function InvestmentStatus({ investment }) {
  const { status } = investment;
  return <span className={`investment-status investment-status-${status}`}>{status}</span>;
}

function DocsRow({ docs, investment, demo, setEditInvestmentModal, isAdmin, setShowResignModal }) {
  const isClosed = moment(investment?.deal?.dealParams?.signDeadline).isBefore(new Date());

  return (
    <>
      <TableRow>
        <TableCell colSpan={6}>
          <Typography variant="subtitle2" style={{ marginBottom: '1rem' }}>
            Documents may take up to 7 days to appear here after signing.
          </Typography>
          <Grid container xs={12} md={12} sm={12} lg={12} spacing={1}>
            {demo ? [] : docs.map((doc) => <Document doc={doc} investment={investment} />)}
            {investment?.submissionData?.submissionId && !isClosed && (
              <Grid
                item
                lg={3}
                md={3}
                sm={12}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: 'solid 1px black',
                  padding: '2rem',
                  margin: '.5rem',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setShowResignModal(investment);
                }}
              >
                Re-sign documents
                <EditIcon fontSize="large" />
              </Grid>
            )}
            {isAdmin && (
              <Grid
                item
                lg={3}
                md={3}
                sm={12}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: 'solid 1px black',
                  padding: '2rem',
                  margin: '.5rem',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setEditInvestmentModal(investment);
                }}
              >
                Edit Investment
                <EditIcon fontSize="large" />
              </Grid>
            )}
          </Grid>
        </TableCell>
      </TableRow>
    </>
  );
}

const EditInvestmentModal = ({ editInvestmentModal, setEditInvestmentModal }) => {
  const classes = useStyles();

  return (
    <>
      <Modal open={editInvestmentModal._id} onClose={() => {}} className={classes.modal}>
        <Grid container xs={12} sm={12} md={4} lg={5}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper className={classes.modalPaper}>
              <Grid
                onClick={() => setEditInvestmentModal(false)}
                style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}
              >
                <CloseIcon />
              </Grid>
              <Grid container justify="space-between" />
              <InvestmentEdit investmentId={editInvestmentModal._id} isK1 />
            </Paper>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default InvestorTable;