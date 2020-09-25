import React, { useEffect, useReducer, Fragment } from 'react'
import _ from 'lodash'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { Link, useParams } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../auth/useAuth"
import Loader from "../utils/Loader"
import CapitalAccount from './CapitalAccount'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, LinearProgress, Typography, Grid, Hidden } from '@material-ui/core'

import "./style.scss";

/***
 *
 * Fund manager's table view of all of their deals with capital accounts
 * view when clicked
 *
 **/

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
          metaData
          investor {
            _id
            name
          }
        }
      }
    }
  }
`


export default function Deals({ showClosed }) {
  const { organization } = useParams()
  const { userProfile } = useAuth()
  const [getDeals, { data, error }] = useLazyQuery(GET_DEALS, { variables: { slug: organization } })
  const [capitalAccount, toggleCapitalAccount] = useReducer(
    (acc, _id) => {
      return acc === _id ? null : _id
    },
    "5e553fb7e165e6d78c794097" // TODO: Remove this
  )

  useEffect(() => {
    if (userProfile && userProfile.email) getDeals()
  }, [userProfile])

  if (error) return <div>{error.message}</div>

  if (!data) return <div><Loader /></div>

  const { organization: { deals } } = data
  const { open, closed } = _.groupBy(deals, d => d.status === "closed" ? "closed" : "open")

  return (
    <div className="AllDeals">
      {!showClosed && <Row>
        <Col sm={{ size: 12 }}>
          <Paper className="deal-data">
            <Button variant="contained"
              color="secondary">
              <Link to={`/admin/${organization}/deal/new`}>Create New Deal</Link>
            </Button>
          </Paper>
        </Col>
      </Row>}
      {!showClosed && <>
        <h5>Open Deals <span className="deals-length">{(open || []).length}</span></h5>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Deal</TableCell>
                <TableCell>Description</TableCell>
                <Hidden only="xs">
                  <TableCell>Closing</TableCell>
                </Hidden>
                <TableCell>Lead</TableCell>
                <Hidden only="xs">
                  <TableCell>Progress</TableCell>
                </Hidden>
                {userProfile.admin && <TableCell></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {_.orderBy(open, d => new Date(d.date_closed || Date.now()), 'desc').map(deal => (
                <TableRow key={deal._id}>
                  <TableCell>{deal.company_name}</TableCell>
                  <TableCell>{deal.company_description}</TableCell>
                  <Hidden only="xs">
                    <TableCell>{deal.date_closed}</TableCell>
                  </Hidden>
                  <TableCell>{deal.deal_lead}</TableCell>
                  <Hidden only="xs">
                    <DealProgress deal={deal} />
                  </Hidden>
                  {userProfile.admin && <TableCell align="center"><Link
                    to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </>
      }
      <>
        <Paper style={{ marginTop: 16 }}>
          <Grid container xs={12} style={{ padding: "16px" }}>
            <Typography variant="h6" gutterBottom>
              Closed Deals: {(closed || []).length}
            </Typography>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Deal</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Lead</TableCell>
                <Hidden only="xs">
                  <TableCell>Closed</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell className="text-center">Investors</TableCell>
                  {userProfile.admin && <TableCell></TableCell>}
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.orderBy(closed, d => new Date(d.date_closed || Date.now()), 'desc').map(deal => {
                const investments = _.orderBy(_.reject(deal.investments, i => i.status === "invited"), 'amount', 'desc')
                const groupedInvestments = _.groupBy(investments, 'metaData.group')
                return (
                  <Fragment key={deal._id}>
                    <TableRow onClick={() => toggleCapitalAccount(deal._id)} className="closed-deal-row">
                      <TableCell>{deal.company_name}</TableCell>
                      <TableCell>{deal.company_description}</TableCell>
                      <TableCell>{deal.deal_lead}</TableCell>
                      <Hidden only="xs">
                        <TableCell>{formatDate(deal.date_closed)}</TableCell>
                        <TableCell>${nWithCommas(_.sumBy(deal.investments, 'amount'))}</TableCell>
                        <TableCell className="text-center">{deal.investments.length}</TableCell>
                        {userProfile.admin && <TableCell align="center"><Link
                          to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link></TableCell>}
                      </Hidden>
                    </TableRow>
                    {capitalAccount === deal._id && <> {_.map(groupedInvestments, invs => <CapitalAccount deal={deal} investments={invs} />)}</>}
                  </Fragment>
                )
              }
              )}
            </TableBody>
          </Table>
        </Paper>
      </>
    </div>
  )
}

function DealProgress({ deal }) {
  const raised = _.sumBy(deal?.investments, 'amount')
  const progress = ((raised || 0) / (deal.target || Infinity)) * 100
  return (
    <TableCell>
      <LinearProgress style={{ height: "20px" }}
        variant="determinate"
        color="secondary"
        value={progress} />
      <div className="text-center">
        ${nWithCommas(raised)} of ${nWithCommas(deal.target)}
      </div>
    </TableCell>
  )
}