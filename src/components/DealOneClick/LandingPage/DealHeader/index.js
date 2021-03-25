import React from 'react'
import './DealHeader.scss'

function DealHeader({ deal }) {

  const {
    company_name,
    company_description
  } = deal


  return (
    <section className="DealHeader">
      <h1 className="deal-title">{company_name}</h1>
      <h3 className="deal-description">{company_description}</h3>
      <div className="image-wrapper"/>
    </section>
  )
}

export default DealHeader
