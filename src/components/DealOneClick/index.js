
import React from 'react'
import TabMenuPanel from './TabMenuPanel'
import './style.scss'
import TermsPanel from './TermsPanel'
import InvestPanel from './InvestPanel'
import DealHeader from './DealHeader'
import CoinvestorsPanel from './CoinvestorsPanel'


function DealOneClick() {

  return (
    <div className="DealOneClick">
      <DealHeader />
      <InvestPanel />

      <div className="container">
        <CoinvestorsPanel />
        <TabMenuPanel />
      </div>

      <TermsPanel />
    </div>
  )
}

export default DealOneClick
