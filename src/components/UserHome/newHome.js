import React, { useState } from 'react';
import { gql } from 'apollo-boost'
import Loader from '../utils/Loader'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    Hidden
} from '@material-ui/core';
import _ from 'lodash'
import moment from 'moment'
import NullPaper from "../NullPaper";
import allocations_update_profile from '../../assets/allocations_update_profile.svg';
import allocations_invited_deals from '../../assets/allocations_invited_deals.svg';
import allocations_create_deal from '../../assets/allocations_create_deal.svg';
import allocations_faq from '../../assets/allocations_faq.svg';
import Chart from "react-google-charts"
import { useHistory } from "react-router-dom"
import { nWithCommas } from '../../utils/numbers'
import { useAuth } from "../../auth/useAuth";
import { makeStyles } from '@material-ui/core/styles';
import Document from '../utils/Document'
import './style.scss'

import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';


const useStyles = makeStyles((theme) => ({
    tableHeader: {
        textTransform: 'uppercase !important',
        color: '#3A506B !important',
        fontSize: '.75rem',
        fontWeight: 'bold'
    },
    paper: {
        padding: theme.spacing(2),
    },
    banner: {
        minWidth: "100%"
    },
    blue: {
        color: "#205DF5",
    },
    grey: {
        color: "#707070"
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
          }
          organization {
            _id
            slug
          }
        }
      }
    }
  }
