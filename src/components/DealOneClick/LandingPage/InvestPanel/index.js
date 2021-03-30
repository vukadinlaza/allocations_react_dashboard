import React from 'react'
import { Button } from '@material-ui/core'
import './styles.scss'
import moment from 'moment'

function InvestPanel({ toggleInvestmentPage, deal }) {

  const handleClick = () => {
    toggleInvestmentPage(open => !open)

    window.scrollTo({
      top: 0,
      left: 100,
      behavior: 'smooth'
    });
  }

  const {
    dealParams: { wireDeadline, signDeadline }
  } = deal;

  const getDeadline = (date) => {
    return moment(date).format("MMMM Do YYYY, h:mma") + ' PST' // February 21st 1997, 3:25:50 pm
  }
  //if no signing deadline but wire dealine, set signing as wire, if neither null state
  return (
    <section className="InvestPanel">
      <p className="section-label">One click invest</p>
      <ul>
        <li>
          <p>Signing deadline:</p>
          <h2>
            {
              signDeadline ?
                getDeadline(signDeadline) :
                wireDeadline ?
                  getDeadline(wireDeadline)
                  : 'No signing deadline has been set.'
            }
          </h2>
        </li>
        <li>
          <p>Wire deadline:</p>
          <h2>
            {
              wireDeadline ?
                getDeadline(wireDeadline) :
                signDeadline ?
                  getDeadline(signDeadline)
                  : 'No wire deadline has been set.'
            }
          </h2>
        </li>
      </ul>
      <Button onClick={handleClick}>Invest</Button>
    </section>
  )
}

export default InvestPanel;
