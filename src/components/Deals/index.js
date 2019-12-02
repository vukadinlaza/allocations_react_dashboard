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
import Loader from "../utils/Loader"

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'

import "./style.scss";

const GET_DEALS = gql`
  {
    allDeals {
      _id
      company_name
      company_description
      pledge_link
      date_closed
      deal_lead
    }
  }
`

export default function Deals () {
  const params = useParams()
  const adminView = params && params.id

  const { user } = useAuth0()
  const isAdmin = user && adminWhitelist.includes(user.email)
  const [getDeals, { data, loading, error }] = useLazyQuery(GET_DEALS)

  useEffect(() => {
    if (user && user.email) getDeals()
  }, [user])

  if (error) return <div>{error.message}</div>

  if (!data) return <div><Loader /></div>

  const { allDeals: deals } = data
  return (
    <div className="AllDeals">
      <Row>
        <Col sm={{size: 10, offset: 1}}>
          <Paper className="deal-data">
            <Button variant="contained"
              color="secondary">
              <Link to="/deal/new">Create New Deal</Link>
            </Button>
          </Paper>
        </Col>
      </Row>
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
                {deals.map(deal => (
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