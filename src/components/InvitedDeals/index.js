import React, { useEffect } from 'react'
import _ from 'lodash'
import { useParams, Link } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { adminWhitelist } from "../../auth/admin-route"

import { Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core'

import "./style.scss";

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      email
      invitedDeals {
        _id
        company_name
        company_description
        pledge_link
        date_closed
        deal_lead
      }
    }
  }
`

export default function InvitedDeals () {
  const params = useParams()
  const adminView = params && params.id

  const { user } = useAuth0()
  const isAdmin = user && adminWhitelist.includes(user.email)
  const [getInvestor, { data, loading, error }] = useLazyQuery(GET_INVESTOR)

  useEffect(() => {
    if (adminView) {
      getInvestor({ variables: { _id: params.id }})
    } else if (user && user.email) {
      getInvestor({ variables: { email: user.email }})
    }
  }, [user])

  if (error) return <div>{error.message}</div>

  if (!data) return <div>Loading...</div>

  const { investor } = data
  return (
    <div className="InvitedDeals">
      <Row>
        <Col sm="10" className="offset-sm-1">
          <Paper className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Deal</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Closing</TableCell>
                  <TableCell>Lead</TableCell>
                  <TableCell align="center">Pledge</TableCell>
                  <TableCell align="center">Onboarding</TableCell>
                  {isAdmin && <TableCell></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {investor.invitedDeals.map(deal => (
                  <TableRow key={deal._id}>
                    <TableCell>{deal.company_name}</TableCell>
                    <TableCell>{deal.company_description}</TableCell>
                    <TableCell>{deal.date_closed}</TableCell>
                    <TableCell>{deal.deal_lead}</TableCell>
                    <TableCell align="center">
                      {deal.pledge_link ? <a href={deal.pledge_link} target="_blank">
                        <FontAwesomeIcon icon="external-link-alt" />
                      </a> : ""} 
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    {isAdmin && <TableCell align="center"><Link to={`/deals/${deal._id}/edit`}>edit</Link></TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </div>
  )
}