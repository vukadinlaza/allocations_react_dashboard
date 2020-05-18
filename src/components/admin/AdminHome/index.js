import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useAuth } from "../../../auth/useAuth"
import { useParams, Link } from 'react-router-dom'
import { nWithCommas, formatDate } from '../../../utils/numbers'
import { Paper, Table, TableBody, TableCell, TableRow, TableHead, Button, LinearProgress } from '@material-ui/core'
import { Col, Row } from 'reactstrap'
import Loader from '../../utils/Loader'

import "./style.scss"

/***
 *
 * AdminHome is the overview of all a funds deals, investors, investments
 * looks similar to the investor home page but for fund admins
 *
 **/

export const ORG_OVERVIEW = gql`
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
      complianceTasks {
        _id
        completed
        status
        is_signature
        signature_template
        signature_url
        task
      }
    }
    investor {
      _id
      admin
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
  const { data, error, refetch } = useQuery(ORG_OVERVIEW, { 
    variables: { slug: organization }
  })

  if (!data) return <Loader />

  const org = data.organization

  const { active, closed } = _.groupBy(org.deals, d => d.status === "closed" ? "closed" : "active")

  return (
    <div className="AdminHome">
      {data.investor.admin && <SuperAdmin org={org} />}
      <Row>
        <Col sm={{size: 8, offset: 2}}>
          <Paper className="welcome">
            <h2>Welcome to, <br></br> <b>{org.name}</b> Admin!</h2> 
            <div>This is where you can manage your deals and investors 🗃 🔮</div>
            <Button className="create-deal-button" variant="contained">
              <Link to={`/admin/${organization}/deal/new`}>CREATE DEAL</Link>
            </Button>
          </Paper>
        </Col>
        <Col sm={{size: 8, offset: 2}}>
          <Paper className="deals" style={{padding: "10px 15px"}}>
            <div className="deals-title">💡 Active Deals &nbsp;<span className="deals-length">{(active || []).length}</span> <Button className="all-btn" variant="contained" color="secondary" style={{padding: "3px 4px"}}><Link to={`/admin/${organization}/deals`}>All</Link></Button></div>
            <hr></hr>
            <Paper className="deals-table" style={{marginBottom: "10px"}}>
              <Table>
                <TableBody>
                  {(active || []).map(deal => (
                    <Deal key={deal._id} deal={deal} />
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Paper>
        </Col>
        <Col sm={{size: 4, offset: 2}}>
          <Paper className="deals-closed" style={{padding: "10px 15px", marginTop: "20px"}}>
            <div className="deals-title">Closed Deals 🎉 &nbsp;<span className="deals-length">{(closed || []).length}</span> <Button className="all-btn" variant="contained" color="secondary" style={{padding: "3px 4px"}}><Link to={`/admin/${organization}/deals`}>All</Link></Button></div>
            <hr></hr>
            <Paper className="deals-table" style={{marginBottom: "10px"}}>
              <div className="scroll-wrapper">
                <Table>
                  <TableBody>
                    {(closed || []).map(deal => (
                      <TableRow key={deal._id} className="deal-info">
                        <TableCell className="company-name">{deal.company_name}</TableCell>
                        <TableCell>${nWithCommas(deal.amount_raised)}</TableCell>
                        <TableCell><i>closed {formatDate(deal.date_closed)}</i></TableCell>
                        <TableCell>
                          <Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link>
                        </TableCell>
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
                        <TableCell>{_.get(investment, 'investor.name')}</TableCell>
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

function SuperAdmin ({ org }) {
  return (
    <Row>
      <Col sm={{size: 8, offset: 2}}>
        <Paper className="superadmin-section" style={{marginBottom: "20px", padding: "10px", textAlign: "center"}}>
          You are a SuperAdmin &nbsp;<Button size="small" variant="contained" color="secondary"><Link to={`/admin/${org.slug}/manager`}>Manage</Link></Button>
        </Paper>
      </Col>
    </Row>
  )
}

function Deal ({ deal }) {
  const { organization } = useParams()
  const val = (Number(deal.amount_raised) / (Number(deal.target) || Infinity)) * 100

  return (
    <TableRow className="deal-info">
      <TableCell className="company-name">{deal.company_name}</TableCell>
      <TableCell><i>closes: {deal.date_closed ? formatDate(deal.date_closed) : "tbd"}</i></TableCell>
      <TableCell>
        <div className="text-center">{Math.round(val || 0)}%</div>
        <LinearProgress className="deal-progress" variant="determinate" color="secondary" value={val} />
        <div className="text-center">${nWithCommas(deal.amount_raised)} of ${nWithCommas(deal.target)}</div>
      </TableCell>
      <TableCell>
        <Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link>
      </TableCell>
    </TableRow>
  )
}

