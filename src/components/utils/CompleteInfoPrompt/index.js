import React from 'react'
import { Col, Row } from 'reactstrap'
import { Fab } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { validate } from '../../forms/InvestorEdit'
import "./style.scss"

export default function CompleteInfoPrompt ({ investor }) {
  const history = useHistory()

  if (investor && validate(investor).length > 0) {
    return (
      <Col lg={{size: 8, offset: 2}} md={{size: 10, offset: 1}} sm={{size: 12, offset: 0}}>
        <div className="tile complete-info-prompt">
          Complete Your Info!&nbsp;&nbsp;
          <Fab onClick={() => history.push('/profile')} size="small" color="secondary" style={{textAlign: 'center'}}>
            <FontAwesomeIcon icon="arrow-right" size="xs" />
          </Fab>
        </div>
      </Col>
    )
  }
  return null
}