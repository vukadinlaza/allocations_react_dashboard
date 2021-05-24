import React from 'react'
import { FormControl, TextField, Button } from '@material-ui/core';
import './styles.scss'

function PortfolioCompanySettings() {
  return (

    <section className="PortfolioCompanySettings">
      <h2>SPV Terms</h2>

      <div className="form-fields">

        <FormControl className="field">
          <label className="field-label">
            Portfolio management fee
            <div className="management-fee">
              <TextField
                className="fee-input"
                variant="outlined"
              />
              <Button
                className="percentage"
                variant="outlined">
                %
              </Button>
              <Button
                className="fixed"
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
                className="option-button"
                variant="outlined">
                Annual
              </Button>
              <Button
                className="option-button"
                variant="outlined">
                One-time
              </Button>
            </div>
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Portfolio carry fee (%)
            <TextField
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Estimated setup cost
            <div className="management-fee">
              <TextField
                className="fee-input"
                variant="outlined"
              />
              <Button
                className="percentage"
                variant="outlined">
                %
              </Button>
              <Button
                className="fixed"
                variant="outlined">
                $
              </Button>
            </div>
          </label>
        </FormControl>
        
      </div>
    </section>
  )
}

export default PortfolioCompanySettings