`

export default ({ data, children }) => {
    const history = useHistory()
    const classes = useStyles();
    const [showDocs, setShowDocs] = useState()

    const { userProfile, error, params, adminView } = useAuth(GET_INVESTOR)

    const chartOptionsA = {
        title: '',
        pieHole: 0.5,
    };
    const chartOptionsB = {
        title: '',
        vAxis: { title: '' },
        legend: 'none'
    };


    if (!userProfile.email) return <Loader />
    const groupedByMonth = _.groupBy(userProfile?.investments, inv => {
        const timestamp = inv?._id.toString().substring(0, 8)
        const date = new Date(parseInt(timestamp, 16) * 1000)
        const addedDate = moment(date).format('MMM YY')
        return addedDate.substring(0, 6);
    })
    const groupedData = _.mapValues(groupedByMonth, (monthData,) => {
        const monthSum = _.sumBy(monthData, 'value')
        return monthSum
    })
    const arrayData = Object.keys(groupedData).map((key, index) => {
        return [key, groupedData[key]]
    });
    const graphBData = arrayData.map((data, index) => {
        const prevMonths = arrayData[index - 1] ? arrayData.slice(0, index) : []
        const prevMonthsTotal = prevMonths.reduce((acc, m) => {
            return acc + m[1]
        }, 0)
        return [data[0], prevMonthsTotal + data[1]]
    })
    const investmentTotal = _.sumBy(userProfile.investments, 'value')
    const multipleSum = (userProfile.investments.reduce((acc, inv) => {
        return acc += parseInt(inv.deal.dealParams.dealMultiple)
    }, 0) / userProfile.investments.length).toFixed(2)
    return (
        <div className="blue-container">
            <Grid container spacing={12} justify="space-between" style={{ marginTop: "40px", marginBottom: '1rem' }}>
                <Grid item xs={12} sm={12} md={4} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "100px" }}>
                        <Grid container style={{ padding: '0.1rem', justifyContent: 'space-between' }} >
                            <Grid item sm={8} md={8}>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Portfolio Value</p>
                                <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>$ {nWithCommas(investmentTotal)}.00</h2>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>0% realized | 100% unrealized</p>
                            </Grid>
                            <Grid item sm={4} md={4}>
                                <img src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-dollar-sign.svg" alt="oops" style={{ width: "50px", height: "50px", marginTop: "30%" }} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={4} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "100px" }}>
                        <Grid container style={{ padding: '0.1rem', justifyContent: 'space-between' }} >
                            <Grid item sm={8} md={8}>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Total Invested</p>
                                <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>$ {nWithCommas(investmentTotal)}.00</h2>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>{userProfile?.investments?.length} Total Investments</p>
                            </Grid>
                            <Grid item sm={4} md={4}>
                                <img src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-bar-chart.svg" alt="oops" style={{ width: "50px", height: "50px", marginTop: "30%" }} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={4} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "100px" }}>
                        <Grid container style={{ padding: '0.1rem', justifyContent: 'space-between' }} >
                            <Grid item sm={8} md={8}>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Multiple</p>
                                <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>{_.isNumber(multipleSum) ? multipleSum : 0}x</h2>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Last Update: 29th Sept 2020</p>
                            </Grid>
                            <Grid item sm={4} md={4}>
                                <img src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-mulitple.svg" alt="oops" style={{ width: "50px", height: "50px", marginTop: "30%" }} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <>
                <Grid container justify="space-between" style={{ marginTop: "1em" }}>
                    <Grid item xs={12} sm={12} md={6} style={{ border: "1em solid transparent" }}>
                        <Paper style={{ minHeight: "400px" }}>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Portfolio Overview</p>
                            {/* <h6 style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "0px" }}>Portfolio Management</h6> */}
                            <Grid item sm={12} md={12}>
                                {userProfile.investments.length !== 0 ? <Chart chartType="PieChart"
                                    width="100%"
                                    height="300px"
                                    data={[['Investment', 'Amount'], ...userProfile.investments.map(inv => ([inv.deal.company_name, inv.amount]))]}
                                    options={chartOptionsA} /> : null}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} style={{ border: "1em solid transparent" }}>
                        <Paper style={{ minHeight: "400px" }}>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Portfolio Value</p>
                            <Grid item sm={12} md={12}>
                                {userProfile.investments.length !== 0 ? <Chart chartType="SteppedAreaChart"
                                    width="100%"
                                    height="300px"
                                    data={[['Time', 'Value'], ...graphBData]}
                                    options={chartOptionsB} /> : null}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid >
                <Grid item sm={12} md={12} style={{ border: "1em solid transparent" }}>

                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow style={{ borderBottom: 'solid black 1px' }}>
                                    <TableCell className={classes.tableHeader} align="left">Name</TableCell>
                                    <Hidden only="xs"><TableCell className={classes.tableHeader} align="center">Status</TableCell></Hidden>
                                    <Hidden only="xs"><TableCell className={classes.tableHeader} align="center">Investment Date</TableCell></Hidden>
                                    <TableCell className={classes.tableHeader} align="center">Investment Amount</TableCell>
                                    <Hidden only="xs"><TableCell className={classes.tableHeader} align="center">Investment Value</TableCell></Hidden>
                                    <Hidden only="xs"><TableCell className={classes.tableHeader} align="center">Multiple</TableCell></Hidden>
                                    <TableCell className={classes.tableHeader} align="center">Deal Page</TableCell>
                                    <Hidden only="xs"><TableCell className={classes.tableHeader} align="center">Documents</TableCell></Hidden>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userProfile.investments.map((investment) =>
                                    showDocs?._id === investment?._id ?
                                        <>
                                            <TR investment={investment} setShowDocs={setShowDocs} showDocs={showDocs} />
                                            <DocsRow key={showDocs._id + "-docs"} docs={showDocs.documents} investment={investment} />
                                        </>
                                        : <TR investment={investment} setShowDocs={setShowDocs} showDocs={showDocs} />)}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </>
        </div >
    )
}

const TR = ({ investment, setShowDocs, showDocs }) => {
    const history = useHistory()
    const timestamp = investment._id.toString().substring(0, 8)
    const date = new Date(parseInt(timestamp, 16) * 1000)
    const addedDate = moment(date).format('Do MMM YYYY')
    const showDocsFn = () => setShowDocs(showDocs ? false : investment)
    return (
        <TableRow key={investment._id} className="investment-row">
            <TableCell align="left" onClick={showDocsFn}>{investment.deal.company_name}</TableCell>
            <Hidden only="xs"><TableCell onClick={showDocsFn} align="center"><InvestmentStatus investment={investment} /></TableCell></Hidden>
            <Hidden only="xs"><TableCell onClick={showDocsFn} align="center">{addedDate}</TableCell></Hidden>
            <TableCell onClick={showDocsFn} align="center">${nWithCommas(investment.amount)}</TableCell>
            <Hidden only="xs"><TableCell onClick={showDocsFn} align="center">${nWithCommas(investment.value)}</TableCell></Hidden>
            <Hidden only="xs"><TableCell onClick={showDocsFn} align="center">{investment.deal.dealParams.dealMultiple}x</TableCell></Hidden>
            <Hidden only="xs"><TableCell onClick={showDocsFn} align="center">
                <Button variant="contained" size="small" color="secondary" onClick={() => history.push(_.get(investment, 'deal.appLink', ""))}>
                    View
                </Button>
            </TableCell></Hidden>
            <TableCell align="center">
                <Button variant="contained" size="small" color="primary" onClick={showDocsFn}>
                    View
                </Button>
            </TableCell>
        </TableRow>
    )
}
function InvestmentStatus({ investment }) {
    const { status } = investment
    return (
        <span className={`investment-status investment-status-${status}`}>{status}</span>
    )
}

function filename(path) {
    try {
        return path.split('/')[2]
    } catch {
        return path
    }
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
                        {docs.map(doc => (
                            <Document doc={doc} investment={investment} />
                        ))}
                    </Grid>
                </TableCell>
            </TableRow>
        </>
    )
}