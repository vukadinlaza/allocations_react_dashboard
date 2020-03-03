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

  const sortedDeals = _.orderBy(data.exchangeDeals, ({ slug }) => slug === "oncosenx", "desc")

  return (
    <div className="AllocationsX-Home">
      <Row>
        <Col md={{size: 8, offset: 1}} sm={{size: 10, offset: 1}}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="text-center">Company</TableCell>
                  <TableCell>Volume</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedDeals.map(deal => (
                  <TableRow key={deal._id}>
                    <TableCell>
                      <DealLogo deal={deal} />
                    </TableCell>
                    <TableCell>
                      {deal.slug === "oncosenx" ? <span className="volume">$30,000</span> : ""}
                    </TableCell>
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

const BASE_URL = "https://allocations-public.s3.us-east-2.amazonaws.com"
function DealLogo ({ deal }) {
  const [err, setErr] = useState(null)

  if (err) {
    return (
      <div className="deal-logo"> 
        <span style={{height: "30px", width: "150px"}}>
          <b>{deal.company_name}</b>
        </span>
      </div>
    )
  }

  return (
    <div className="deal-logo">
      <img width="150px" height="40px"
        src={`${BASE_URL}/deals/${deal.slug}.png`} onError={setErr} />
    </div>
  )
}