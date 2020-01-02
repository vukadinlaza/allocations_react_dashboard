import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import { gql } from 'apollo-boost'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks';
import { Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core'

const GET_DEAL = gql`
  query Deal($id: String!) {
    deal(_id: $id) {
      _id
      company_name
      company_description
      date_closed
      deal_lead
      pledge_link
      onboarding_link
      closed
      investments {
        _id
        amount
      }
      invitedInvestors {
        _id
        first_name
        last_name
        email
      }
    } 
  }
`

export default function Deal () {
  const params = useParams()
  const [deal, setDeal] = useState(null) 
  const { data, error, loading } = useQuery(GET_DEAL, { variables: { id: params.id }})

  useEffect(() => {
    if (data && !deal) setDeal(data.deal)
  }, [deal, data])

  if (!deal) return <Loader />

  return (
    <div className="Deal">
      <div className="deal-header">{deal.company_name} [edit]</div>
      <div className="deal-description">{deal.company_description}</div>

      <Paper className="investments">
        <Table>
          <TableBody>
          {deal.investments.map(investment => {
            return (
              <TableRow key={investment._id} className="investment">
                <TableCell></TableCell>
              </TableRow>
            )
          })}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}