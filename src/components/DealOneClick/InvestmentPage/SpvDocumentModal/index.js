import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import AllPagesPDFViewer from '../../../PDFViewer';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    marginTop: '5vh',
    alignItems: 'start',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: '.75rem',
    minWidth: '40%',
    borderRadius: '.5rem',
  },
  buttonContainer: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  declineBtn: {
    background: 'grey',
    marginLeft: '30%',
  },
}));

export default function SPVDocumentModal({ setOpen, open, deal, submitInvestment }) {
  const classes = useStyles();

  console.log(deal.documents)

  const handleClose = () => {
    setOpen(false);
  };

  const document = deal.documents.find((doc) => {
    return doc.path.includes('Agreement');
  });

  console.log('doc', document)

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <AllPagesPDFViewer document={document} handleClose={handleClose} />
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="secondary" onClick={submitInvestment}>
              I Agree
            </Button>
            <Button variant="contained" color="secondary" className={classes.declineBtn} onClick={handleClose}>
              I Decline
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
