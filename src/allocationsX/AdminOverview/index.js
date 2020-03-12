import React, { useEffect, useState } from 'react'
import { Row, Col } from 'reactstrap'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { useSimpleReducer } from '../../utils/hooks'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, TextField, InputAdornment, InputLabel } from '@material-ui/core'
import Loader from '../../components/utils/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MATCH_REQUESTS = gql`
  query MatchRequests($org: String!) {
    matchRequests(org: $org) {
      _id
      status
      submitted_at
      order {
        _id
        price
        amount
        side
      }
    }
  }
`

export default function AdminExchangeOverview () {
  const { organization } = useParams()
  const { data, error } = useQuery(MATCH_REQUESTS, { variables: { org: organization } })

  console.log({data})

  return (
    <div className="AdminExchangeOverview">
      Admin Exchange Overview
    </div>
  )
}