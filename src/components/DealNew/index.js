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
import "./style.scss"

const CREATE_DEAL = gql`
  mutation CreateDeal($org: String!, $deal: DealInput!) {
    createDeal(org: $org, deal: $deal) {
      _id
    }
  }
`

export default function DealNew () {
  const history = useHistory()
  const { organization } = useParams()
  const [deal, setDeal] = useSimpleReducer({})
  const [hasChanges, setHasChanges] = useState(false)
  const [createDeal] = useMutation(CREATE_DEAL, { 
    refetchQueries: [{ query: ORG_OVERVIEW }],
    onCompleted: ({createDeal}) => history.push(`/admin/${organization}/deals/${createDeal._id}/edit`) 
  })

  useEffect(() => {
    setHasChanges(!isEqual(deal, {}))
  }, [deal])
  
  return (
    <div className="DealEdit form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Create Deal</div>
        </Col>
      </Row>
      <form className="form" noValidate autoComplete="off">
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.company_name}
              onChange={e => setDeal({ company_name: e.target.value })} 
              label="Company Name" 
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}} 
              value={deal.deal_lead}
              onChange={e => setDeal({ deal_lead: e.target.value })}
              label="Deal Lead" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 6, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.company_description} 
              onChange={e => setDeal({ company_description: e.target.value })}
              label="Company Description" 
              variant="filled" />
          </Col>
          <Col sm={{size: 2}}>
            <TextField style={{width: "100%"}} 
              value={deal.date_closed}
              onChange={e => setDeal({ date_closed: e.target.value })} 
              label="Closing Date" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.pledge_link} 
              onChange={e => setDeal({ pledge_link: e.target.value })}
              label="Pledge Link" 
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}}
              value={deal.onboarding_link}
              onChange={e => setDeal({ onboarding_link: e.target.value })} 
              label="Onboarding Link" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!hasChanges} 
              variant="contained"
              onClick={() => createDeal({ variables: { org: organization, deal } })} 
              color="primary">
              CREATE
            </Button> 
          </Col>
        </Row>
      </form>
    </div>
  )
}