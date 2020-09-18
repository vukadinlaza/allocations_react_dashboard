import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'

import {
  Paper,
  Grid,
  ButtonBase,
  Typography,
  FormControl,
  Button,
  TextField
} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom"
import { ActiveDeals } from './components/active-deals'
import ClosedDeals from './components/closed-deals'
import Loader from '../../utils/Loader'
import Investors from '../../Investors'
import Settings from './components/settings'
import Investments from '../../Investments'
import Chart from "react-google-charts"


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  divider: {
    margin: "16px -16px"
  },
  tabs: {
    borderTop: "1px solid #dfe3e9",
    borderBottom: "1px solid #dfe3e9",
    background: "#f7f9fa",
    minHeight: 44,
    margin: "40px 0",
  },
  text: {
    color: "#7f8ea3"
  },
  tab: {
    height: 42,
    width: "100%"
  },
  subtitle: {
    color: "#3A506B",
    marginTop: 16
  },
  activeTab: {
    height: 42,
    paddingTop: 3,
    width: "100%",
    borderBottom: "3px solid #205DF5",
    outline: "0 !important",
  },
  button: {
    margin: ".5rem"
  },
  orgName: {
    color: '#3A506B',
    fontWeight: 'bolder'
  }
}));

export const ORG_OVERVIEW = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      name
      slug
      deals {
        _id
        raised
        appLink
        status
        date_closed
        dealParams {
          wireDeadline
        }
        company_name
        company_description
        target
      }
    }
    investor {
      _id
      admin
      documents
    }
  }
`

export default function AdminHome({ }) {
  const { organization: orgSug } = useParams()
  const [tab, setTab] = useState("active-deals");
  const classes = useStyles();
  const { data, error, refetch } = useQuery(ORG_OVERVIEW, {
    variables: { slug: orgSug }
  })

  const history = useHistory()
  const chartEvents = [
    {
      eventName: "select",
      callback({chartWrapper}) {
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
    vAxis: {title: 'Accumulated Rating'},
    isStacked: true
  };
  var daters = ([
    ['Director (Year)',  'Rotten Tomatoes', 'IMDB'],
    ['Alfred Hitchcock (1935)', 8.4,         7.9],
    ['Ralph Thomas (1959)',     6.9,         6.5],
    ['Don Sharp (1978)',        6.5,         6.4],
    ['James Hawes (2008)',      4.4,         6.2]
  ]);
  const dater = ([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);

  if (!data) return <Loader />
  const orgData = data.organization

  if (!orgData) return <Paper style={{ padding: "25px" }}><Loader /></Paper>
  return (
    <>
    <div style={{ height: "320px", 
    background: "blue", 
    marginTop:"-30px", 
    paddingTop: "30px",
    paddingBottom: "60px", 
    marginLeft: "-32px", 
    paddingLeft: "32px", 
    marginRight: "-32px", 
    paddingRight: "32px" }}>
      <Grid container justify="space-between">
        <Grid item sm={12} md={6}>
          <Typography variant="h4" className={classes.orgName} style={{ color: "#fff"}}>
            {orgData.name}
          </Typography>
        </Grid>
        <Grid item sm={12} md={6}>
          <Typography variant="body2" style={{ textAlign: "right" }}>
            <Grid item xs={12}>
              {data.investor.admin && <SuperAdmin org={orgData} />}
            </Grid>
          </Typography>
        </Grid>
      </Grid>

      <Grid container justify="space-between" style={{ marginTop: "40px"}}>
        <Grid item sm={12} md={3}>
          <Paper style={{ minHeight: "100px"}}>
            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px"}}>Portfolio Value</p>
            <h2 align="center" style={{ color: "rgba(0,0,0,0.8)" }}>$1,225,000</h2>
            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px"}}>50% realized | 50% unrealized</p>
          </Paper>
        </Grid>
        <Grid item sm={12} md={3}>
          <Paper style={{ minHeight: "100px"}}>
            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px"}}>Total Invested</p>
            <h2 align="center" style={{ color: "rgba(0,0,0,0.8)" }}>$1,225,000</h2>
            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px"}}>8 Total Investments</p>
          </Paper>
        </Grid>
        <Grid item sm={12} md={3}>
          <Paper style={{ minHeight: "100px"}}>
            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px"}}>Multiple</p>
            <h2 align="center" style={{ color: "rgba(0,0,0,0.8)" }}>1.02</h2>
            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px"}}>+ 1.2% IRR</p>
          </Paper>
        </Grid>
      </Grid>

      <Grid container justify="space-between" style={{ marginTop: "40px"}}>
        <Grid item sm={12} md={5}>
          <Paper style={{ minHeight: "300px"}}>
            <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px"}}>Overview</p>
            <h6 style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px"}}>Portfolio Management</h6>
              <Grid item sm={12} md={12}>
                        <Chart chartType="PieChart"
                              width="100%"
                              height="200px"
                              chartEvents={chartEvents}
                              data={dater}
                              options={chartOptionsA}/>
              </Grid>
          </Paper>
        </Grid>
        <Grid item sm={12} md={5}>
          <Paper style={{ minHeight: "300px"}}>
          <p style={{ color: "rgba(0,0,0,0.4)", paddingLeft: "5px"}}>Unrealized vs Realized</p>
              <Grid item sm={12} md={12}>
                      <Chart chartType="SteppedAreaChart"
                             width="100%"
                             height="200px"
                             chartEvents={chartEvents}
                             data={daters}
                             optionsA={chartOptionsB}/>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      </div>

      <div className={classes.tabs} style={{ marginTop: "300px"}}>
        <Grid container>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "active-deals" ? classes.activeTab : classes.tab}
              onClick={() => setTab('active-deals')}>
              Active Deals
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "closed-deals" ? classes.activeTab : classes.tab}
              onClick={() => setTab('closed-deals')}>
              Closed Deals
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "all-investors" ? classes.activeTab : classes.tab}
              onClick={() => setTab('all-investors')}>
              Investors
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "investments" ? classes.activeTab : classes.tab}
              onClick={() => setTab('investments')}>
              Investments
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={tab === "setting" ? classes.activeTab : classes.tab}
              style={{ borderRight: "1px solid #e1e9ec" }}
              onClick={() => setTab('setting')}>
              Settings
            </ButtonBase>
          </Grid>
        </Grid>
      </div>

      <>
        {tab === "active-deals" && <ActiveDeals orgData={orgData} />}
        {tab === "closed-deals" && <ClosedDeals orgData={orgData} />}
        {tab === "all-investors" && <Investors />}
        {tab === "investments" && <Investments />}
        {tab === "setting" && <Settings orgData={orgData} investor={data.investor} refetch={refetch} />}
      </>
    </>
  )
}

function SuperAdmin({ org }) {
  const history = useHistory();
  return (
    <>
      <span style={{color: "#fff"}}>You are a SuperAdmin <Button style={{ marginLeft: 16 }} onClick={() => history.push(`/admin/${org.slug}/manager`)} size="large"
        variant="contained" color="primary">Manage</Button></span>
    </>
  )
}