import React from 'react'
import './styles.scss'

const TermsPanel = ({ deal }) => {

  console.log(deal)
  return (
    <section className="TermsPanel">
    <p className="section-label">Terms</p>
    <ul>
      <li>
        <p>Deal lead:</p>
        <h3>Kingsley Advani</h3>
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
