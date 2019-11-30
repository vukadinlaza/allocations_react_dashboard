import React, { useState, useEffect } from 'react'
import { get, isEqual } from 'lodash'
import { gql } from 'apollo-boost'
import { Row, Col } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { TextField, Button } from '@material-ui/core'
import { useAuth0 } from '../../react-auth0-spa'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './style.scss'

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      email
      documents
    }
  }
`

const UPDATE_INVESTOR = gql`
  mutation UpdateInvestor($_id: String!, $first_name: String, $last_name: String, $email: String, $documents: String) {
    updateInvestor(_id: $_id, first_name: $first_name, last_name: $last_name, email: $email, documents: $documents) {
      _id
      first_name
      last_name
      email
      documents
    }
  }
`

export default function InvestorEdit () {
  const urlParams = useParams()
  const adminView = urlParams && urlParams.id
  const { user } = useAuth0()
  const [hasChanges, setHasChanges] = useState(false)
  const [investor, setInvestor] = useState(null)
  const [getInvestor, investorQuery] = useLazyQuery(GET_INVESTOR)
  const [updateInvestor, updateInvestorRes] = useMutation(UPDATE_INVESTOR)

  useEffect(() => {
    if (user && !investorQuery.called) {
      const params = adminView ? { _id: urlParams.id } : { email: user.email }
      getInvestor({ variables: params })
    }
  }, [user])

  useEffect(() => {
    setHasChanges(investorQuery.data && !isEqual(investor, get(investorQuery, 'data.investor')))
  }, [investor])

  useEffect(() => {
    if (investorQuery.data && !investor) setInvestor(investorQuery.data.investor)
  }, [investorQuery])

  // updates investor when data returned from update mutation
  useEffect(() => {
    if (updateInvestorRes && updateInvestorRes.data) setInvestor(updateInvestorRes.data.updateInvestor)
  }, [updateInvestorRes])

  const updateInvestorProp = ({ prop, newVal }) => setInvestor(prev => ({ ...prev, [prop]: newVal }))

  return (
    <div className="InvestorEdit form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Edit Profile</div>
        </Col>
      </Row>
      <form className="form" noValidate autoComplete="off">
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={get(investor, 'first_name', "")} 
              onChange={e => updateInvestorProp({ prop: "first_name", newVal: e.target.value })}
              label="First Name"
              variant="filled" />
          </Col>
          <Col sm="4">
            <TextField style={{width: "100%"}} 
              value={get(investor, 'last_name', "")} 
              onChange={e => updateInvestorProp({ prop: "last_name", newVal: e.target.value })}
              label="Last Name"
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={get(investor, 'email', "")} 
              onChange={e => updateInvestorProp({ prop: "email", newVal: e.target.value })}
              label="Email"
              variant="filled" />
          </Col>
          <Col sm="4">
            <DocumentsLink investor={investor} updateInvestorProp={updateInvestorProp} />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button variant="contained" disabled={!hasChanges} color="primary" className="update-button" onClick={() => updateInvestor({ variables: investor })}>
              UPDATE
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  )
}

function DocumentsLink ({ investor, updateInvestorProp }) {
  return (
    <div className="documents-link">
      <TextField style={{width: "75%"}} 
        value={get(investor, 'documents') || ""} 
        onChange={e => updateInvestorProp({ prop: "documents", newVal: e.target.value })}
        label="Documents 🔗"
        variant="filled" />
      <div style={{display: "inline-block", width: "5%"}}></div>
      <Button variant="contained" component="label" className="change-button" color="secondary" style={{width: "20%"}}>
        Upload
        <input type="file" onChange={e => updateInvestorProp({ prop: "documents", newVal: e.target.value })} style={{ display: "none" }} />
      </Button>
    </div>
  )
}