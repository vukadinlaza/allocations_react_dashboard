import React from 'react'
import { Button } from '@material-ui/core'
import './styles.scss'

function InvestPanel({ toggleInvestmentPage, deal }) {

  const handleClick = () => {
    toggleInvestmentPage(open => !open)

    window.scrollTo({
      top: 0,
      left: 100,
      behavior: 'smooth'
    });
  }

  return (
    <section className="InvestPanel">
      <p className="section-label">One click invest</p>
      <ul>
        <li>
          <p>Run rate revenue:</p>
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
      <Button onClick={handleClick}>Invest</Button>
  </section>
  )
}

export default InvestPanel;
