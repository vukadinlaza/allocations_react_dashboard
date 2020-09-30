import React from 'react';
import { gql } from 'apollo-boost'
import Loader from '../utils/Loader'
import {
    Paper,
    Grid,
} from '@material-ui/core';
import _ from 'lodash'
import Chart from "react-google-charts"
import { useHistory } from "react-router-dom"
import { nWithCommas } from '../../utils/numbers'
import { useAuth } from "../../auth/useAuth";


import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

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
        deal {
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
  }
`

export default ({ data, children }) => {
    const history = useHistory()
    const { userProfile, error, params, adminView } = useAuth(GET_INVESTOR)

    const chartEvents = [
        {
            eventName: "select",
            callback({ chartWrapper }) {
                history.push(`/investments`)
            }
        }
    ];
    console.log(userProfile)
    const chartOptionsA = {
        title: '',
        pieHole: 0.5,
    };
    const chartOptionsB = {
        title: 'The decline of \'The 39 Steps\'',
        vAxis: { title: 'Accumulated Rating' },
        isStacked: true
    };
    if (!userProfile.email) return <Loader />
    const investmentTotal = _.sumBy(userProfile.investments, 'amount')
    return (
        <div style={{
            height: "430px",
            background: "#005EFF",
            marginTop: "-30px",
            paddingTop: "30px",
            paddingBottom: "60px",
            marginLeft: "-32px",
            paddingLeft: "32px",
            marginRight: "-32px",
            paddingRight: "32px"
        }}>
            {children}

            <Grid container justify="space-between" style={{ marginTop: "40px" }}>
                <Grid item sm={12} md={4} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "100px" }}>
                        <Grid container style={{ paddingLeft: '1rem' }}>
                            <Grid item sm={8} md={8}>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Portfolio Value</p>
                                <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>$ {nWithCommas(investmentTotal)}.00</h2>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>0% realized | 100% unrealized</p>
                            </Grid>
                            <Grid item sm={4} md={4} justify="center" align="center">
                                <img src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-dollar-sign.svg" alt="oops" style={{ width: "50px", height: "50px", marginTop: "30%" }} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item sm={12} md={4} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "100px" }}>
                    <Grid container style={{ paddingLeft: '1rem' }}>
                        <Grid item sm={8} md={8}>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Total Invested</p>
                            <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>$ {nWithCommas(investmentTotal)}.00</h2>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>{userProfile?.investments?.length} Total Investments</p>
                        </Grid>
                        <Grid item sm={4} md={4} justify="center" align="center">
                                <img src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-bar-chart.svg" alt="oops" style={{ width: "50px", height: "50px", marginTop: "30%" }} />
                        </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item sm={12} md={4} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "100px" }}>
                    <Grid container style={{ paddingLeft: '1rem' }}>
                        <Grid item sm={8} md={8}>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Multiple</p>
                            <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>1</h2>
                            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>1</p>
                        </Grid>
                        <Grid item sm={4} md={4} justify="center" align="center">
                                <img src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-mulitple.svg" alt="oops" style={{ width: "50px", height: "50px", marginTop: "30%" }} />
                        </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container justify="space-between" style={{ marginTop: "1em" }}>
                <Grid item sm={12} md={6} style={{ border: "1em solid transparent" }}>
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
                <Grid item sm={12} md={6} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "400px" }}>
                        <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Multiple</p>
                        <Grid item sm={12} md={12}>
                            <Chart chartType="SteppedAreaChart"
                                width="100%"
                                height="300px"
                                chartEvents={chartEvents}
                                optionsA={chartOptionsB} />
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}