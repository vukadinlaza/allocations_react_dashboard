import React from 'react'
import './styles.scss'

function CoinvestorsPanel({ coinvestors, deal }) {

  const {
    company_name
  } = deal

  const coinvestorItems = (coinvestors || []).map(item => {
    return (
      <li>{item}</li>
    )
  })

  return (
    <section className="CoinvestorsPanel">
      <p className="section-label">Coinvestors</p>
      <ul>
        { coinvestorItems.length > 0
          ? coinvestorItems
          : <li>There are currently no coinvestors listed for <b>{company_name}</b>.</li>
        }
      </ul>
    </section>
  )
}

export default CoinvestorsPanel
