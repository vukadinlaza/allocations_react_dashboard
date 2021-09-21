import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography, Switch, FormGroup, FormControlLabel } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

const DISPLAY_USERNAME_STATUS = gql`
  mutation DisplayUsernameStatus($email: String!, $display_username: Boolean) {
    displayUsernameStatus(email: $email, display_username: $display_username) {
      _id
      display_username
      email
    }
  }
`;

const DisplayUsername = ({ investor }) => {
  const [checked, setChecked] = useState(investor.display_username || false);
  const [displayUsernameStatus] = useMutation(DISPLAY_USERNAME_STATUS);

  const handleUsernameStatus = (e) => {
    e.persist();
    setChecked((prev) => !prev);
    displayUsernameStatus({
      variables: { email: investor.email, display_username: e.target.checked },
    });
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={6} style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
        <Typography style={{ fontWeight: 'bold' }}>Display username on public pages:</Typography>
      </Grid>
      <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
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
