import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './styles.scss'
import completeKycYes from '../../assets/complete-kyc-yes.svg'
import completeKycNo from '../../assets/complete-kyc-no.svg'
import signInvestmentYes from '../../assets/sign-investment-yes.svg'
import wireFundsYes from '../../assets/wire-funds-yes.svg'
import wireFundsNo from '../../assets/wire-funds-no.svg'
import submitTaxInfoYes from '../../assets/submit-tax-info-yes.svg'
import submitTaxInfoNo from '../../assets/submit-tax-info-no.svg'
import Confetti from 'react-confetti'
import AllocationsRocket from './AllocationsRocket/AllocationsRocket';


function DealNextSteps() {

  const [confetti, showConfetti] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      showConfetti(true)
    }, 1000)
    setTimeout(() => {
      showConfetti(false)
    }, 5000)
  }, [])


  return (
    <section className="DealNextSteps">
      <Button className="back-button">
        <ArrowBackIcon />
        Back to Invest Page
      </Button>
      <h1 className="header">Next Steps</h1>
      <h3 className="sub-header">Please complete the following steps to finish your investment.</h3>

      <div className="action-item">
        <img className="action-icon" src={signInvestmentYes} />
        <div className="action-instructions">
          <p className="action-header">Sign for Investment</p>
        </div>
        <Button class="completed-step-button" disabled={true}>Completed</Button>
      </div>

      <div className="action-item">
        <img className="action-icon" src={wireFundsNo} />
        <div className="action-instructions">
          <p className="action-header">View Wire Instructions</p>
          <p className="action-sub-header">Required to complete your investment</p>
        </div>
        <Button class="next-step-button">View Wire Instructions</Button>
      </div>

      <div className="action-item">
        <img className="action-icon" src={completeKycNo} />
        <div className="action-instructions">
          <p className="action-header">Complete KYC</p>
          <p className="action-sub-header">Required to verify your identity</p>
        </div>
        <Button class="next-step-button">Verify Identity</Button>
      </div>

      <div className="action-item">
        <img className="action-icon" src={submitTaxInfoNo} />
        <div className="action-instructions">
          <p className="action-header">Submit Tax Information</p>
          <p className="action-sub-header">Complete your W8/W9 forms here</p>
        </div>
        <Button class="next-step-button">Submit Tax Info</Button>
      </div>
      <AllocationsRocket />
      <Confetti className={`confetti ${!confetti && 'hidden'}`} />
    </section>
  )
}

export default DealNextSteps
