import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container } from 'reactstrap'
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

function nWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function UserHome () {
  const { user } = useAuth0()

  const { data, loading, error } = useQuery(GET_INVESTOR)

  if (!data) return <div>Loading...</div>

  const investor = data.GetInvestorById

  return (
    <Container fluid className="UserHome">
      <Row>
        <div className="welcome col-3 offset-2">
          <div className="tile">
            <div className="small-header">Investor for 3 months</div>
            <div className="welcome-text">Welcome,<br></br>{investor.first_name}</div>
          </div>
        </div>
        <div className="total-investments col-5">
          <div className="tile">
            <div className="small-header">Total Investments</div>
            <div className="amount">${nWithCommas(investor.total_invested)}</div>
          </div>
        </div>
      </Row>
      <Row>
        <div className="last-deal col-4 offset-2">
          <div className="tile">
            <div className="small-header">Most Recent Deal</div>
            <div className="most-recent-deal">Square: $5,000</div>
          </div>
        </div>
        <div className="last-deal col-4">
          <div className="tile">
            <div className="small-header">New Allocations</div>
            <div className="deal-stub">AirBNB</div>
            <div className="deal-stub">Zoom</div>
          </div>
        </div>
      </Row>
    </Container>
  )
}