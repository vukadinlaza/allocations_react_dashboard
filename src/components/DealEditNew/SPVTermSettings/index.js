import React from 'react'
import { FormControl, TextField, Button } from '@material-ui/core';
import './styles.scss'

function SPVTermSettings() {
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
            Estimated setup cost
            <TextField
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Total carry (%)
            <TextField
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Organizer
            <TextField
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Estimated term
            <TextField
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
                className="option-button"
                variant="outlined">
                Yes
              </Button>
              <Button
                className="option-button"
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
