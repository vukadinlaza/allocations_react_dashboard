import React from 'react';
import { Modal, Grid, Paper } from '@material-ui/core';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 800,
    border: '1px solid #000',
    backgroundColor: '#f9fbfb',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    marginTop: '3vh',
    maxHeight: '95vh',
    overflow: 'scroll',
  },
  button: {
    backgroundColor: '#00A0C6',
    align: 'center',
    marginTop: '1rem',
  },
  header: {
    align: 'center',
  },
  subtext: {
    marginBottom: '.5rem',
  },
}));

const FormModal = ({ open, setOpen, form }) => {
  const classes = useStyles();
  return (
    <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal" aria-describedby="modal">
      <Grid container xs={12} justify="center" alignItems="center">
        <Paper className={classes.paper}>
          <CancelPresentationIcon color="black" onClick={() => setOpen(false)} style={{ marginLeft: '100%' }} />

          {form}
        </Paper>
      </Grid>
    </Modal>
  );
};

export default FormModal;
