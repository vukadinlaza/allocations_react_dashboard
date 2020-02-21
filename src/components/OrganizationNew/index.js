import React, { useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useHistory } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import { useMutation } from '@apollo/react-hooks'
import { Button, TextField } from '@material-ui/core'
import { useSimpleReducer } from '../../utils/hooks'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const CREATE_ORG = gql`
  mutation CreateOrg($organization: OrganizationInput!) {
    createOrganization(organization: $organization) {
      _id
      name
      slug
    }
  }
`

function valid (org) {
  return org.name && org.slug && org.logo
}

export default function OrganizationNew () {
  const history = useHistory()
  const [organization, setOrg] = useSimpleReducer({ name: "", slug: ""}) 
  const [createOrg, { data, error, loading }] = useMutation(CREATE_ORG)

  useEffect(() => {
    if (data) history.push(`/admin/${organization.slug}`)
  }, [data])

  const submit = () => {
    if (valid(organization)) {
      createOrg({ variables: { organization }})
    }
  }

  return (
    <div className="OrganizationNew">
      <Row style={{marginBottom: "20px", fontSize: "1.4em"}}>
        <Col md={{size: 4, offset: 1}} sm={{size: 8, offset: 0}}>
          <div>New Organization</div>
        </Col>
      </Row>
      <Row style={{marginBottom: "20px"}}>
        <Col md={{size: 4, offset: 1}} sm={{size: 8, offset: 0}}>
          <TextField style={{width: "100%"}} 
            value={organization.name}
            onChange={e => setOrg({ name: e.target.value })} 
            label="Organization Name" 
            variant="filled" />
        </Col>
        <Col md="4" sm="8">
          <TextField style={{width: "100%"}} 
            value={organization.slug}
            onChange={e => setOrg({ slug: e.target.value.replace(" ", "") })} 
            label="Slug (no spaces)"
            variant="filled" />
        </Col>
      </Row>
      <Row style={{marginBottom: "20px"}}>
        <LogoUpload organization={organization} setOrg={setOrg} />
      </Row>
      <Row>
        <Col md={{size: 4, offset: 1}}>
          <Button variant="contained" disabled={!valid(organization)} onClick={submit}>CREATE</Button>
        </Col>
      </Row>
    </div>
  )
}

function LogoUpload ({ organization, setOrg }) {
  if (organization.logo) {
    return (
      <Col md={{size: 4, offset: 1}}>
        <span className="file-label">Logo &nbsp;&nbsp;</span>
        <FontAwesomeIcon icon="check" />
      </Col>
    )
  }

  return (
    <Col md={{size: 4, offset: 1}}>
      <span className="file-label">Logo &nbsp;&nbsp;</span>
      <Button variant="contained" component="label">
        Upload&nbsp;&nbsp;
        <input type="file" 
          style={{ display: "none" }} 
          onChange={({ target }) => {
            if (target.validity.valid) setOrg({ logo: target.files[0] })
          }} />
      </Button>
    </Col>
  )
}