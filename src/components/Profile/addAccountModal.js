import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { camelCase } from 'lodash';
import { gql } from 'apollo-boost';
import CloseIcon from '@material-ui/icons/Close';
import { useMutation } from '@apollo/react-hooks';
import { Paper, Grid, Typography, Modal, TextField, Button } from '@material-ui/core';
import { nWithCommas } from '../../utils/numbers';
import './style.scss';

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
    minWidth: '75%',
  },
}));
const SEND_ADMIN_INVITE = gql`
  mutation sendAccountInvite($payload: Object) {
    sendAccountInvite(payload: $payload)
  }
`;

export default ({ showAddAccountModal, setAddAccountModal }) => {
  const classes = useStyles();
  const [userData, setData] = useState({});
  const [sendAccountInvite, { data }] = useMutation(SEND_ADMIN_INVITE, {
    variables: { payload: {} },
  });
  const handleChange = (prop) => (e) => {
    e.persist();
    console.log(prop);
    return setData((prev) => ({ ...prev, [prop]: e.target.value }));
  };
  const handleSubmit = () => {
    sendAccountInvite({ variables: { payload: userData }, onComplete: setAddAccountModal(false) });
  };
  return (
    <>
      <Modal
        open={showAddAccountModal}
        onClose={() => {}}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid container xs={12} sm={12} md={4} lg={5}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper className={classes.modalPaper}>
              <Grid
                onClick={() => setAddAccountModal(false)}
                style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}
              >
                <CloseIcon />
              </Grid>
              <form className={classes.root} noValidate autoComplete="off">
                <Grid style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                  <TextField
                    id="standard-basic"
                    label="Email"
                    className={classes.textInput}
                    onChange={handleChange('newUserEmail')}
                  />
                  <Button color="primary" variant="contained" onClick={handleSubmit}>
                    Add new
                  </Button>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
