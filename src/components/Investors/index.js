import React, { useEffect } from 'react'
import _ from 'lodash'
import { useParams, Link } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core'

import "./style.scss";

const GET_INVESTORS = gql`
  {
    allInvestors {
      _id
      first_name
      last_name
      email
      investments {
        amount
        deal {
          company_name
        }
      }
    }
  }
`

export default function Investments () {
  const { user } = useAuth0()
  const { data, loading, error } = useQuery(GET_INVESTORS)

  if (error) return <div>{error.message}</div>

  if (!data) return <div>Loading...</div>

  const investors = data.allInvestors
  return (
    <div className="Investors">
      <Row>
        <Col sm="10" className="offset-sm-1">
          <Paper className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Investor</TableCell>
                  <TableCell>Investments</TableCell>
                  <TableCell>Total Invested</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investors.map(investor => (
                  <TableRow key={investor._id}>
                    <TableCell>{investor.first_name} {investor.last_name}</TableCell>
                    <TableCell>{investor.investments.length}</TableCell>
                    <TableCell>${_.sumBy(investor.investments, 'amount')}</TableCell>
                    <TableCell>
                      <Link to={`/investor/${investor._id}/home`}>
                        Use site as {investor.first_name}
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