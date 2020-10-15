import React from 'react';
import { gql } from 'apollo-boost'

import {
    Paper,
    Grid,
} from '@material-ui/core';
import _ from 'lodash'
import Chart from "react-google-charts"
import { useHistory } from "react-router-dom"
import { nWithCommas } from '../../../utils/numbers'
import moment from 'moment'

export default ({ data, children }) => {
    const history = useHistory()

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
        title: '',
        vAxis: { title: '' },
        isStacked: true
    };
    const groupedByMonth = _.groupBy(data, (inv) => {
        const addedDate = moment(inv.date).format('MMM YY')
        return addedDate.substring(0, 6)
    })
    const groupedData = _.mapValues(groupedByMonth, (monthData) => {
        const monthSum = _.sumBy(monthData.map(inv => ({ ...inv, amount: _.toNumber(inv.Debit.replaceAll(',', '')) })), 'amount')
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
    return (
        <div className="blue-container">
            {children}

            <Grid container justify="space-between" style={{ marginTop: "40px" }}>
                <Grid item xs={12} sm={12} md={4} style={{ border: "1em solid transparent" }}>

                    <Paper style={{ minHeight: "100px" }}>
                        <Grid container style={{ padding: '0.1rem', justifyContent: 'space-between' }} >
                            <Grid item sm={8} md={8}>
                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Portfolio Value</p>
                                <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>${nWithCommas(_.sumBy(data.map(inv => ({ ...inv, debit: _.toNumber(inv.Debit.replaceAll(',', '')) })), 'debit'))}</h2>

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
                                <h2 align="left" style={{ color: "rgba(0,0,0,0.8)", paddingLeft: "10px" }}>${nWithCommas(_.sumBy(data.map(inv => ({ ...inv, debit: _.toNumber(inv.Debit.replaceAll(',', '')) })), 'debit'))}</h2>

                                <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>{data.length} Total Investments</p>
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
                            <Grid item sm={4} md={4} justify="center" align="center">
                                <img src="https://allocations-public.s3.us-east-2.amazonaws.com/icon-mulitple.svg" alt="oops" style={{ width: "50px", height: "50px", marginTop: "30%" }} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container justify="space-between" style={{ marginTop: "1em" }}>
                <Grid item xs={12} sm={6} md={6} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "400px" }}>
                        <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Portfolio Overview</p>
                        {/* <h6 style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "0px" }}>Portfolio Management</h6> */}

                        <Grid item sm={12} md={12}>
                            <Chart chartType="PieChart"
                                width="100%"
                                height="300px"
                                chartEvents={chartEvents}
                                data={[['Investment', 'Amount'], ...data.map(investment => ([investment.Description.split('-')[0], _.toNumber(investment.Debit.replaceAll(',', ''))]))]}
                                options={chartOptionsA} />
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} style={{ border: "1em solid transparent" }}>
                    <Paper style={{ minHeight: "400px" }}>
                        <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "10px", paddingTop: "10px" }}>Multiple</p>

                        <Grid item sm={12} md={12}>
                            <Chart chartType="SteppedAreaChart"
                                width="100%"
                                height="300px"
                                options={{
                                    legend: 'none'
                                }}
                                chartEvents={chartEvents}
                                data={[['Time', 'Value'], ...graphBData]}
                                optionsA={chartOptionsB} />
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

        </div>
    )
}

// '9/2020', _.sumBy(data.map(inv => ({ ...inv, debit: _.toNumber(inv.Debit.replaceAll(',', '')) })), 'debit')]