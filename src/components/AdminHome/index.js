import React from 'react'
import _ from 'lodash'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useAuth } from "../../auth/useAuth"
import { useParams, Link } from 'react-router-dom'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { Paper, Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core'
import { Col, Row } from 'reactstrap'
import Loader from '../utils/Loader'

import "./style.scss"

const ORG = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      name
      slug
      deals {
        _id
        status
        company_name
        company_description
        investments {
          _id
        }
      }
      investors {
        _id
        name
      }
      investments {
        _id
        amount
        deal {
          _id
          company_name
        }
        investor {
          _id
          name
        }
      }
    }
  }
`

export default function AdminHome () {
  const { organization } = useParams()
  const { data, error } = useQuery(ORG, { variables: { slug: organization } })

  if (!data) return <Loader />

  const org = data.organization

  const { onboarding, closing, closed } = _.groupBy(org.deals, 'status')

  return (
    <div className="AdminHome">
      <Row>
        <Col sm={{size: 8, offset: 2}}>
          <h2>{org.name}</h2>
        </Col>
      </Row>
      <Row>
        <Col sm={{size: 4, offset: 2}}>
          <Paper style={{padding: "10px 15px"}}>
            <div className="deals-title">Deals <span>{org.deals.length}</span></div>
            <hr></hr>
            {org.deals.map(deal => (
              <Deal key={deal._id} deal={deal} />
            ))}
          </Paper>
        </Col>
        <Col sm={{size: 4, offset: 2}}>
          <Paper>
            <Table>
              <TableBody>
                {(org.investments || []).map(investment => (
                  <TableRow>
                    <TableCell>{investment.deal.company_name}</TableCell>
                    <TableCell>{investment.investor.name}</TableCell>
                    <TableCell>${nWithCommas(investment.amount)}</TableCell>
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

function Deal ({ deal }) {
  console.log(deal.investments)

  return (
    <div className="deal-info">
      <div className="company-name">
        {deal.company_name}&nbsp;
        <span className="deal-status">{deal.status}</span>
      </div>
      <div>
      </div>
    </div>
  )
}

