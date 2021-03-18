import React from 'react'
import { Button } from '@material-ui/core'


function InvestPanel() {
  return (
    <section className="invest-panel">
    <p className="section-label">One click invest</p>
    <ul>
      <li>
        <p>Invested so far:</p>
        <h2>$250,000.00</h2>
      </li>
      <li>
        <p>Minimum Investment:</p>
        <h2>$25,000.00</h2>
      </li>
      <li>
        <p>Days left to invest:</p>
        <h2>39 days</h2>
      </li>

    </ul>
    <Button>Invest</Button>
  </section>
  )
}

export default InvestPanel;
