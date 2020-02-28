import React, { useEffect } from 'react'
import _ from 'lodash'
import { gql } from 'apollo-boost'
import { Link, useParams, useHistory, Redirect } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { nWithCommas} from '../../utils/numbers'
import { validate } from '../forms/InvestorEdit'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../auth/useAuth"
import { Paper, Table, TableBody, TableCell, TableRow, TableHead, Button, Fab } from '@material-ui/core'

import Loader from '../utils/Loader'
import Chart from "react-google-charts"
import "./style.scss";

const purples = ["#6200EE", "#BB9FE6"]

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
        amount
        status
        deal {
          _id
          company_name
          company_description
          date_closed
          status
        }
      }
      invitedDeals {
        _id
        company_name
        company_description
        date_closed
        status
        organization {
          slug
        }
      }
    }
  }
`

function orderInvestments (investments) {
  const pastInvited = investments.filter(({status}) => status !== "invited")
  return _.take(_.orderBy(pastInvited, i => new Date(i.deal.date_closed).getTime(), 'desc'), 3)
}

export default function UserHome (props) {
  const history = useHistory()
  const { data, error, refetch, user, params, adminView } = useAuth(GET_INVESTOR)

  if (error) {
    if (error.message === "GraphQL error: permission denied" && user && user.email) {
      return <Redirect to="/signup" />
    }
  }

  if (!data) return <div><Loader /></div>

  const investor = data.investor
  const total_invested = _.sumBy(investor.investments, 'amount') || 0

  return (
    <Container fluid className="UserHome">
      <Row>
        <AdminTile investor={investor} />
      </Row>
      <Row>
        <CompleteInfoPrompt investor={investor} />
        <Col lg={{size: 3, offset: 2}} md={{size: 5, offset: 0}} sm={{size: 5, offset: 0}} className="welcome">
          <div className="tile tile-top">
            <div className="welcome-text">Welcome,<br></br><Name investor={investor} /></div>
            <div className="welcome-desc">
              <span role="img" aria-label="congrats">🎉</span> Your Allocations account is ready for your use. Let's view your investments
              <div>
                <Button className="button" variant="contained">
                  <Link to={adminView ? `/investor/${params.id}/investments` : "/investments"}>Investments</Link>
                </Button>
              </div>
            </div>
          </div>
        </Col>
        <Col lg="5" md="7" sm="7" className="total-investments">
          <div className="tile tile-top">
            <div className="small-header">Total Investments</div>
            <div className="amount">${nWithCommas(total_invested)}</div>
            <div className="chart-container">
              {investor.investments.length > 0 ? 
                <Chart chartType="TreeMap"
                  width="100%"
                  height="125px"
                  data={formatData(investor.investments)}
                  options={chartOptions} /> : null
              }
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={{size: 4, offset: 2}} md={{size: 6, offset: 0}} sm={{size: 6, offset: 0}} className="last-deals">
          <div className="tile tile-bottom" onClick={() => history.push('/investments')}>
            <div className="small-header">Most Recent Investments</div>
            {orderInvestments(investor.investments).map((investment, i) => (
              <InvestmentStub key={i} investment={investment} />
            ))}
          </div>
        </Col>
        <Col lg="4" md="6" sm="6" className="invited-deals">
          <div className="tile tile-bottom">
            <div className="small-header">Invited Deals</div>
            {investor.invitedDeals.map((deal, i) => (
              <DealStub key={i} deal={deal} />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

function Name ({ investor }) {
  return investor.investor_type === "entity" ? investor.entity_name : investor.first_name
}

function InvestmentStub ({ investment }) {
  const history = useHistory()
  if (investment.status === "invited") return null
  return (
    <Paper key={investment._id} className="investment-stub" 
      onClick={e => {
        e.stopPropagation()
        history.push(`/deals/${investment.deal.company_name}`)}
      }>
      <span>{investment.deal.company_name}</span>
      <span>{investment.amount ? `$${nWithCommas(investment.amount)}` : <i>TBD</i> }</span>
      <span className={`investment-status investment-status-${investment.status}`}>{investment.status}</span>
    </Paper>
  )
}

function CompleteInfoPrompt ({ investor }) {
  const history = useHistory()

  if (investor && validate(investor).length > 0) {
    return (
      <Col lg={{size: 8, offset: 2}} md={{size: 10, offset: 1}} sm={{size: 12, offset: 0}}>
        <div className="tile complete-info-prompt">
          Complete Your Info!&nbsp;&nbsp;
          <Fab onClick={() => history.push('/profile')} size="small" color="secondary" style={{textAlign: 'center'}}>
            <FontAwesomeIcon icon="arrow-right" size="xs" />
          </Fab>
        </div>
      </Col>
    )
  }
  return null
}

function DealStub ({ deal }) {
  const history = useHistory()
  const link = deal.organization 
    ? `/deals/${deal.organization.slug}/${deal.company_name}`
    : `/deals/${deal.company_name}`

  return (
    <Paper key={deal._id} className="deal-stub" onClick={() => history.push(link)}>
      <span>{deal.company_name}</span>
      <span>{deal.date_closed || "TBD"}</span>
      <span className="deal-status" data-status={deal.status}>{deal.status}</span>
    </Paper>
  )
}

function AdminTile ({ investor }) {
  if (investor.admin || (investor.organizations_admin || []).length > 0) {
    return (
      <Col sm={{size: 8, offset: 2}}>
        <div className="tile admin-tile">
          <div className="text-center">
            You are a Fund Manager &nbsp;&nbsp;
            <Button variant="contained" size="small" color="secondary">
              <Link to="/admin/funds">My Funds 🗂</Link>
            </Button>
          </div>
        </div>
      </Col>
    )
  }
  return null
}