import React, { useEffect, useReducer, Fragment } from 'react'
import _ from 'lodash'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { Link, useParams } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { adminWhitelist } from "../../auth/admin-route"
import Loader from "../utils/Loader"
import CapitalAccount from './CapitalAccount'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, LinearProgress } from '@material-ui/core'

import "./style.scss";

const GET_DEALS = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      deals {
        _id
        status
        amount_raised
        target
        company_name
        company_description
        pledge_link
        onboarding_link
        date_closed
        deal_lead
        investments {
          _id
          amount
          status
          investor {
            _id
            name
          }
        }
      }
    }
  }
`

export default function Deals () {
  const { organization } = useParams()
  const { user } = useAuth0()
  const isAdmin = user && adminWhitelist.includes(user.email)
  const [getDeals, { data, error }] = useLazyQuery(GET_DEALS, { variables: { slug: organization }})
  const [capitalAccount, toggleCapitalAccount] = useReducer(
    (acc, _id) => {
      return acc === _id ? null : _id
    },
    "5e553fb7e165e6d78c794097"
  )

  useEffect(() => {
    if (user && user.email) getDeals()
  }, [user])

  if (error) return <div>{error.message}</div>

  if (!data) return <div><Loader /></div>

  const { organization: { deals } } = data
  const { open, closed } = _.groupBy(deals, d => d.status === "closed" ? "closed" : "open")

  return (
    <div className="AllDeals">
      <Row>
        <Col sm={{size: 10, offset: 1}}>
          <Paper className="deal-data">
            <Button variant="contained"
              color="secondary">
              <Link to={`/admin/${organization}/deal/new`}>Create New Deal</Link>
            </Button>
          </Paper>
        </Col>
      </Row>
      <Row>
        <Col sm="10" className="offset-sm-1">
          <h5>Open Deals <span className="deals-length">{(open || []).length}</span></h5>
          <Paper className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Deal</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Closing</TableCell>
                  <TableCell>Lead</TableCell>
                  <TableCell>Progress</TableCell>
                  {isAdmin && <TableCell></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {_.orderBy(open, d => new Date(d.date_closed || Date.now()), 'desc').map(deal => (
                  <TableRow key={deal._id}>
                    <TableCell>{deal.company_name}</TableCell>
                    <TableCell>{deal.company_description}</TableCell>
                    <TableCell>{deal.date_closed}</TableCell>
                    <TableCell>{deal.deal_lead}</TableCell>
                    <DealProgress deal={deal} />
                    {isAdmin && <TableCell align="center"><Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link></TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
      </Row>
      <Row style={{marginTop: "15px"}}>
        <Col sm={{size: 10, offset: 1}}>
          <h5>Closed Deals <span className="deals-length">{(closed || []).length}</span></h5>
          <Paper className="table-wrapper closed-deals">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Deal</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Lead</TableCell>
                  <TableCell>Closed</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell className="text-center">Investors</TableCell>
                  {isAdmin && <TableCell></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {_.orderBy(closed, d => new Date(d.date_closed || Date.now()), 'desc').map(deal => (
                  <Fragment key={deal._id}>
                    <TableRow onClick={() => toggleCapitalAccount(deal._id)} className="closed-deal-row">
                      <TableCell>{deal.company_name}</TableCell>
                      <TableCell>{deal.company_description}</TableCell>
                      <TableCell>{deal.deal_lead}</TableCell>
                      <TableCell>{formatDate(deal.date_closed)}</TableCell>
                      <TableCell>${nWithCommas(deal.amount_raised)}</TableCell>
                      <TableCell className="text-center">{deal.investments.length}</TableCell>
                      {isAdmin && <TableCell align="center"><Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link></TableCell>}
                    </TableRow>
                    {capitalAccount === deal._id && <CapitalAccount deal={deal} />}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </div>
  )
}

function DealProgress ({ deal }) {
  const progress = ((deal.amount_raised || 0) / (deal.target || Infinity)) * 100
  return (
    <TableCell>
      <LinearProgress style={{height: "20px"}}
        variant="determinate" 
        color="secondary" 
        value={progress} />
      <div className="text-center">
        ${nWithCommas(deal.amount_raised)} of ${nWithCommas(deal.target)}
      </div>
    </TableCell>
  )
}