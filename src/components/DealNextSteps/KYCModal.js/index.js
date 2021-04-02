import React, { useState, useEffect } from 'react';
import { Modal, Grid, Paper } from '@material-ui/core';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';

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
const optionsAndCallBacks = {
  onSubmit: (formData) => {
    console.log('FORM DATA', formData);
  },
};

const KYCModal = ({ open, setOpen }) => {
  const classes = useStyles();
  return (
    <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal" aria-describedby="modal">
      <Grid container xs={12} justify="center" alignItems="center">
        <Paper className={classes.paper}>
          <CancelPresentationIcon color="black" onClick={() => setOpen(false)} style={{ marginLeft: '100%' }} />

          <div className="dsp-form" />
          {window.DocSpring.createSimpleForm('.dsp-form', 'tpl_dM4QcQbyLckdPXgtyx', optionsAndCallBacks)}
        </Paper>
      </Grid>
    </Modal>
  );
};

export default KYCModal;
