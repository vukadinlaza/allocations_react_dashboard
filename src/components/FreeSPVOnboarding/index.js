import React, { useState, useEffect } from 'react'
import { isEqual } from "lodash"
import { useParams, useHistory } from "react-router-dom"
import { TextField } from '@material-ui/core'
import { Row, Col } from 'reactstrap'
import { useSimpleReducer } from '../../utils/hooks'

import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import { ORG_OVERVIEW } from '../admin/AdminHome'
import { Button } from '@material-ui/core'
import FormError from '../forms/Error'
import "./style.scss"

const CREATE_ORG_AND_DEAL = gql`
  mutation CreateOrgAndDeal($orgName: String!, $deal: DealInput!) {
    createOrgAndDeal(orgName: $orgName, deal: $deal) {
      _id
      organization {
        _id
        slug
      }
    }
  }
`

const emptyDeal = {
  company_name: "", 
  deal_lead: "", 
  company_description: "", 
  date_closed: "",
  onboarding_link: "",
  pledge_link: ""
}

export default function FreeSPVOnboarding () {
  const history = useHistory()
  const [orgName, setOrgName] = useState("")
  const [deal, setDeal] = useSimpleReducer(emptyDeal)
  const [hasChanges, setHasChanges] = useState(false)

  const [createOrgAndDeal, { error }] = useMutation(CREATE_ORG_AND_DEAL, { 
    onCompleted: ({createOrgAndDeal: deal}) => 
      history.push(`/admin/${deal.organization.slug}/deals/${deal._id}/edit`) 
  })

  const submit = () => {
    createOrgAndDeal({ variables: { orgName, deal } })
  }

  useEffect(() => {
    setHasChanges(!isEqual(deal, {}))
  }, [deal])
  
  return (
    <div className="FreeSPVOnboarding form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Create Fund</div>
        </Col>
      </Row>
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <TextField style={{width: "100%"}} 
            value={orgName}
            onChange={e => setOrgName(e.target.value)} 
            label="Fund Name" 
            variant="outlined" />
        </Col>
      </Row>
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Create SPV</div>
        </Col>
      </Row>
      <form className="form" noValidate autoComplete="off">
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.company_name}
              onChange={e => setDeal({ company_name: e.target.value })} 
              label="Company Name" 
              variant="outlined" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}} 
              value={deal.deal_lead}
              onChange={e => setDeal({ deal_lead: e.target.value })}
              label="Deal Lead" 
              variant="outlined" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 6, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.company_description} 
              onChange={e => setDeal({ company_description: e.target.value })}
              label="Company Description" 
              variant="outlined" />
          </Col>
          <Col sm={{size: 2}}>
            <TextField style={{width: "100%"}} 
              value={deal.date_closed}
              onChange={e => setDeal({ date_closed: e.target.value })} 
              label="Closing Date" 
              variant="outlined" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!hasChanges} 
              variant="contained"
              onClick={submit} 
              color="primary">
              CREATE
            </Button> 
          </Col>
        </Row>
      </form>
    </div>
  )
}