import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { pick } from 'lodash';
import CloseIcon from '@material-ui/icons/Close';
import { Paper, Grid, Modal, Container } from '@material-ui/core';
import { toast } from 'react-toastify';
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
    [theme.breakpoints.down('sm')]: {
      maxHeight: '70%',
      overflow: 'scroll',
    },
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

  // created variable so it can be statically checked by useEffect. useEffect dependency doesnt like complex expressions.
const showEntityModalID = showEntityModal?._id;

  useEffect(() => {
    if (showEntityModalID) {
      setEntityData(showEntityModal);
    }
  }, [setEntityData, showEntityModal, showEntityModalID]);

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
        open={Boolean(showEntityModal)}
        onClose={() => {}}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Container maxWidth="sm">
          <Grid container>
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
        </Container>
      </Modal>
    </>
  );
};
