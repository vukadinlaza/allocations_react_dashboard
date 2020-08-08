import React, {useEffect} from 'react'
import _ from 'lodash'
import {gql} from 'apollo-boost'
import {Link, useParams, useHistory, Redirect} from 'react-router-dom'
import {useLazyQuery} from '@apollo/react-hooks';
import {Row, Container, Col} from 'reactstrap'
import {nWithCommas} from '../../utils/numbers'
import {validate} from '../forms/InvestorEdit'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAuth} from "../../auth/useAuth";
import allocations_create_deal from '../../assets/allocations_create_deal.svg';
import allocations_faq from '../../assets/allocations_create_deal.svg';
import allocations_invite_deals from '../../assets/allocations_invite_deals.svg';
import allocations_recent_investments from '../../assets/allocations_recent_investments.svg';
import allocations_total_investments from '../../assets/allocations_total_investments.svg';
import allocations_update_profile from '../../assets/allocations_update_profile.svg';
import allocations_update from '../../assets/allocations_update.svg';


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
import NullPaper from "../NullPaper";

const purples = ["#6200EE", "#BB9FE6"]

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  lightText: {
    color: "#7f8fa3",
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

  const nameChecker = {}

  const d = Object.values(grouped).map((d, i) => {
    const dealName = d.deal.company_name
    if (nameChecker[dealName]) {
      nameChecker[dealName] += 1
    } else {
      nameChecker[dealName] = 1
    }

    const displayName = nameChecker[dealName] === 1 ? dealName : dealName + nameChecker[dealName]
    return [displayName, 'All', d.amount, d.amount - (i * 5000), d.deal._id]
  })

  return [
    ['Company', 'Group', 'Amount Invested (size)', 'Company Color (color)', 'Deal ID'],
    ['All', null, 0, 0, null]
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
  const {userProfile, error, params, adminView} = useAuth(GET_INVESTOR)

  if (error) {
    if (error.message === "GraphQL error: permission denied" && userProfile && userProfile.email) {
      return <Redirect to="/signup"/>
    }
  }

  if (!userProfile.email) return <div><Loader/></div>

  const userInvestments = userProfile.investments.filter(inv => {
    if (!inv?.deal._id) {
      console.log('deal with no deal _id', inv.deal)
    }
    return inv.deal._id
  })
  const total_invested = _.sumBy(userInvestments, 'amount') || 0
  const chartEvents = [
    {
      eventName: "select",
      callback({chartWrapper}) {
        history.push(`/investments`)
      }
    }
  ];

  /*TODO: implement empty values for each paper */
  const isEmpty = true;

  return (
    <>
      {/* TODO: Move to NavBar <AdminTile investor={investor}/>*/}

      <Grid container spacing={2}>
        {total_invested === 0 ? <NoInvestmentBanner/> :
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container spacing={2} alignItems="center">
                <Hidden only="xs">
                  <Grid item sm={12} md={4}>
                    <Typography variant="body1" className={classes.lightText}>
                      Welcome
                    </Typography>
                    <Typography variant="h5">
                      <Name investor={userProfile}/>
                    </Typography>
                  </Grid>
                </Hidden>
                <Grid item sm={12} md={8}>
                  <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <Hidden only="xs">
                      <Typography variant="body1" className={classes.lightText}
                                  style={{textAlign: "right", paddingRight: 16}}>
                        Your Allocations account is ready for your use. <br/>
                        Let's view your investments!
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
        }

        <>
          <Grid item xs={12}>
            <Paper className={classes.paper} style={{height: "100%"}}>
              <Grid container alignItems="center">
                <Grid item xs={12} sm={3}>
                  <img src={allocations_total_investments} style={{maxWidth: 200}}/>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography variant="h5" className={classes.grey}>
                    <strong>Total Investments</strong>
                  </Typography>
                  <Typography variant="h5" style={{fontSize: "1.8rem"}} className={classes.blue}>
                    <strong>${nWithCommas(total_invested)}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7}>
                  {userInvestments.length > 0 ?
                    <Chart chartType="TreeMap"
                           width="100%"
                           height="200px"
                           chartEvents={chartEvents}
                           data={formatData(userInvestments)}
                           options={chartOptions}/> : null
                  }
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </>

        <Grid item xs={12} sm={6}>

          {isEmpty ? <NullPaper title="Recent Investments" text="Find your most recent investments"
                                image={allocations_recent_investments} button="Get Started"/>
            :
            <Paper className={classes.paper} style={{paddingBottom: 0}}>
              <Typography variant="h6" style={{marginBottom: 16}}>
                Most Recent Investments
              </Typography>


              <div style={{margin: "0px -16px", cursor: "pointer"}}>
                <Table style={{marginBottom: "-1px"}}>
                  {orderInvestments(userInvestments).map((investment, i) => (
                    <InvestmentStub key={i} investment={investment}/>
                  ))}
                </Table>
              </div>
            </Paper>}
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          {isEmpty ? <NullPaper title="Invited Deals" text="Here are your invited deals"
                                image={allocations_invite_deals} button="Get Started"/>
            :
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
            </Paper>}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" className={classes.grey}>
            Tools
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <NullPaper title="Update Profile" text="Update your user profile"
                     image={allocations_update_profile} button="Get Started"/>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <NullPaper title="Create New Deal" text="Setup your next deal in seconds"
                     image={allocations_create_deal} button="Get Started"/>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <NullPaper title="FAQ" text="Find all your answers here"
                     image={allocations_faq} button="Get Started"/>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <NullPaper title="Update My Account" text="Fund your account and start investing"
                     image={allocations_update} button="Get Started"/>
        </Grid>

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


const NoInvestmentBanner = () => {
  const classes = useStyles();
  return (
    <Grid item sm={12} md={6} className={classes.banner}>
      <Paper className={classes.paper}>
        <Typography variant="body1" className={classes.lightText}>
          Please contact your deal manager or Allocations if you are waiting for a unique link to join a private deal!
        </Typography>
      </Paper>
    </Grid>
  )
}
