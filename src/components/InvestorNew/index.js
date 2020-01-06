import React, { useState, useEffect } from 'react'
import { get, isEqual } from 'lodash'
import { gql } from 'apollo-boost'
import { Row, Col } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { useAuth0 } from '../../react-auth0-spa'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TextField, Button } from '@material-ui/core'

import Loader from "../utils/Loader"
import InvestorEditForm from "../forms/InvestorEdit"

const CREATE_INVESTOR = gql`
  mutation CreateInvestor($user: UserInput!) {
    createInvestor(user: $user) {
      _id
    }
  }
`

export default function InvestorNew () {
  const history = useHistory()
  const { user } = useAuth0()
  const [error, setError] = useState(false)
  const [email, setEmail] = useState("")
  const [createInvestor, { data }] = useMutation(CREATE_INVESTOR)

  useEffect(() => {
    if (data && data.createInvestor._id) history.push(`/investor/${data.createInvestor._id}/edit`)
  }, [data])

  const submit = () => {
    if (!email) return setError(true)
    createInvestor({ variables: { user: { email } }})
  }

  return (
    <div className="InvestorEdit">
      <Row>
        <Col sm={{size: 9, offset: 1}}>
          <h4>
            Create Investor
          </h4>
        </Col>
      </Row>
      <Col sm={{size: 4, offset: 1}} style={{marginBottom: "15px"}}>
        <TextField required
            error={error}
            style={{width: "100%"}} 
            value={email}
            onChange={e => setEmail(e.target.value)}
            label="Email" 
            variant="filled" />
      </Col>
      <Col sm={{size: 4, offset: 1}}>
        <Button variant="contained"
          onClick={submit} 
          color="primary">
          CREATE INVESTOR
        </Button>
      </Col>
    </div>
  )
}