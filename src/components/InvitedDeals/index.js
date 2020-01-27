import React, { useEffect } from 'react'
import Loader from "../utils/Loader"
import { useParams, Link, Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { adminWhitelist } from "../../auth/admin-route"

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, Hidden } from '@material-ui/core'

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
        status
        company_name
        company_description
        pledge_link
        onboarding_link
        date_closed
        deal_lead
      }
    }
  }
`

function formatDate (date) {
  try {
    const d = new Date(date)
    return d.toLocaleString('en-US', { dateStyle: "short" })
  } catch (e) {
    return date
  }
}

export default function InvitedDeals () {
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
    return <div>{error.message}</div>
  }

  if (!data) return <div><Loader /></div>

  const { investor } = data
  return (
    <div className="InvitedDeals">
      <Row>
        <Col sm="10" className="offset-sm-1">
          <Paper className="table-wrapper">
            <Table size={window.innerWidth > 768 ? "medium": "small"}>
              <TableHead>
                <TableRow>
                  <TableCell>Deal</TableCell>
                  <Hidden xsDown><TableCell>Description</TableCell></Hidden>
                  <TableCell>Status</TableCell>
                  <Hidden xsDown><TableCell>Closing</TableCell></Hidden>
                  <Hidden xsDown><TableCell>Lead</TableCell></Hidden>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investor.invitedDeals.map(deal => (
                  <TableRow key={deal._id}>
                    <TableCell>{deal.company_name}</TableCell>
                    <Hidden xsDown><TableCell>{deal.company_description}</TableCell></Hidden>
                    <Hidden xsDown><TableCell>{deal.status}</TableCell></Hidden>
                    <TableCell>{formatDate(deal.date_closed)}</TableCell>
                    <Hidden xsDown><TableCell>{deal.deal_lead}</TableCell></Hidden>
                    <TableCell align="center">
                      <Link to={`/deals/${deal.company_name}`}>
                        <Button variant="contained" style={{backgroundColor: "#53B987", color: "#fff"}}>
                          Invest&nbsp;<FontAwesomeIcon icon="arrow-right" />
                        </Button>
                      </Link> 
                    </TableCell>
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