import React from 'react';
import { FormControl, TextField } from '@material-ui/core';
import './styles.scss';

function DeadlineSettings({ formData, setFormData }) {
  const {
    dealParams: { signDeadline, wireDeadline },
  } = formData;

  const handleFormChange = ({ target }) => {
    setFormData((prevData) => ({
      ...prevData,
      dealParams: {
        ...prevData.dealParams,
        [target.name]: target.value,
      },
    }));
  };

  return (
    <section className="DeadlineSettings">
      <h2>Deadlines</h2>

      <div className="form-fields">
        <FormControl className="field">
          <label className="field-label">
            Signing deadline
            <TextField
              onChange={handleFormChange}
              name="signDeadline"
              value={signDeadline}
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
              onChange={handleFormChange}
              name="wireDeadline"
              value={wireDeadline}
              type="datetime-local"
              className="text-input"
              variant="outlined"
            />
          </label>
        </FormControl>
      </div>
    </section>
  );
}

export default DeadlineSettings;