import React, { useState, useEffect } from 'react';
import { Modal, Grid, Paper, Typography } from '@material-ui/core';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify';

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
const UPDATE_USER = gql`
  mutation UpdateUser($investor: UserInput!) {
    updateUser(input: $investor) {
      _id
    }
  }
`;

const KYCModal = ({ open, setOpen, kycTemplateId, kycTemplateName, investor, refetch }) => {
  const classes = useStyles();
  const [updateInvestor] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      console.log('REFETCH FIRES');
      refetch();
      setOpen(false);
      toast.success('Sucess! Tax form completed');
    },
  });

  const optionsAndCallBacks = {
    onSubmit: (formData) => {
      const payload = {
        _id: investor._id,
        kycDoc: {
          kycTemplateId,
          documentName: kycTemplateName,
        },
      };
      updateInvestor({
        variables: { investor: payload },
      });
    },
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal" aria-describedby="modal">
      <Grid container justify="center" alignItems="center">
        <Paper className={classes.paper}>
          <CancelPresentationIcon color="black" onClick={() => setOpen(false)} style={{ marginLeft: '100%' }} />
          <Typography variant="h5">{kycTemplateName}</Typography>
          <div className="dsp-form" />
          {window.DocSpring.createSimpleForm('.dsp-form', kycTemplateId, optionsAndCallBacks)}
        </Paper>
      </Grid>
    </Modal>
  );
};

export default KYCModal;
