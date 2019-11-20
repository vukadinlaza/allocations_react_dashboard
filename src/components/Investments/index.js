import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core'

import "./style.scss";

const GET_INVESTMENTS = gql`
  {
    GetDeals {
      _id
      entity_name
      amount_wired
      deal_name
      deal_complete_date
    }
  }
`

export default function Investments () {
  const { data, loading, error } = useQuery(GET_INVESTMENTS)

  if (!data) return <div>Loading...</div>

  const investments = data.GetDeals
  return (
    <div className="Investments">
      <Row>
        <Col sm="10" className="offset-sm-1">
          <Paper className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Docs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investments.map(investment => (
                  <TableRow key={investment._id}>
                    <TableCell scope="row">{investment.deal_name}</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right">${nWithCommas(investment.amount_wired)}</TableCell>
                    <TableCell align="right"></TableCell>
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