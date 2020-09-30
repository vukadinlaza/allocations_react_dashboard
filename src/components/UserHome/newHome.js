import React from 'react';
import { gql } from 'apollo-boost'
import Loader from '../utils/Loader'
import {
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button
} from '@material-ui/core';
import _ from 'lodash'
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
    const investmentTotal = _.sumBy(userProfile.investments, 'amount')
    return (
        <div className="blue-container">
            <Grid container spacing={6} justify="space-between" style={{ marginTop: "40px", marginBottom: '1rem' }}>
                <Grid item sm={12} md={4} style={{ border: "solid transparent" }}>
                    <Paper style={{ minHeight: "100px" }}>
                        <Grid container style={{ paddingLeft: '1rem' }}>
                            <Grid item sm={8} md={8}>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Portfolio Value</p>
                                <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>$ {nWithCommas(investmentTotal)}.00</h2>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>0% realized | 100% unrealized</p>
                            </Grid>
                            <Grid item sm={4} md={4} justify="center" align="center">
                                <img src="https://allocations-public.s3.us-east-2.amazonaws.com/money-sign.png" alt="oops" style={{ width: "50px", height: "50px", marginTop: "30%" }} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item sm={12} md={4} style={{ border: "solid transparent" }}>
                    <Paper style={{ minHeight: "100px" }}>
                        <Grid item sm={8} md={8}>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Total Invested</p>
                            <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>$ {nWithCommas(investmentTotal)}.00</h2>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>{userProfile?.investments?.length} Total Investments</p>
                        </Grid>
                        <Grid item sm={4} md={4}>

                        </Grid>
                    </Paper>
                </Grid>
                <Grid item sm={12} md={4} style={{ border: "solid transparent" }}>
                    <Paper style={{ minHeight: "100px" }}>
                        <Grid item sm={8} md={8}>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Multiple</p>
                            <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>1</h2>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>1</p>
                        </Grid>
                        <Grid item sm={4} md={4}>

                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={1} justify="space-between" style={{
                marginTop: "1rem"
            }}>
                < Grid item sm={12} md={6} style={{ border: "solid transparent" }}>
                    <Paper style={{ minHeight: "375px" }}>
                        <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Overview</p>
                        <h6 style={{ color: "#172B4D", paddingLeft: "10px", paddingTop: "0px", paddingBottom: '-1rem' }}>Portfolio Management</h6>
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
                <Grid item sm={12} md={6} style={{ border: "solid transparent" }}>
                    <Paper style={{ minHeight: "375px" }}>
                        <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px" }}>Unrealized vs Realized</p>
                        <Grid item sm={12} md={12}>
                            <Chart chartType="SteppedAreaChart"
                                width="100%"
                                height="300px"
                                chartEvents={chartEvents}
                                optionsA={chartOptionsB} />
                        </Grid>
                    </Paper>
                </Grid>
            </Grid >
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
                        {userProfile.investments.map((investment) => <TR investment={investment} />)}
                    </TableBody>
                </Table>
            </Paper>
        </div >
    )
}

const TR = ({ investment }) => {
    const classes = useStyles();
    const history = useHistory()
    return (
        <TableRow key={investment._id} className="investment-row">
            <TableCell align="center">{investment.deal.company_name}</TableCell>
            <TableCell align="center"><InvestmentStatus investment={investment} /></TableCell>
            <TableCell align="center">{investment.created_at}</TableCell>
            <TableCell align="center">${nWithCommas(investment.amount)}</TableCell>
            <TableCell align="center">${nWithCommas(investment.amount)}</TableCell>
            <TableCell align="center">1x</TableCell>
            <TableCell align="center">
                <Button variant="contained" size="small" color="secondary" onClick={() => history.push(_.get(investment, 'deal.appLink', ""))}>
                    View
                </Button>
            </TableCell>
            <TableCell align="center">
                <Button variant="contained" size="small" color="primary">
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