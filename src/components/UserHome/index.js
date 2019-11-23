import React, { useEffect } from 'react'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container } from 'reactstrap'
import { Button } from '@material-ui/core' 
import { nWithCommas} from '../../utils/numbers'
import Chart from "react-google-charts"
import "./style.scss";

const data = {
  first_name: "Nils",
  last_name: "De Jonge",
  deals: [
    { company_name: "OrbitFab", amount: 5000 },
    { company_name: "Oncosenx", amount: 5000 }
  ]
}

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
  showTooltips: false
  // showScale: true
};

function formatData(deals) {
  const d = deals.map((d, i) => [d.company_name, 'All', d.amount, d.amount - (i * 5000)])

  return [
    ['Company', 'Group', 'Amount Invested (size)', 'Company Color (color)'],
    ['All', null, 0, 0]
  ].concat(d)
}

export default function UserHome () {
  const { user } = useAuth0()

  useEffect(() => {
    if (data) {
      // renderChart()
    }
  }, [data])

  if (!data) return <div>Loading...</div>

  const investor = data
  const total_invested = 10000

  if (investor) {
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
            <div className="amount">${nWithCommas(total_invested)}</div>
            <div className="chart-container">
              <Chart chartType="TreeMap"
                width="100%"
                height="125px"
                data={formatData(data.deals)}
                options={chartOptions} />
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div className="last-deals col-4 offset-2">
          <div className="tile tile-bottom">
            <div className="small-header">Most Recent Deals</div>
            {investor.deals.map((deal, i) => (
              <DealStub key={i} deal={deal} />
            ))}
          </div>
        </div>
        <div className="last-deal col-4">
          <div className="tile tile-bottom">
            <div className="small-header">Invited Deals</div>
            {investor.invited_deals.map((deal, i) => (
              <DealStub key={i} deal={deal} />
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
      <span>{nWithCommas(deal.amount)}</span>
      <span>{deal.date_closed}</span>
    </div>
  )
}