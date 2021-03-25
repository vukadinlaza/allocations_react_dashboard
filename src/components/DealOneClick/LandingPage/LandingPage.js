import React from 'react'
import TermsPanel from './TermsPanel'
import InvestPanel from './InvestPanel'
import DealHeader from './DealHeader'
import CoinvestorsPanel from './CoinvestorsPanel'
import TabMenuPanel from './TabMenuPanel'
import './styles.scss'

function LandingPage({ deal, toggleInvestmentPage }) {

  const {
    dealParams: { coinvestors },
  } = deal;

  return (
    <section className="LandingPage">
      <div className="flex-container">
        <DealHeader deal={deal} />
        <InvestPanel
          deal={deal}
          toggleInvestmentPage={toggleInvestmentPage}
        />
      </div>
      <div className="container">
        <CoinvestorsPanel deal={deal} coinvestors={coinvestors}/>
        <TabMenuPanel deal={deal} />
      </div>
      <TermsPanel deal={deal}/>
    </section>
  )
}

export default LandingPage
