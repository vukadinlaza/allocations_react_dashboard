import React from 'react'
import TermsAndConditionsPanel from './TermsAndConditionsPanel'
import DealDocumentsPanel from './DealDocumentsPanel'
import InvestingAsPanel from './InvestingAsPanel'
import InvestmentAmountPanel from './InvestmentAmount'
import PersonalInformation from './PersonalInformation'
import PaymentInformation from './PaymentInformation'
import { Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './styles.scss'


function InvestmentPage({ deal, investor, toggleInvestmentPage }) {

  const history = useHistory();


  const {
    company_name
  } = deal

  return (
    <section className="InvestmentPage">
      <Button className="back-button" onClick={() => history.push()}>
        <ArrowBackIcon />
        Back to Deal Page
      </Button>
      <div>
        <h1 className="investment-header">
          Invest in {company_name}
        </h1>
      </div>

      <div className="flex-container">
        <main>
          <InvestmentAmountPanel />
          <PersonalInformation />
          <PaymentInformation />
        </main>
        <aside>
          <InvestingAsPanel />
          <DealDocumentsPanel deal={deal} />
        </aside>
      </div>
      <TermsAndConditionsPanel investor={investor} deal={deal} />
      <Button className="confirm-investment-button">
        Confirm investment
      </Button>
    </section>
  )
}

export default InvestmentPage
