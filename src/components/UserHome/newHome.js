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
    Typography
} from '@material-ui/core';
import _ from 'lodash'
import moment from 'moment'

import Chart from "react-google-charts"
import { useHistory } from "react-router-dom"
import { nWithCommas } from '../../utils/numbers'
import { useAuth } from "../../auth/useAuth";
import { makeStyles } from '@material-ui/core/styles';
import './style.scss'

import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';


const useStyles = makeStyles((theme) => ({
    tableHeader: {
        textTransform: 'uppercase !important',
        color: '#3A506B !important',
        fontSize: '.75rem',
        fontWeight: 'bold'
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

    const chartEvents = [
        {
            eventName: "select",
            callback({ chartWrapper }) {
                history.push(`/investments`)
            }
        }
    ];
    const chartOptionsA = {
        title: '',
        pieHole: 0.5,
    };
    const chartOptionsB = {
        title: 'The decline of \'The 39 Steps\'',
        vAxis: { title: 'Accumulated Rating' },
        legend: 'none'
    };


    if (!userProfile.email) return <Loader />
    const graphData = userProfile?.investments.sort((a, b) => a.created_at - b.created_at).reduce((acc, inv, index) => {
        const sum = index > 1 ? _.sumBy(acc, '[1]') : 0
        const date = moment.unix(inv.created_at / 1000).format('DD/MM/YY')
        const point = [date, sum + inv.amount]
        return [...acc, point]
    }, [])

    const investmentTotal = _.sumBy(userProfile.investments, 'amount')
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
                                <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>1x</h2>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Last Update: 29th Sept 2020</p>
                            </Grid>
                            <Grid item sm={4} md={4}>
                                <img src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-mulitple.svg" alt="oops" style={{ width: "50px", height: "50px", marginTop: "30%" }} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container justify="space-between" style={{ marginTop: "1em" }}>
                <Grid item xs={12} sm={12} md={6} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "400px" }}>
                        <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Portfolio Overview</p>
                        {/* <h6 style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "0px" }}>Portfolio Management</h6> */}
                        <Grid item sm={12} md={12}>
                            <Chart chartType="PieChart"
                                width="100%"
                                height="300px"
                                data={[['Investment', 'Amount'], ...userProfile.investments.map(inv => ([inv.deal.company_name, inv.amount]))]}
                                chartEvents={chartEvents}
                                options={chartOptionsA} />
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12}  sm={12} md={6} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "400px" }}>
                        <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Account Value</p>
                        <Grid item sm={12} md={12}>
                            <Chart chartType="LineChart"
                                width="100%"
                                height="300px"
                                data={[['Time', 'Amount'], ...graphData]}
                                chartEvents={chartEvents}
                                optionsA={chartOptionsB} />
                        </Grid>
                    </Paper>
                </Grid>
            </Grid >
            <Grid item sm={12} md={12} style={{ border: "1em solid transparent" }}>

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow style={{ borderBottom: 'solid black 1px' }}>
                                <TableCell className={classes.tableHeader} align="center">Company/Fund</TableCell>
                                <TableCell className={classes.tableHeader} align="center">Status</TableCell>
                                <TableCell className={classes.tableHeader} align="center">Investment Date</TableCell>
                                <TableCell className={classes.tableHeader} align="center">Investment Amount</TableCell>
                                <TableCell className={classes.tableHeader} align="center">Value</TableCell>
                                <TableCell className={classes.tableHeader} align="center">Mulitple</TableCell>
                                <TableCell className={classes.tableHeader} align="center">Deal Page</TableCell>
                                <TableCell className={classes.tableHeader} align="center">Documents</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userProfile.investments.map((investment) =>
                                showDocs?._id === investment?._id ?
                                    <>
                                        <TR investment={investment} setShowDocs={setShowDocs} showDocs={showDocs} />
                                        <DocsRow key={showDocs._id + "-docs"} docs={showDocs.documents} />
                                    </>
                                    : <TR investment={investment} setShowDocs={setShowDocs} showDocs={showDocs} />)}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        </div >
    )
}

const TR = ({ investment, setShowDocs, showDocs }) => {
    const history = useHistory()
    return (
        <TableRow key={investment._id} className="investment-row">
            <TableCell align="center">{investment.deal.company_name}</TableCell>
            <TableCell align="center"><InvestmentStatus investment={investment} /></TableCell>
            <TableCell align="center">{moment.unix(investment.created_at / 1000).format('Do MMM YYYY')}</TableCell>
            <TableCell align="center">${nWithCommas(investment.amount)}</TableCell>
            <TableCell align="center">${nWithCommas(investment.amount)}</TableCell>
            <TableCell align="center">1x</TableCell>
            <TableCell align="center">
                <Button variant="contained" size="small" color="secondary" onClick={() => history.push(_.get(investment, 'deal.appLink', ""))}>
                    View
                </Button>
            </TableCell>
            <TableCell align="center">
                <Button variant="contained" size="small" color="primary" onClick={() => setShowDocs(showDocs ? false : investment)}>
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

function DocsRow({ docs }) {
    return (
        <>
            <TableRow>
                <TableCell colSpan={6}>
                    <Typography variant="subtitle2" style={{ marginBottom: '1rem' }}>
                        Documents may take up to 7 days to appear here after signing.
            </Typography>
                    {docs.map(doc => (
                        <div key={doc.path} className="doc-wrapper">
                            <div className="filename">
                                <FontAwesomeIcon color="#F48FB1" icon={["far", "file-pdf"]} className="doc-icon" />
                                <span><a href={`https://${doc.link}`} target="_blank"
                                    rel="noopener noreferrer">{filename(doc.path)}</a></span>
                            </div>
                        </div>
                    ))}
                </TableCell>
            </TableRow>
        </>
    )
}