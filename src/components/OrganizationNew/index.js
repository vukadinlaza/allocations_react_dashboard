import React, { useEffect, useState } from 'react'
import { gql } from 'apollo-boost'
import { useHistory } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import Cropper from 'react-easy-crop'
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
  return org.name && org.slug
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
      </Row>
      <Row>
        <Col md={{size: 4, offset: 1}} sm={{size: 8, offset: 0}}>
          <TextField style={{width: "100%", marginBottom: "15px"}} 
            value={organization.slug}
            onChange={e => setOrg({ slug: e.target.value.replace(" ", "") })} 
            label="URL (no spaces)"
            variant="filled" />
        </Col>
      </Row>
      <Row style={{marginBottom: "20px"}}>
        <LogoUpload organization={organization} setOrg={setOrg} />
      </Row>
      <Row>
        <Col md={{size: 4, offset: 1}}>
          <Button variant="contained" color="primary" disabled={!valid(organization)} onClick={submit}>CREATE</Button>
        </Col>
      </Row>
    </div>
  )
}

function LogoUploadAlt ({ organization, setOrg }) {
  const [zoom, setZoom] = useState(0)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = (_croppedArea, _croppedAreaPixels) => {
    setCroppedAreaPixels(_croppedAreaPixels)
  }

  if (organization.logoSrc) {
    return (
      <Col md={{size: 8, offset: 1}}>
        <span className="file-label">Logo &nbsp;&nbsp;</span>
        <div style={{ height: "360px", width: "100%", border: "1px dotted red", position: "relative"}}>
          <Cropper
            image={organization.logoSrc}
            crop={crop}
            aspect={3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      </Col>
    )
  }

  return (
    <Col md={{size: 4, offset: 1}}>
       <span className="file-label">Logo (3:1 width to height) &nbsp;&nbsp;</span>
       <Button variant="contained" component="label">
         Upload&nbsp;&nbsp;
         <input type="file" 
          style={{ display: "none" }} 
          onChange={async ({ target }) => {
            if (target.validity.valid) {
              console.log(target.files[0])
              setOrg({ logo: target.files[0], logoSrc: await readFile(target.files[0]) })
            }
          }} />
      </Button>
    </Col>
  )
}

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
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
      <span className="file-label">Logo (3:1 width to height) &nbsp;&nbsp;</span>
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