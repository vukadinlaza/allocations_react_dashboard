import React from 'react'

const TermsPanel = () => {
  return (
    <section className="terms-panel">
    <p className="section-label">Terms</p>
    <ul>
      <li>
        <p>Estimated closing date:</p>
        <h3>$250,000.00</h3>
      </li>
      <li>
        <p>Deal lead:</p>
        <h3>Kingsley Advani</h3>
      </li>
      <li>
        <p>Estimated startup costs:</p>
        <h3>$10,000</h3>
      </li>
      <li>
        <p>Total carry:</p>
        <h3>20%</h3>
      </li>
      <li>
        <p>Maximum investment:</p>
        <h3>$100,000.00</h3>
      </li>
    </ul>
  </section>
  )
}

export default TermsPanel;
