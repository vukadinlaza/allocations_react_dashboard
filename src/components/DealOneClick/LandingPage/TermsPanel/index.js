import React from 'react'
import './styles.scss'

const TermsPanel = ({ deal }) => {

  const { deal_lead, maximumInvestment } = deal

  return (
    <section className="TermsPanel">
      <p className="section-label">Terms</p>
      <ul>
        <li>
          <p>Deal lead:</p>
          <h3>{deal_lead}</h3>
        </li>
        <li>
          <p>Maximum investment:</p>
          <h3>{maximumInvestment ? maximumInvestment : 'No maximum investment amount set.'}</h3>
        </li>
      </ul>
    </section>
  )
}

export default TermsPanel;
