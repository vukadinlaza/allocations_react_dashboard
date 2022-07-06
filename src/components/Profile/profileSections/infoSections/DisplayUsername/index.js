import React, { useState } from 'react';
import { Grid, Typography, Switch, FormGroup, FormControlLabel } from '@material-ui/core';

const DisplayUsername = ({ investor, handleChange }) => {
  const [checked, setChecked] = useState(investor.display_username || false);

  const handleUsernameStatus = (e) => {
    setChecked((prev) => !prev);
    handleChange('display_username')({ target: { value: e.target.checked } });
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item style={{ paddingLeft: '20px' }}>
        <Typography style={{ fontWeight: 'bold' }}>Display username on public pages:</Typography>
      </Grid>
      <Grid item>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                size="medium"
                checked={checked}
                onChange={handleUsernameStatus}
              />
            }
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default DisplayUsername;
