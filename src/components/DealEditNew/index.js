import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import './styles.scss'
import BasicInfoSettings from './BasicInfoSettings'
import DeadlineSettings from './DeadlineSettings'
import SPVTermSettings from './SPVTermSettings'
import DealSettings from './DealSettings'

function DealEditNew() {

  const [activeTab, setActiveTab] = useState('basic')

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const getTabClassName = tab => `tab-button ${activeTab === tab && 'active'}`

  const handleContinueClick = () => {
    switch (activeTab) {
      case 'basic':
        return setActiveTab('deadline')
      case 'deadline':
        return setActiveTab('spv')
      case 'spv':
        return setActiveTab('deal')
    }
  }

  const settingsComponentMap = {
    'basic': <BasicInfoSettings />,
    'deadline': <DeadlineSettings />,
    'spv': <SPVTermSettings />,
    'deal': <DealSettings />,
  }

  return (
    <section className="DealEditNew">

      <div className="section-header">
        <h1>Edit Deal</h1>
        <div className="tabs-container">

          <button
            onClick={() => handleTabClick('basic')}
            className={getTabClassName('basic')}
          >
            Basic Info
          </button>

          <button
            onClick={() => handleTabClick('deadline')}
            className={getTabClassName('deadline')}
          >
            Deadlines
          </button>

          <button
            onClick={() => handleTabClick('spv')}
            className={getTabClassName('spv')}
          >
            SPV Terms
          </button>

          <button
            onClick={() => handleTabClick('deal')}
            className={getTabClassName('deal')}
          >
            Deal Settings
          </button>

        </div>
      </div>

      <div className="content">
        {settingsComponentMap[activeTab]}
      </div>

      <div className={`save-changes ${activeTab === 'deal' && 'lastPage'}`}>
        {
          activeTab !== 'deal' && (
            <Button onClick={handleContinueClick} className="continue">
              Continue
            </Button>
          )
        }

        <Button className="save-and-exit">
          Save and Exit
        </Button>

        {
          activeTab === 'deal' && (
            <Button onClick={handleContinueClick} className="delete-deal">
              Delete deal
            </Button>
          )
        }

      </div>

    </section>
  )
}

export default DealEditNew
