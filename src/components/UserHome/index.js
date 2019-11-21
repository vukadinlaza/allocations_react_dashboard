import React from 'react'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container } from 'reactstrap'
import { Button } from '@material-ui/core' 
import { nWithCommas} from '../../utils/numbers'
import "./style.scss";

const GET_INVESTOR = gql`
  {
    GetInvestorById(id: "5dab93fb596a72d5932f3994") {
      first_name
      last_name
      accredited_type
      total_invested
    }
  }
`

export default function UserHome () {
  const { user } = useAuth0()

  const { data, loading, error } = useQuery(GET_INVESTOR)

  if (!data) return <div>Loading...</div>

  const investor = data.GetInvestorById
  if (investor) {
    investor.deals = [
      {
        id: 1,
        company_name: "OrbitFab",
        amount: "5000",
        date_closed: "November 2019",
        description: "Gas Stations in Space"
      },
      {
        id: 2,
        company_name: "Oncosenx",
        amount: "5000",
        date_closed: "October 2019",
        description: "Cancer Treatment Tech"
      }
    ]

    investor.invited_deals = []
  }

  return (
    <Container fluid className="UserHome">
      <Row>
        <div className="welcome col-3 offset-2">
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
        </div>
        <div className="total-investments col-5">
          <div className="tile tile-top">
            <div className="small-header">Total Investments</div>
            <div className="amount">${nWithCommas(investor.total_invested)}</div>
          </div>
        </div>
      </Row>
      <Row>
        <div className="last-deals col-4 offset-2">
          <div className="tile tile-bottom">
            <div className="small-header">Most Recent Deals</div>
            {investor.deals.map(deal => (
              <div key={deal.id} className="deal-stub">
                <span>{deal.company_name}</span>
                <span>${nWithCommas(deal.amount)}</span>
                <span>{deal.date_closed}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="last-deal col-4">
          <div className="tile tile-bottom">
            <div className="small-header">Invited Deals</div>
            {investor.invited_deals.map(deal => (
              <DealStub deal={deal} />
            ))}
          </div>
        </div>
      </Row>
    </Container>
  )
}

function DealStub ({ deal }) {
  return (
    <div key={deal.id} className="deal-stub">
      <span>{deal.company_name}</span>
      <span>${nWithCommas(deal.amount)}</span>
      <span>{deal.date_closed}</span>
    </div>
  )
}