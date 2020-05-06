import React, { useEffect } from 'react'
import Loader from "../utils/Loader"
import { useParams, Link, Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { useAuth } from "../../auth/useAuth"
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { adminWhitelist } from "../../auth/admin-route"

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, Hidden } from '@material-ui/core'

import "./style.scss";

/***
 *
 * an investor view of all the deals they've been invited to
 *
 **/

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      email
      invitedDeals {
        _id
        slug
        status
        company_name
        company_description
        pledge_link
        onboarding_link
        date_closed
        deal_lead
        organization {
          slug
        }
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
  const { data, error, refetch, user, params, adminView } = useAuth(GET_INVESTOR)

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
                  <DealRow key={deal._id} deal={deal} />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </div>
  )
}

function DealRow ({ deal }) {
  const link = deal.organization 
    ? `/deals/${deal.organization.slug}/${deal.slug}`
    : `/deals/${deal.slug}`
    
  return (
    <TableRow>
      <TableCell>{deal.company_name}</TableCell>
      <Hidden xsDown><TableCell>{deal.company_description}</TableCell></Hidden>
      <Hidden xsDown><TableCell>{deal.status}</TableCell></Hidden>
      <TableCell>{formatDate(deal.date_closed)}</TableCell>
      <Hidden xsDown><TableCell>{deal.deal_lead}</TableCell></Hidden>
      <TableCell align="center">
        <Link to={link}>
          <Button variant="contained" style={{backgroundColor: "#53B987", color: "#fff"}}>
            Invest&nbsp;<FontAwesomeIcon icon="arrow-right" />
          </Button>
        </Link> 
      </TableCell>
    </TableRow>
  )
}
