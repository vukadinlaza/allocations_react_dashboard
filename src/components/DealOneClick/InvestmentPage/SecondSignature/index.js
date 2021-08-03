import React from 'react';
import { Box, Typography, Checkbox, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PanelContainer, PanelLabel } from '../../../Panel';
import './SecondSignature.scss';

const useStyles = makeStyles(() => ({
  input: {
    left: '20px',
    padding: '5px',
    width: '90%',
    marginTop: '20px',
  },
  footNote: {
    fontSize: '12px',
    color: '#757575',
    left: '20px',
    width: '90%',
    position: 'relative',
    margin: '20px 0',
    fontWeight: 'bold',
  },
  headerLabel: {
    padding: '15px',
    margin: 0,
    width: '100%',
    fontSize: '1rem',
    paddingLeft: 0,
  },
}));

const SecondSignature = ({
  requireSecondSigChecked,
  setRequireSecondSigChecked,
  setInvestor,
  errors,
}) => {
  const classes = useStyles();

  const handleChecked = (e) => {
    if (e) e.persist();

    setRequireSecondSigChecked((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.checked,
      };
    });

    setInvestor((prev) => {
      return {
        ...prev,
        secondInvestor: {
          ...prev.secondInvestor,
        },
      };
    });

    if (e.target.name === 'secondSigInfo' && !e.target.checked) {
      setRequireSecondSigChecked((prev) => ({
        ...prev,
        secondSigConsent: e.target.checked,
      }));

      return setInvestor((prev) => {
        delete prev.secondInvestor;
        return {
          ...prev,
        };
      });
    }

    if (e.target.name === 'secondSigConsent') {
      return setInvestor((prev) => ({
        ...prev,
        secondInvestor: {
          ...prev.secondInvestor,
          [e.target.name]: e.target.checked,
        },
      }));
    }
  };

  const handleChange = (prop) => (e) => {
    if (e) {
      e.persist();
    }

    return setInvestor((prev) => ({
      ...prev,
      [prop]: {
        ...prev[prop],
        [e.target.name]: e.target.value,
      },
    }));
  };

  return (
    <PanelContainer>
      <Grid container alignItems="center" wrap="nowrap" className={classes.header}>
        <Grid item xs={12} sm={12} lg={12} style={{ display: 'flex', padding: '0 15px' }}>
          <Checkbox
            name="secondSigInfo"
            checked={requireSecondSigChecked.secondSigInfo}
            onChange={handleChecked}
          />
          <Typography className={classes.headerLabel} component="p">
            Please select if there is a second signer
          </Typography>
        </Grid>
      </Grid>

      {requireSecondSigChecked.secondSigInfo && (
        <Grid container wrap="nowrap" direction="column">
          <Grid item>
            <Box component="form" noValidate>
              <TextField
                variant="outlined"
                label="Legal Name"
                name="secondLegalName"
                required={requireSecondSigChecked.secondSigInfo}
                onChange={handleChange('secondInvestor')}
                error={errors.includes('secondLegalName')}
                className={classes.input}
              />
              <TextField
                variant="outlined"
                label="Email"
                name="secondEmail"
                required={requireSecondSigChecked.secondSigInfo}
                onChange={handleChange('secondInvestor')}
                error={errors.includes('secondEmail')}
                className={classes.input}
              />
              <TextField
                variant="outlined"
                label="Social Security Number"
                name="secondSignerSSN"
                required={requireSecondSigChecked.secondSigInfo}
                onChange={handleChange('secondInvestor')}
                error={errors.includes('secondSignerSSN')}
                className={`${classes.input} numbers`}
                type="number"
                onInput={(e) => {
                  e.target.value = Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 9);
                }}
              />
              <TextField
                variant="outlined"
                label="Initials"
                name="secondSignerInitials"
                required={requireSecondSigChecked.secondSigInfo}
                onChange={handleChange('secondInvestor')}
                error={errors.includes('secondSignerInitials')}
                className={classes.input}
              />
            </Box>
            <Grid container wrap="nowrap" alignItems="center" style={{ padding: '0 10px 0 15px' }}>
              <Grid item lg={12} style={{ display: 'flex' }}>
                <Checkbox
                  style={{ paddingRight: '0' }}
                  name="secondSigConsent"
                  checked={requireSecondSigChecked.secondSigConsent}
                  onChange={handleChecked}
                  required
                />
                <Typography component="p" className={classes.footNote}>
                  I confirm, as the second signer, that I am present and the information I have
                  provided above is accurate.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </PanelContainer>
  );
};

export default SecondSignature;
