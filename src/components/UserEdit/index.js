import React, { useState, useEffect } from 'react'
import { get, isEqual } from "lodash"
import { useLocation, useHistory, Redirect } from "react-router-dom"
import { TextField } from '@material-ui/core'
import { Row, Col } from 'reactstrap'
import { useAuth0 } from "../../react-auth0-spa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InvestorEditForm from "../forms/InvestorEdit"

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
  const { state: {redirect, ...state} } = useLocation()
  const [formStatus, setFormStatus] = useState("edit")
  const history = useHistory()

  const [user, setUser] = useState(null)
  const [updateUser, updateUsersRes] = useMutation(UPDATE_USER)

  useEffect(() => {
    if (state && !user) {
      // filter out non input pieces
      const {__typename, admin, ...rest} = state
      setUser(rest)
    }
  }, [state])

  useEffect(() => {
    if (formStatus === "complete") return history.push(redirect || "/")
  }, [formStatus])
  
  return (
    <div className="DealEdit form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Complete Your Info!</div>
        </Col>
      </Row>
      <InvestorEditForm investor={user} 
        setInvestor={setUser}
        setFormStatus={setFormStatus}
        actionText={"COMPLETE SIGNUP"} />
    </div>
  )
}