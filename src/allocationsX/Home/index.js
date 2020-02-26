import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { gql } from 'apollo-boost'
import { Row, Col } from 'reactstrap'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Paper, Table, TableBody, TableCell, TableRow, TableHead, Button, Fab } from '@material-ui/core'
import Loader from '../../components/utils/Loader'
import "./style.scss"

const DEALS = gql`
  {
    exchangeDeals {
      _id
      slug
      company_name
      organization {
        name
      }
    }
  }
`

export default function AllocationsX () {
  const { data, error, loading } = useQuery(DEALS)

  if (!data) return <Loader />

  return (
    <div className="AllocationsX-Home">
      <Row>
        <Col md={{size: 6, offset: 2}} sm={{size: 10, offset: 1}}>
          <Paper>
            <Table>
              <TableBody>
                {data.exchangeDeals.map(deal => (
                  <TableRow key={deal._id}>
                    <TableCell>{deal.company_name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="deal-org">{_.get(deal, 'organization.name', 'Allocations')}</span></TableCell>
                    <TableCell>
                      <Button variant="contained" className="trade-btn" style={{backgroundColor: "#53B987", color: "#fff"}}>
                        <Link to={`/exchange/${deal.slug}`}>Trade &nbsp;<FontAwesomeIcon icon="arrow-right" /></Link>
                      </Button>
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