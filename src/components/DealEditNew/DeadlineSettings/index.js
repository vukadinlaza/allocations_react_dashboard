import React from 'react'
import { FormControl, TextField } from '@material-ui/core';
import './styles.scss'

function DeadlineSettings() {
  return (
    <section className="DeadlineSettings">
      <h2>Deadlines</h2>

      <div className="form-fields">

        <FormControl className="field">
          <label className="field-label">
            Signing deadline
            <TextField
              type="datetime-local"
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="field">
          <label className="field-label">
            Wiring deadline
            <TextField
              type="datetime-local"
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>

      </div>

    </section>
  )
}

export default DeadlineSettings
