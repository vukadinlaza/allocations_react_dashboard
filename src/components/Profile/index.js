import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import { get } from "lodash"
import { useLocation, Link } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InvestorEditForm from "../forms/InvestorEdit"

import { Col, Row } from "reactstrap"
import { Paper, Button } from '@material-ui/core'
import "./style.scss"

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      passport {
        link
        path
      }
    }
  }
`

export default function Profile () {
  const [editMode, setEditMode] = useState(true)
  const [investor, setInvestor] = useState(null)
  const [formStatus, setFormStatus] = useState("edit")
  const [getInvestor, { data, error, refetch }] = useLazyQuery(GET_INVESTOR)
  const { user } = useAuth0()

  useEffect(() => {
    if (user && user.email) getInvestor({ variables: { email: user.email }})
  }, [user])

  useEffect(() => {
    if (data) {
      const {__typename, ...rest} = data.investor
      setInvestor(rest)
    }
  }, [data])

  useEffect(() => {
    if (formStatus === "complete") refetch()
  }, [formStatus])
  
  const icon = formStatus === "loading" 
    ? "circle-notch" 
    : (formStatus === "complete" ? "check" : "edit")

  if (!investor) return <Loader />

  return (
    <div className="Profile">
      <Row>
        <Col sm={{size: 9, offset: 1}}>
          <h4>
            Profile <FontAwesomeIcon icon={icon} spin={icon === "circle-notch"} />
          </h4>
        </Col>
      </Row>
      <InvestorEditForm investor={investor}
        refetch={refetch}
        setInvestor={setInvestor}
        setFormStatus={setFormStatus} 
        actionText="UPDATE PROFILE" />
    </div>
  )
}