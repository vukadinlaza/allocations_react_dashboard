import React, { useEffect } from 'react'
import _ from 'lodash'
import { gql } from 'apollo-boost'
import { Link, useLocation, useParams, useHistory, Redirect } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { Button, Fab, Paper } from '@material-ui/core' 
import { nWithCommas} from '../../utils/numbers'
import { validate } from '../forms/InvestorEdit'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../utils/Loader'
import Chart from "react-google-charts"
import "./style.scss";

const purples = [
  "#6200EE",
  "#BB9FE6"
]

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
      investments {
        amount
        status
        deal {
          _id
          company_name
          company_description
          date_closed
        }
      }
      invitedDeals {
        _id
        company_name
        company_description
        date_closed
      }
    }
  }
`

function orderInvestments (investments) {
  const pastInvited = investments.filter(({status}) => status !== "invited")
  return _.take(_.orderBy(pastInvited, i => new Date(i.deal.date_closed).getTime(), 'desc'), 3)
}

export default function UserHome (props) {
  const params = useParams()
  const adminView = params && params.id
  const { user, isAuthenticated } = useAuth0()
  const [getInvestor, { data, error, called, refetch }] = useLazyQuery(GET_INVESTOR)

  useEffect(() => {
    if (isAuthenticated && !called) {
      adminView ? getInvestor({ variables: { _id: params.id }}) : getInvestor()
    }
  }, [isAuthenticated, called])

  useEffect(() => {
    if (error && user) refetch()
  }, [error, user])

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
        <CompleteInfoPrompt investor={investor} />
        <Col lg={{size: 3, offset: 2}} md={{size: 5, offset: 0}} sm={{size: 5, offset: 0}} className="welcome">
          <div className="tile tile-top">
            <div className="welcome-text">Welcome,<br></br><Name investor={investor} /></div>
            <div className="welcome-desc">
              🎉 Your Allocations account is ready for your use. Let's view your investments
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
          <div className="tile tile-bottom">
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
  if (investment.status === "invited") return null
  return (
    <Paper key={investment._id} className="investment-stub">
      <span>{investment.deal.company_name}</span>
      <span>{investment.amount ? `$${nWithCommas(investment.amount)}` : <i>TBD</i> }</span>
      <span>
        <span className={`investment-status investment-status-${investment.status}`}>{investment.status}</span>
      </span>
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

  return (
    <Paper key={deal._id} className="deal-stub">
      <span>{deal.company_name}</span>
      <span>{deal.date_closed || "TBD"}</span>
      <span>
        <Fab onClick={() => history.push(`/deals/${deal.company_name}`)} size="small" color="primary" style={{textAlign: 'center'}}>
          <FontAwesomeIcon icon="arrow-right" size="xs" />
        </Fab>
      </span>
    </Paper>
  )
}