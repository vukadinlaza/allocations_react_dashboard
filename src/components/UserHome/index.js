import React, { useEffect } from 'react'
import _ from 'lodash'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { Button } from '@material-ui/core' 
import { nWithCommas} from '../../utils/numbers'
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
  const d = investments.map((d, i) => [d.deal.company_name, 'All', d.amount, d.amount - (i * 5000)])

  return [
    ['Company', 'Group', 'Amount Invested (size)', 'Company Color (color)'],
    ['All', null, 0, 0]
  ].concat(d)
}

const GET_INVESTOR = gql`
  query GetInvestor($email: String!) {
    investor(email: $email) {
      _id
      first_name
      last_name
      email
      investments {
        amount
        deal {
          company_name
          company_description
          date_closed
        }
      }
    }
  }
`

export default function UserHome () {
  const { user } = useAuth0()
  const [getInvestor, { data, error }] = useLazyQuery(GET_INVESTOR)

  useEffect(() => {
    if (user && user.email) {
      getInvestor({ variables: { email: user.email }})
    }
  }, [user])

  if (!data) return <div>Loading...</div>
  const investor = data.investor

  const total_invested = _.sumBy(investor.investments, 'amount') || 0

  if (investor) {
    investor.invited_deals = []
  }
  return (
    <Container fluid className="UserHome">
      <Row>
        <Col md={{size: 3, offset: 2}} sm={{size: 5, offset: 0}} className="welcome">
          <div className="tile tile-top">
            <div className="welcome-text">Welcome,<br></br>{investor.first_name}</div>
            <div className="welcome-desc">
              🎉 Your Allocations account is ready for your use. Lets view your investments
              <div>
                <Button className="button" variant="contained">
                  <Link to="/investments">Investments</Link>
                </Button>
              </div>
            </div>
          </div>
        </Col>
        <Col md="5" sm="7" className="total-investments">
          <div className="tile tile-top">
            <div className="small-header">Total Investments</div>
            <div className="amount">${nWithCommas(total_invested)}</div>
            <div className="chart-container">
              <Chart chartType="TreeMap"
                width="100%"
                height="125px"
                data={formatData(investor.investments)}
                options={chartOptions} />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{size: 4, offset: 2}} sm={{size: 6, offset: 0}} className="last-deals">
          <div className="tile tile-bottom">
            <div className="small-header">Most Recent Deals</div>
            {investor.investments.map((investment, i) => (
              <InvestmentStub key={i} investment={investment} />
            ))}
          </div>
        </Col>
        <Col md="4" sm="6" className="last-deal">
          <div className="tile tile-bottom">
            <div className="small-header">Invited Deals</div>
            {investor.invited_deals.map((deal, i) => (
              <DealStub key={i} deal={deal} />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

function InvestmentStub ({ investment }) {
  return (
    <div key={investment._id} className="investment-stub">
      <span>{investment.deal.company_name}</span>
      <span>${nWithCommas(investment.amount)}</span>
      <span>{investment.deal.date_closed}</span>
    </div>
  )
}

function DealStub ({ deal }) {
  return (
    <div key={deal._id} className="investment-stub">
      <span>{deal.company_name}</span>
      <span>{nWithCommas(deal.amount)}</span>
      <span>{deal.date_closed}</span>
    </div>
  )
}