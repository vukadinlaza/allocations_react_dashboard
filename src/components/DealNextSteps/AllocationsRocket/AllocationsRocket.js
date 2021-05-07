import React from 'react'
import allocationsBarLogo from '../../../assets/allocations_bar_logo.svg'
import './styles.scss'

function AllocationsRocket() {
  return (
    <div className="AllocationsRocket">
      <div className="rocket-body">
        <div className="body"></div>
        <div className="fin fin-left"></div>
        <div className="fin fin-right"></div>
        <div className="window">
          <img className="window-logo" src={allocationsBarLogo} alt="allocations-bar-logo"/>
        </div>
        <div className="fire">
          <div className="flames">
            <div className="flame"></div>
            <div className="flame"></div>
            <div className="flame"></div>
            <div className="flame"></div>
          </div>
        </div>
      </div>
      <ul className="exhaust-fumes">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  )
}

export default AllocationsRocket
