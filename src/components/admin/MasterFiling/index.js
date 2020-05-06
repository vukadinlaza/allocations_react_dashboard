import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { Row, Col, Card } from 'reactstrap'
import { Paper, LinearProgress } from '@material-ui/core'
import Loader from '../../utils/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import "./style.scss"

/***
 *
 * Overview of steps for master filing (for fund admins)
 *
 **/

const MASTER_FILING = gql`
  query MasterFiling($slug: String!) {
    organization(slug: $slug) {
      _id
      name
      legal_name
      masterFiling {
        _id
        step
        status
        subCategory
      }
    }
  }
`

export default function MasterFiling () {
  const { organization } = useParams()
  const { data, error } = useQuery(MASTER_FILING, { variables: { slug: organization } })

  if (!data) return (
    <div className="MasterFiling">
      <Row>
        <Col sm={{size: 6, offset: 1}}>
          <Paper style={{padding: "20px"}}>
            <div className="filing-header">
              <span>Master Filing Progress</span>
            </div>
            <hr />
            <Loader />
          </Paper>
        </Col>
      </Row>
    </div>
  )

  const { masterFiling } = data.organization

  if (masterFiling.length === 0) {
    return (
      <div className="MasterFiling">
        <Row>
          <Col sm={{size: 6, offset: 1}}>
            <Paper style={{padding: "20px"}}>
              <div className="filing-header">
                <span>Master Filing Progress</span>
              </div>
              <hr />
              <p className="not-setup">Not yet setup, please ask to team to begin tracking your master filing steps!</p>
            </Paper>
          </Col>
        </Row>
      </div>
    )
  }

  const grouped = _.groupBy(masterFiling, 'subCategory')

  const progress = Math.round((masterFiling.filter(x => x.status === 1).length / masterFiling.length) * 100)

  return (
    <div className="MasterFiling">
      <Row>
        <Col sm={{size: 6, offset: 1}}>
          <Paper style={{padding: "20px"}}>
            <div className="filing-header">
              <span>Master Filing Progress</span>
            </div>
            {Object.entries(grouped).map(([subCat, steps]) => (
              <SubCategory key={subCat} subCat={subCat} steps={steps} />
            ))}
          </Paper>
        </Col>
      </Row>
    </div>
  )
}

function SubCategory ({ subCat, steps }) {
  const [open, setOpen] = useState(false)
  const progress = Math.round((_.filter(steps, 'status').length / steps.length) * 100)

  return (
    <Paper className="sub-category">
      <h4 onClick={() => setOpen(x => !x)} className={classNames({ selected: open })}>
        <span>{subCat}</span> 
        <span className="progress-wrapper">
          {progress == 100 && <FontAwesomeIcon icon="check-circle" />}
          {progress < 100 && 
            <LinearProgress style={{height: "18px"}}
              color="primary"
              className="progress" 
              variant="determinate" 
              value={progress} />
          }
        </span>
      </h4>
      {open && 
        <div className="sub-steps">
          {steps.map((step, i) => (
            <Step key={i} step={step} />
          ))}
        </div>
      }
    </Paper>
  )
}

function Step ({ step }) {
  return (
    <Paper className="step">
      {step.step} <FontAwesomeIcon icon={step.status === 1 ? ["fas", "check-square"] : ["far", "square"]} />
    </Paper>
  )
}