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
    width: '90%',
    position: 'relative',
    margin: '20px 0',
    fontWeight: 'bold',
  },
}));

const SecondSignature = ({
  requireSecondSigChecked,
  setRequireSecondSigChecked,
  setInvestor,
  errors,
  isFromModal = false,
  org,
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
    <>
      {investorType === 'individual' ? (
        <PanelContainer isFromModal={isFromModal}>
          <Grid container wrap="nowrap">
            <Checkbox
              name="secondSigInfo"
              checked={requireSecondSigChecked.secondSigInfo}
              onChange={handleChecked}
              style={{
                marginRight: '-15px',
                borderBottom: '1px solid rgb(232, 232, 232)',
                borderRadius: '5px 5px 0px 0px',
              }}
            />
            <PanelLabel
              label="Please Select if There is a Second Signer"
              isFromModal={isFromModal}
            />
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
                  {org === 'irishangels' ? (
                    <>
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
                          e.target.value = e.target.value.slice(0, 9);
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
                    </>
                  ) : null}
                </Box>
                <Grid container wrap="nowrap" alignItems="center">
                  <Grid item>
                    <Checkbox
                      name="secondSigConsent"
                      checked={requireSecondSigChecked.secondSigConsent}
                      onChange={handleChecked}
                      required
                      style={{ marginLeft: '15px' }}
                    />
                  </Grid>

                  <Grid item lg={12}>
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
      ) : null}
    </>
  );
};

export default SecondSignature;
