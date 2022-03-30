import React from 'react';
import { FormControl, TextField, FormLabel } from '@material-ui/core';
import useStyles from './styles';

function DeadlineSettings({ formData, setFormData }) {
  const styles = useStyles();
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
    <section className={styles.deadlineSettings}>
      <h2>Deadlines</h2>

      <div className={styles.formFields}>
        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Signing deadline
            <TextField
              onChange={handleFormChange}
              name="signDeadline"
              value={signDeadline}
              type="datetime-local"
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className={styles.field}>
          <FormLabel className={styles.fieldLabel}>
            Wiring deadline
            <TextField
              onChange={handleFormChange}
              name="wireDeadline"
              value={wireDeadline}
              type="datetime-local"
              className={styles.textInput}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>
      </div>
    </section>
  );
}

export default DeadlineSettings;
