import React from 'react'
import TermsPanel from './TermsPanel'
import InvestPanel from './InvestPanel'
import DealHeader from './DealHeader'
import CoinvestorsPanel from './CoinvestorsPanel'
import './styles.scss'
import KeyHighlights from './KeyHighlightsPanel'

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
      <div className="flex-container">
        <CoinvestorsPanel deal={deal} coinvestors={coinvestors} />
        <KeyHighlights deal={deal} />
        <TermsPanel deal={deal} />
      </div>
    </section>
  )
}

export default LandingPage
