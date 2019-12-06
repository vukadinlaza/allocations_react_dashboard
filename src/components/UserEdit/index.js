import React, { useState, useEffect } from 'react'
import { get, isEqual } from "lodash"
import { useLocation, useHistory, Redirect } from "react-router-dom"
import { TextField } from '@material-ui/core'
import { Row, Col } from 'reactstrap'
import { useAuth0 } from "../../react-auth0-spa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { gql } from 'apollo-boost'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'
import "./style.scss"

const UPDATE_USER = gql`
  mutation UpdateUser($_id: String!, $email: String!, $first_name: String!, $last_name: String!) {
    updateUser(_id: $_id, email: $email, first_name: $first_name, last_name: $last_name) {
      _id
      email
      first_name
      last_name
    }
  }
`

export default function DealEdit () {
  const { user: auth0User } = useAuth0()
  const { state } = useLocation()
  const history = useHistory()

  const [user, setUser] = useState(null)
  const [canSubmit, setCanSubmit] = useState(false)
  const [updateUser, updateUsersRes] = useMutation(UPDATE_USER)

  useEffect(() => {
    if (state && !user) setUser(state)
  }, [state])

  useEffect(() => {
    setCanSubmit(user && user.first_name && user.last_name && user.email)
  }, [user])

  useEffect(() => {
    console.log(updateUsersRes.data)
    if (updateUsersRes.data) return history.push("/")
  }, [updateUsersRes])

  const updateUserProp = ({ prop, newVal }) => {
    setUser(prev => ({ ...prev, [prop]: newVal }))
  }
  
  return (
    <div className="DealEdit form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Complete Your Info!</div>
        </Col>
      </Row>
      <form className="form" noValidate autoComplete="off">
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={get(user, 'first_name') || ""} 
              onChange={e => updateUserProp({ prop: "first_name", newVal: e.target.value })}
              label="First Name" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={get(user, 'last_name') || ""}
              onChange={e => updateUserProp({ prop: "last_name", newVal: e.target.value })}
              label="Last Name" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={get(user, 'email') || ""} 
              label="email" 
              disabled
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!canSubmit} 
              variant="contained"
              onClick={() => {
                console.log(user)
                updateUser({ variables: user })
              }} 
              color="primary">
              UPDATE INFO
            </Button> 
          </Col>
        </Row>
      </form>
    </div>
  )
}