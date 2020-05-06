import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { Row, Col } from 'reactstrap'
import { useParams, useHistory } from 'react-router-dom'
import { useAuth0 } from '../../react-auth0-spa'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Paper, Button } from '@material-ui/core'

import Loader from "../utils/Loader"
import InvestorEditForm from "../forms/InvestorEdit"

import './style.scss'

/***
 *
 * superadmins interface to edit any investor
 *
 **/

const GET_INVESTOR = gql`
  query GetInvestor($id: String!) {
    investor(_id: $id) {
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

const DELETE_INVESTOR = gql`
  mutation DeleteInvestor($id: String!) {
    deleteInvestor(_id: $id)
  }
`

export default function InvestorEdit () {
  const params = useParams()
  const [formStatus, setFormStatus] = useState("edit")
  const { user } = useAuth0()
  const [investor, setInvestor] = useState(null)
  const [getInvestor, { data, refetch }] = useLazyQuery(GET_INVESTOR)

  useEffect(() => {
    if (user && user.email) getInvestor({ variables: { id: params.id }})
  }, [user])

  useEffect(() => {
    if (data) {
      const {__typename, ...rest} = data.investor
      setInvestor(rest)
    }
  }, [data])

  const icon = formStatus === "loading" 
    ? "circle-notch" 
    : (formStatus === "complete" ? "check" : "edit")

  if (!investor) return <Loader />

  return (
    <div className="InvestorEdit">
      <Row>
        <Col sm={{size: 9, offset: 1}}>
          <h4>
            Profile <FontAwesomeIcon icon={icon} spin={icon === "circle-notch"} />
          </h4>
        </Col>
      </Row>
      <InvestorEditForm noValidate
        investor={investor}
        refetch={refetch}
        setInvestor={setInvestor}
        setFormStatus={setFormStatus} 
        actionText="EDIT INVESTOR" />
      <Row>
        <DeleteInvestor investor={investor} />
      </Row>
    </div>
  )
}

function DeleteInvestor ({ investor }) {
  const history = useHistory()
  const [delInvestor, { data, error }] = useMutation(DELETE_INVESTOR)

  useEffect(() => {
    if (data && data.deleteInvestor) history.push('/investors')
  }, [data])

  const submit = () => {
    if (window.confirm(`Delete ${investor.first_name} ${investor.last_name}?`)) {
      delInvestor({ variables: { id: investor._id }})
    }
  }

  return (
    <Col sm={{size: 6, offset: 1}}>
      <Paper className="DeleteInvestor">
        <div>DANGER ZONE</div>
        <Button variant="contained" onClick={submit}>DELETE INVESTOR</Button>
      </Paper>
    </Col>
  )
}