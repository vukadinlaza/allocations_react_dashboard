import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { camelCase, pick } from 'lodash';
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
import { toast } from 'react-toastify';
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

const INITIAL_STATE = {
  _id: '',
  investor_type: '',
  country: '',
  first_name: '',
  last_name: '',
  entity_name: '',
  signer_full_name: '',
  email: '',
  accredited_investor_status: '',
};

export default ({
  showEntityModal,
  setShowEntityModal,
  accountId,
  refetchAccountEntities,
  createEntity,
  updateEntity,
  deleteEntity,
}) => {
  const classes = useStyles();
  const [entityData, setEntityData] = useSimpleReducer({ accountId });
  const [formStatus, setFormStatus] = useState('edit');

  useEffect(() => {
    if (showEntityModal?._id) {
      setEntityData(showEntityModal);
    }
  }, [setEntityData, showEntityModal, showEntityModal?._id]);

  const icon = formStatus === 'loading' ? 'circle-notch' : formStatus === 'complete' ? 'check' : null;
  const isEdit = showEntityModal?._id;

  const handleClose = (isEdit) => {
    refetchAccountEntities();
    toast.success(`Success!`);
    setShowEntityModal(false);
    setEntityData({ ...INITIAL_STATE, accountId });
  };
  const submit = () => {
    const payload = pick(entityData, [
      'investor_type',
      'country',
      'first_name',
      'last_name',
      'entity_name',
      'signer_full_name',
      'email',
      'accredited_investor_status',
    ]);
    const fn = isEdit ? updateEntity : createEntity;
    if (isEdit) {
      payload._id = isEdit;
    } else {
      payload.accountId = accountId;
    }
    return fn({
      variables: { payload },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: handleClose(isEdit),
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
              <Grid style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
                <CloseIcon
                  onClick={() => {
                    setEntityData({ ...INITIAL_STATE, accountId });
                    setShowEntityModal(false);
                  }}
                />
              </Grid>
              <EntityEditForm
                investor={entityData}
                icon={icon}
                setInvestor={setEntityData}
                setFormStatus={setFormStatus}
                actionText="Save Entity"
                submitfn={submit}
                deleteEntity={deleteEntity}
                isEdit={isEdit}
                handleClose={handleClose}
              />
            </Paper>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
