import React, { useEffect } from 'react'
import _ from 'lodash'
import { Link, useParams } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'
import Loader from "../utils/Loader"

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'

import "./style.scss";

/***
 *
 * All investors in table view for superadmins
 *
 **/

const GET_INVESTORS = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      investors {
        _id
        first_name
        last_name
        email
        investor_type
        entity_name
        passport {
          link
        }
        investments {
          _id
          amount
          deal {
            _id
            company_name
          }
        }
      }
    }
  }
`

export default function Investments () {
  const { organization } = useParams()
  const { user } = useAuth0()
  const [getInvestors, { data, error }] = useLazyQuery(GET_INVESTORS, { variables: { slug: organization } })

  useEffect(() => {
    if (user && user.email) getInvestors()
  }, [user])

  if (error) return <div>{error.message}</div>

  if (!data) return <div><Loader /></div>

  const { organization: { investors } } = data
  return (
    <div className="Investors">
      <Row>
        {organization === "allocations" && <Col sm={{size: 10, offset: 1}}>
          <Paper className="actions">
            <Link to="/investors/new">
              <Button variant="contained" color="secondary">INVITE INVESTOR</Button>
            </Link>
          </Paper>
        </Col>}
        <Col sm="10" className="offset-sm-1">
          <Paper className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Investor</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Investments</TableCell>
                  <TableCell>Total Invested</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.orderBy(investors, ({ investments }) => _.sumBy(investments, 'amount'), 'desc').map(investor => (
                  <TableRow key={investor._id}>
                    <TableCell>{investor.investor_type === "entity" ? investor.entity_name : `${investor.first_name} ${investor.last_name}`}</TableCell>
                    <TableCell>{investor.email}</TableCell>
                    <TableCell>{investor.investments.length}</TableCell>
                    <TableCell>${nWithCommas(_.sumBy(investor.investments, 'amount'))}</TableCell>
                    <TableCell>
                      <Link to={`/investor/${investor._id}/home`}>
                        Use site as {investor.first_name || investor.entity_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`/investor/${investor._id}/edit`}>Edit</Link>
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