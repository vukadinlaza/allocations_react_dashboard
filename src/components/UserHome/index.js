import React, {useEffect} from 'react'
import _ from 'lodash'
import {gql} from 'apollo-boost'
import {Link, useParams, useHistory, Redirect} from 'react-router-dom'
import {useLazyQuery} from '@apollo/react-hooks';
import {Row, Container, Col} from 'reactstrap'
import {nWithCommas} from '../../utils/numbers'
import {validate} from '../forms/InvestorEdit'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAuth} from "../../auth/useAuth"
import {
  Avatar,
  Hidden,
  Paper,
  ListItem,
  List,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Grid,
  Button,
  Fab,
  Typography
} from '@material-ui/core'

import Loader from '../utils/Loader'
import Chart from "react-google-charts"
import "./style.scss";
import {makeStyles} from "@material-ui/core/styles";

const purples = ["#6200EE", "#BB9FE6"]

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  lightText: {
    color: "#7f8fa3",
  }
}));

const chartOptions = {
  minColor: purples[1],
  maxColor: purples[0],
  headerHeight: 0,
  fontColor: "#fff",
  highlightColor: "#fff",
  showTooltips: false,
  maxDepth: 1,
  maxPostDepth: 2
  // showScale: true
};

function formatData(investments) {
  const grouped = investments.reduce((acc, inv) => {
    if (acc[inv.deal._id]) {
      acc[inv.deal._id].amount += inv.amount
    } else {
      acc[inv.deal._id] = {...inv}
    }
    return acc
  }, {})

  const d = Object.values(grouped).map((d, i) => [d.deal.company_name, 'All', d.amount, d.amount - (i * 5000)])

  return [
    ['Company', 'Group', 'Amount Invested (size)', 'Company Color (color)'],
    ['All', null, 0, 0]
  ].concat(d)
}

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
`

function orderInvestments(investments) {
  const pastInvited = investments.filter(({status}) => status !== "invited")
  return _.take(_.orderBy(pastInvited, i => new Date(i.deal.date_closed).getTime(), 'desc'), 3)
}

export default function UserHome(props) {
  const classes = useStyles();

  const history = useHistory()
  const {userProfile, error, params, adminView, } = useAuth(GET_INVESTOR)

  if (error) {
    if (error.message === "GraphQL error: permission denied" && userProfile && userProfile.email) {
      return <Redirect to="/signup"/>
    }
  }

  if (!userProfile.email) return <div><Loader/></div>

  const total_invested = _.sumBy(userProfile.investments, 'amount') || 0

  const returningInvestor = total_invested !== 0
  return (
    <>
      {/* TODO: Move to NavBar <AdminTile investor={investor}/>*/}

      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={2} alignItems="center">
              <Hidden only="xs">
                <Grid item sm={12} md={4}>
                  <Typography variant="body1" className={classes.lightText}>
                    Welcome
                  </Typography>
                  {returningInvestor && <Typography variant="h5">
                    <Name investor={userProfile}/>
                  </Typography>}
                </Grid>
              </Hidden>
              <Grid item sm={12} md={8}>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                  <Hidden only="xs">
                    <Typography variant="body1" className={classes.lightText}
                                style={{textAlign: "right", paddingRight: 16}}>
                      Your Allocations account is ready for your use. <br/>
                      Let's view your investments
                    </Typography>
                  </Hidden>
                  <Button
                    onClick={() => history.push(adminView ? `/investor/${params.id}/investments` : "/investments")}
                    variant="contained" color="primary">
                    Investments
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {returningInvestor && <>
          <Grid item sm={12} md={6}>
            <Paper className={classes.paper} style={{height: "100%"}}>
              <Typography variant="h6" style={{marginBottom: 16}}>
                Total Investments
              </Typography>
              <Typography variant="h3">
                ${nWithCommas(total_invested)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item sm={12} md={6}>
            <Paper className={classes.paper}>
              <Typography variant="h6" style={{marginBottom: 16}}>
                Portfolio
              </Typography>
              {userProfile.investments.length > 0 ?
                <Chart chartType="TreeMap"
                       width="100%"
                       height="200px"
                       data={formatData(userProfile.investments)}
                       options={chartOptions}/> : null
              }
            </Paper>
          </Grid>
        </>}

        {!returningInvestor && <Grid item xs={12} sm={6}>
          <NextSteps investor={userProfile}/>
        </Grid>}

        {returningInvestor && <>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper} style={{paddingBottom: 0}}>
              <Typography variant="h6" style={{marginBottom: 16}}>
                Most Recent Investments
              </Typography>
              <div style={{margin: "0px -16px", cursor: "pointer"}}>
                <Table style={{marginBottom: "-1px"}}>
                  {orderInvestments(userProfile.investments).map((investment, i) => (
                    <InvestmentStub key={i} investment={investment}/>
                  ))}
                </Table>
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper} style={{paddingBottom: 0}}>
              <Typography variant="h6" style={{marginBottom: 16}}>
                Invited Deals
              </Typography>
              <div style={{margin: "0px -16px", cursor: "pointer"}}>
                <Table style={{marginBottom: "-1px"}}>
                  {userProfile.invitedDeals.map((deal, i) => (
                    <DealStub key={i} deal={deal}/>
                  ))}
                </Table>
              </div>
            </Paper>
          </Grid>
        </>}

      </Grid>
    </>
  )
}

function Name({investor}) {
  return investor.investor_type === "entity" ? investor.entity_name : investor.first_name
}

function InvestmentStub({investment}) {
  const history = useHistory()

  if (investment.status === "invited") return null

  const {deal} = investment
  const link = deal.organization
    ? `/deals/${deal.organization.slug}/${deal.slug}`
    : `/deals/${deal.slug}`

  return (
    <TableRow hover style={{borderTop: "1px solid #dfe1e5"}} button key={investment._id}
              className="investment-stub"
              onClick={e => {
                e.stopPropagation()
                history.push(link)
              }}>
      <TableCell>{deal.company_name}</TableCell>
      <TableCell style={{color: "#7f8fa4", fontWeight: "500"}}>
        {investment.amount ? `$${nWithCommas(investment.amount)}` :
          <i>TBD</i>}
      </TableCell>
      <TableCell style={{textAlign: "right"}}>
        <span className={`investment-status investment-status-${investment.status}`}>{investment.status}</span>
      </TableCell>
    </TableRow>
  )
}

function NextSteps({investor}) {
  const history = useHistory()

  const profileComplete = investor && validate(investor).length === 0
  return (
    <>
      <Typography variant="h6">
        🚨 Next Steps
      </Typography>
      <Paper style={{padding: "16px"}}>
        <List>
          <ListItem button onClick={() => history.push(`/profile`)}>
            <span>📚 Complete Your Profile</span> {profileComplete && <span className="checkbox">✅</span>}
          </ListItem>
          <ListItem button disabled>
            <span>💵 Track My SPV Investment <small className="coming-soon">coming soon</small></span>
          </ListItem>
          <ListItem button disabled>
            <span>📬 Apply to Join a Fund <small className="coming-soon">coming soon</small></span>
          </ListItem>
          <ListItem button disabled>
            <span>🏦 Apply to be a Fund Manager <small className="coming-soon">coming soon</small></span>
          </ListItem>
        </List>
      </Paper>
    </>
  )
}

function DealStub({deal}) {
  const history = useHistory()
  const link = deal.organization
    ? `/deals/${deal.organization.slug}/${deal.slug}`
    : `/deals/${deal.slug}`

  return (
    <TableRow hover button key={deal._id} className="deal-stub" onClick={() => history.push(link)}>
      <TableCell>{deal.company_name}</TableCell>
      <TableCell>{deal.date_closed || "TBD"}</TableCell>
      <TableCell style={{textAlign: "right"}}>
        <span data-status={deal.status} className="deal-status">{deal.status}</span>
      </TableCell>
    </TableRow>
  )
}

function AdminTile({investor}) {
  if (investor.admin || (investor.organizations_admin || []).length > 0) {
    return (
      <Col sm={{size: 8, offset: 2}}>
        <div className="tile admin-tile">
          <div className="text-center">
            You are a Fund Manager &nbsp;&nbsp;
            <Link to="/admin/funds">
              <Button variant="contained" size="small" color="secondary">
                My Funds 🗂
              </Button>
            </Link>
          </div>
        </div>
      </Col>
    )
  }
  return null
}
