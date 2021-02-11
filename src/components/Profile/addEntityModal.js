import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { camelCase } from 'lodash';
import { gql } from 'apollo-boost';
import CloseIcon from '@material-ui/icons/Close';
import { useMutation } from '@apollo/react-hooks';

import {
  Paper,
  Grid,
  Typography,
  Modal,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import countries from 'country-region-data';
import { UsaStates } from 'usa-states';
import { nWithCommas } from '../../utils/numbers';
import EntityEditForm from './EntityEdit/index';

import './style.scss';
import { useSimpleReducer } from '../../utils/hooks';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '8vh',
    borderRadius: '1rem',
    padding: theme.spacing(2),
    maxHeight: '70%',
    overflow: 'scroll',
  },
  header: {
    fontSize: '1.5rem',
  },
  subHeader: {
    fontSize: '1.2rem',
  },
  textInput: {
    minWidth: '100%',
  },
}));

const entityInfo = {
  'Dropdown 641a3b0c-3d28-4670-8a6e-d22eddc230e9': 'entity type',
  MemberName: 'Name of Entity or individual',
  SubAmount: 'subscription amount',
  CountryResIndividual: 'Country of residence if individual',
  PlaceBusinessEntity: 'Place Of business if Entity',
  AccreditedIndividual: 'Net worth individual',
  AccreditedEntity: 'Net Worth Entity',
  'Email 23b66ce4-6d37-43f8-b44d-733d3d5b292f': 'user email',
  'Name 4a0d1cec-823e-4580-94a0-75605f445380': 'User full name',
};

export default ({ showEntityModal, setShowEntityModal, accountId, refetchAccountEntities, createEntity }) => {
  const classes = useStyles();
  const [entityData, setEntityData] = useSimpleReducer({ accountId });
  const [formStatus, setFormStatus] = useState('edit');

  const icon = formStatus === 'loading' ? 'circle-notch' : formStatus === 'complete' ? 'check' : null;
  const submit = () => {
    return createEntity({
      variables: { payload: entityData },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: refetchAccountEntities(),
    });
  };

  return (
    <>
      <Modal
        open={showEntityModal}
        onClose={() => {}}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid container xs={12} sm={12} md={4} lg={5}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper className={classes.modalPaper}>
              <Typography>Add A New Entity</Typography>
              <Grid
                onClick={() => setShowEntityModal(false)}
                style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}
              >
                <CloseIcon />
              </Grid>
              <EntityEditForm
                investor={entityData}
                icon={icon}
                setInvestor={setEntityData}
                setFormStatus={setFormStatus}
                actionText="Save Entity"
                submitfn={submit}
              />
              {/* <form className={classes.root} noValidate autoComplete="off">
                <Grid
                  container
                  xs={12}
                  sm={12}
                  md={12}
                  spacing={3}
                  style={{ display: 'flex', justifyContent: 'space-btween' }}
                >
                  <Grid item xs={6} sm={6} md={6}>
                    <FormControl
                      required
                      //   error={errors.includes('investor_type')}
                      variant="outlined"
                      style={{ width: '100%' }}
                    >
                      <InputLabel>Investor Type</InputLabel>
                      <Select
                        value={entityData.investor_type || ''}
                        onChange={handleChange('investor_type')}
                        inputProps={{ name: 'Type' }}
                      >
                        <MenuItem value="" />
                        <MenuItem value="individual">Individual</MenuItem>
                        <MenuItem value="entity">Entity</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <TextField
                      id="standard-basic"
                      label="Entity name"
                      className={classes.textInput}
                      variant="outlined"
                      onChange={handleChange('MemberName')}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <FormControl
                      required
                      //   error={errors.includes('country')}
                      variant="outlined"
                      style={{ width: '100%' }}
                    >
                      <InputLabel>Country of Residence</InputLabel>
                      <Select
                        value={entityData[entityResidence] || ''}
                        onChange={handleChange(entityResidence)}
                        inputProps={{ name: entityResidence }}
                      >
                        <MenuItem value="" />
                        {[{ countryName: 'United States' }, ...countries].map(({ countryName }) => (
                          <MenuItem key={countryName} value={countryName}>
                            {countryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {((entityData.individualCountry === 'United States' && entityData.investor_type === 'individual') ||
                    (entityData.entityCountry === 'United States' && entityData.investor_type === 'entity')) && (
                    <Grid item xs={6} sm={6} md={6}>
                      <FormControl
                        required
                        //   error={errors.includes('country')}
                        variant="outlined"
                        style={{ width: '100%' }}
                      >
                        <InputLabel>State</InputLabel>
                        <Select
                          value={entityData.entityState || ''}
                          onChange={handleChange('entityState')}
                          inputProps={{ name: 'entityState' }}
                        >
                          <MenuItem value="" />
                          {usStates.states.map(({ name }) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item xs={6} sm={6} md={6}>
                    <AccreditedInvestorStatus investor={entityData} handleChange={handleChange} errors={[]} />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <TextField
                      id="standard-basic"
                      label="Email"
                      className={classes.textInput}
                      variant="outlined"
                      onChange={handleChange('Email')}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <TextField
                      id="standard-basic"
                      label="Signer Full Name"
                      className={classes.textInput}
                      variant="outlined"
                      onChange={handleChange('signer_full_name')}
                    />
                  </Grid>
                </Grid>
                <Button color="primary" variant="contained" onClick={handleSubmit} style={{ margin: '1rem' }}>
                  Add new
                </Button>
              </form> */}
            </Paper>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
