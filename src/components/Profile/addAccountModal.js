import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import CloseIcon from '@material-ui/icons/Close';
import { useMutation } from '@apollo/react-hooks';
import { Paper, Grid, Typography, Modal, TextField, Button, Container } from '@material-ui/core';
import { toast } from 'react-toastify';
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
  const [sendAccountInvite, {}] = useMutation(SEND_ADMIN_INVITE, {
    variables: { payload: {} },
  });
  const handleChange = (prop) => (e) => {
    e.persist();
    return setData((prev) => ({ ...prev, [prop]: e.target.value }));
  };
  const handleClose = () => {
    setAddAccountModal(false);
    toast.success('Success! Email sent');
  };
  const handleSubmit = () => {
    sendAccountInvite({
      variables: { payload: userData },
      onComplete: handleClose(),
    });
  };
  return (
    <>
      <Modal
        open={Boolean(showAddAccountModal)}
        onClose={() => {}}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Container maxWidth="sm">
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Paper className={classes.modalPaper}>
                <Grid
                  onClick={() => setAddAccountModal(false)}
                  style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <Typography variant="h6">Add New User</Typography>
                  <CloseIcon />
                </Grid>
                <Typography variant="subtitle2" style={{ marginTop: '.5rem', marginBottom: '1rem' }}>
                  To add a user to your account, enter their email and click the send invite button. Tell them to check
                  their email!
                </Typography>
                <form className={classes.root} noValidate autoComplete="off">
                  <Grid style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                    <TextField
                      id="standard-basic"
                      label="Email"
                      className={classes.textInput}
                      onChange={handleChange('newUserEmail')}
                    />
                    <Button color="primary" variant="contained" onClick={handleSubmit}>
                      Send Invite
                    </Button>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Modal>
    </>
  );
};
