import React from 'react'
import './styles.scss'

const TermsPanel = ({ deal }) => {

  const { deal_lead, dealParams: { totalCarry, managementFees } } = deal

  return (
    <section className="TermsPanel">
      <p className="section-label">Terms</p>
      <ul>
        <li>
          <p>Deal lead:</p>
          <h3>{deal_lead}</h3>
        </li>
        <li>
          <p>Total carry:</p>
          <h3>{totalCarry ? totalCarry : 'Not specified.'}</h3>
        </li>
        <li>
          <p>Total management fee:</p>
          <h3>{managementFees ? managementFees : 'Not specified.'}</h3>
        </li>
      </ul>
    </section>
  )
}

export default TermsPanel;
