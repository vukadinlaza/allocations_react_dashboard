import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InvestorEditForm from "../forms/InvestorEdit"

import { Col, Row } from "reactstrap"
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
  const [investor, setInvestor] = useState(null)
  const [formStatus, setFormStatus] = useState("edit")
  const [getInvestor, { data, error, refetch, called }] = useLazyQuery(GET_INVESTOR)
  const { user, isAuthenticated, loading } = useAuth0()

  useEffect(() => {
    if (!loading && isAuthenticated && !called) getInvestor()
  }, [isAuthenticated, loading, called])

  useEffect(() => {
    if (error && user) refetch()
  }, [error, user])

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