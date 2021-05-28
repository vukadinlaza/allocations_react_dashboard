import React, { useState } from 'react'
import { FormControl, TextField, Button } from '@material-ui/core';
import './styles.scss'

function SPVTermSettings({ formData, setFormData, differentSPVTerms, toggleDifferentSPVTerms }) {

  const {
    dealParams: {
      managementFees,
      managementFeeType,
      estimatedTerm,
      totalCarry,
      estimatedSetupCosts,
    },
    deal_lead
  } = formData;

  const handleFormChange = ({ target }) => {
    const dealParamFields = ['managementFees', 'managementFeeType', 'estimatedTerm', 'totalCarry', 'estimatedSetupCosts']

    if (dealParamFields.includes(target.name)) {
      return setFormData(prevData => ({
        ...prevData,
        dealParams: {
          ...prevData.dealParams,
          [target.name]: target.value
        }
      }))
    }

    return setFormData(prevData => ({
      ...prevData,
      [target.name]: target.value
    }))
  }

  const handleManagementFeeChange = () => {

  }

  return (
    <section className="SPVTermSettings">
      <h2>SPV Terms</h2>

      <div className="form-fields">

        <FormControl className="field">
          <label className="field-label">
            Management fee
            <div className="management-fee">
              <TextField
                className="fee-input"
                name="managementFees"
                variant="outlined"
                onChange={handleFormChange}
                value={managementFees}
              />
              <Button
                onClick={() => handleManagementFeeChange({})}
                className={`percentage ${managementFeeType === '%' && 'selected'}`}
                name='managementFeeType'
                variant="outlined">
                %
              </Button>
              <Button
                onClick={() => handleManagementFeeChange({})}
                className={`fixed ${managementFeeType === '$' && 'selected'}`}
                name='managementFeeType'
                variant="outlined">
                $
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Fee type
            <div className="button-options">
              <Button
                onClick={() => { }}
                className="option-button"
                variant="outlined">
                Annual
              </Button>
              <Button
                onClick={() => { }}
                className="option-button"
                variant="outlined">
                One-time
              </Button>
            </div>
          </label>
        </FormControl>

        {/* TODO: estimatedSetupCosts || estimatedSetupCostsDollar */}
        <FormControl className="field">
          <label className="field-label">
            Estimated setup cost
            <TextField
              className="text-input"
              variant="outlined"
              value={estimatedSetupCosts || ''}
              name="estimatedSetupCosts"
              onChange={handleFormChange}
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Total carry (%)
            <TextField
              value={totalCarry || ''}
              name="totalCarry"
              onChange={handleFormChange}
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        {/* TODO: deal_lead or organizer? */}
        <FormControl className="field">
          <label className="field-label">
            Organizer
            <TextField
              value={deal_lead || ''}
              onChange={handleFormChange}
              name='deal_lead'
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Estimated term
            <TextField
              value={estimatedTerm || ''}
              name='estimatedTerm'
              onChange={handleFormChange}
              className="text-input"
              variant="outlined"
              placeholder="10 years"
            />
          </label>
        </FormControl>

        <FormControl className="wide-field">
          <label className="field-label">
            Does your portfolio company have different terms than your SPV? (SPV into an SPV)
            <div className="button-options">
              <Button
                onClick={() => toggleDifferentSPVTerms(prevState => !prevState)}
                className={`option-button ${differentSPVTerms && 'selected'}`}
                variant="outlined">
                Yes
              </Button>
              <Button
                onClick={() => toggleDifferentSPVTerms(prevState => !prevState)}
                className={`option-button ${!differentSPVTerms && 'selected'}`}
                variant="outlined">
                No
              </Button>
            </div>
          </label>
        </FormControl>

      </div>

    </section>
  )
}

export default SPVTermSettings
