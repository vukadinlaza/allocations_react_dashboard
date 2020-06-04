import React, {useEffect, useState} from 'react'
import Loader from '../utils/Loader'
import {gql} from 'apollo-boost'
import {useLazyQuery} from '@apollo/react-hooks';
import {useAuth} from "../../auth/useAuth";
import {useAuth0} from "../../react-auth0-spa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import InvestorEditForm from "../forms/InvestorEdit"
import Typography from '@material-ui/core/Typography';

import {Col, Row} from "reactstrap"
import "./style.scss"

/***
 *
 * investor profile / edit
 *
 **/

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
      accredidation_doc {
        link
        path
      }
      passport {
        link
        path
      }
    }
  }
`

export default function Profile() {
  const [investor, setInvestor] = useState(null)
  const [formStatus, setFormStatus] = useState("edit")
  const {data, error, refetch, user, params, adminView} = useAuth(GET_INVESTOR)

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
    : (formStatus === "complete" ? "check" : null)

  if (!investor) return <Loader/>

  return (
    <div className="Profile">
      <Row>
        <Col sm={{size: 9, offset: 1}}>
          <Typography variant="h4">
            Profile {icon && <FontAwesomeIcon icon={icon} spin={icon === "circle-notch"}/>}
          </Typography>
        </Col>
      </Row>
      <InvestorEditForm investor={investor}
                        refetch={refetch}
                        setInvestor={setInvestor}
                        setFormStatus={setFormStatus}
                        actionText="UPDATE PROFILE"/>
    </div>
  )
}
