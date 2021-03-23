import React from 'react'
import { Button } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './styles.scss'


function InvestingAsPanel() {
  return (
    <section className="InvestingAsPanel">
      <p className="section-label">Investing as</p>
      <Button>
        <CheckCircleIcon />
        Myself/Individual
      </Button>
      {/* <Button>
        <CheckCircleIcon />
        Joint with spouse
      </Button>
      <Button>
        <CheckCircleIcon />
        LLC
      </Button>
      <Button>
        <CheckCircleIcon />
        Partnership
      </Button>
      <Button>
        <CheckCircleIcon />
        Trust
      </Button> */}
    </section>
  )
}

export default InvestingAsPanel
