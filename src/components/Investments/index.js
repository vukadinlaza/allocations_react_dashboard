import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core'

import "./style.scss";

const GET_INVESTMENTS = gql`
  {
    GetDeals {
      _id
      company_name
      company_description
      investment_documents
      name
      user_id
      entity_name
      amount
      date_closed
      deal_name
      deal_complete_date
    }
  }
`

export default function Investments () {
  const { data, loading, error } = useQuery(GET_INVESTMENTS)

  if (error) {
    console.log(error)
    return <div>{error.message}</div>
  }

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
                  <TableCell>Investor</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Date Closed</TableCell>
                  <TableCell align="right">Docs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investments.map(investment => (
                  <TableRow key={investment._id}>
                    <TableCell>{investment.name}</TableCell>
                    <TableCell scope="row">{investment.company_name}</TableCell>
                    <TableCell>{investment.company_description}</TableCell>
                    <TableCell align="right">{investment.amount}</TableCell>
                    <TableCell align="right">{investment.date_closed}</TableCell>
                    <TableCell align="right">
                      {investment.investment_documents ? <a href={investment.investment_documents} target="_blank">
                        <FontAwesomeIcon icon="external-link-alt" />
                      </a> : ""} 
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