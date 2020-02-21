import React from 'react'
import _ from 'lodash'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useAuth } from "../../auth/useAuth"
import { useParams, Link } from 'react-router-dom'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { Paper, Table, TableBody, TableCell, TableRow, TableHead, Button, LinearProgress } from '@material-ui/core'
import { Col, Row } from 'reactstrap'
import Loader from '../utils/Loader'

import "./style.scss"

const ORG = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      name
      slug
      deals {
        _id
        status
        date_closed
        company_name
        company_description
        target
        amount_raised
        investments {
          _id
          amount
          status
        }
      }
      investors {
        _id
        name
        investments {
          _id
          amount
          deal {
            _id
          }
        }
      }
      investments {
        _id
        status
        amount
        deal {
          _id
          company_name
        }
        investor {
          _id
          name
        }
      }
    }
  }
`

function sumOrgInvestments ({ investor, deals }) {
  const deal_ids = deals.map(d => d._id)
  return investor.investments.reduce((acc, inv) => {
    if (deal_ids.includes(inv.deal._id)) {
      return acc + (inv.amount || 0)
    }
    return acc
  }, 0)
}

export default function AdminHome () {
  const { organization } = useParams()
  const { data, error } = useQuery(ORG, { variables: { slug: organization } })

  if (!data) return <Loader />

  const org = data.organization
  return (
    <div className="AdminHome">
      <Row>
        <Col sm={{size: 3, offset: 2}}>
          <Paper className="welcome">
            <h2>Welcome to, <br></br> <b>{org.name}</b> Admin!</h2> 
            <div>This is where you can manage your deals and investors 🗃 🔮</div>
            <Button className="create-deal-button" variant="contained">
              <Link to={`/admin/${organization}/deal/new`}>CREATE DEAL</Link>
            </Button>
          </Paper>
        </Col>
        <Col sm={{size: 5, offset: 0}}>
          <Paper className="deals" style={{padding: "10px 15px"}}>
            <div className="deals-title">💡 Active Deals &nbsp;<span className="deals-length">{org.deals.length}</span> <Button className="all-btn" variant="contained" color="secondary" style={{padding: "3px 4px"}}><Link to={`/admin/${organization}/deals`}>All</Link></Button></div>
            <hr></hr>
            <Paper className="deals-table" style={{marginBottom: "10px"}}>
              <Table>
                <TableBody>
                  {org.deals.map(deal => (
                    <Deal key={deal._id} deal={deal} />
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Paper>
        </Col>
        <Col sm={{size: 4, offset: 2}}>
          <Paper className="investors">
            <div className="tile-header">Top Investors 🐳 <Button className="all-btn" variant="contained" color="secondary" style={{padding: "3px 4px"}}><Link to={`/admin/${organization}/investors`}>All</Link></Button></div>
            <hr></hr>
            <Paper>
              <div className="scroll-wrapper">
                <Table>
                  <TableBody>
                    {_.orderBy((org.investors || []), investor => sumOrgInvestments({ investor, deals: org.deals }), 'desc').map((investor, i) => (
                      <TableRow key={investor._id}>
                        <TableCell>{investor.name} {i === 0 && "👑"}</TableCell>
                        <TableCell>${nWithCommas(sumOrgInvestments({ investor, deals: org.deals })) || 0} invested</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Paper>
          </Paper>
        </Col>
        <Col sm={{size: 4, offset: 0}}>
          <Paper className="investments">
            <div className="tile-header">Recent Investments 💵 <Button className="all-btn" variant="contained" color="secondary" style={{padding: "3px 4px"}}><Link to={`/admin/${organization}/investments`}>All</Link></Button></div>
            <hr></hr>
            <Paper>
              <div className="scroll-wrapper">
                <Table>
                  <TableBody>
                    {_.take((org.investments || []), 10).filter(i => i.status !== "invited").map(investment => (
                      <TableRow key={investment._id}>
                        <TableCell>{investment.deal.company_name}</TableCell>
                        <TableCell>{investment.investor.name}</TableCell>
                        <TableCell>${nWithCommas(investment.amount)}</TableCell>
                        <TableCell>{investment.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Paper>
          </Paper>
        </Col>
      </Row>
    </div>
  )
}

function Deal ({ deal }) {
  const { organization } = useParams()
  const val = (Number(deal.amount_raised) / (Number(deal.target) || Infinity)) * 100

  return (
    <TableRow className="deal-info">
      <TableCell className="company-name">{deal.company_name}</TableCell>
      <TableCell><i>closes: {formatDate(deal.date_closed)}</i></TableCell>
      <TableCell>
        <LinearProgress className="deal-progress" variant="determinate" color="secondary" value={val} />
        <div className="text-center">{Math.round(val)}% of ${nWithCommas(deal.target)}</div>
      </TableCell>
      <TableCell>
        <Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link>
      </TableCell>
    </TableRow>
  )
}

