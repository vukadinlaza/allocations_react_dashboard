import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import AllPagesPDFViewer from '../../../PDFViewer';
import './styles.scss'




export default function SPVDocumentModal({ setOpen, open, deal, submitInvestment }) {

  console.log(deal.documents)

  const handleClose = () => {
    setOpen(false);
  };

  const document = deal.documents.find((doc) => {
    return doc.path.includes('Agreement');
  });

  console.log(document)

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className='SPVDocumentModal'
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className='paper'>
          <AllPagesPDFViewer document={document} handleClose={handleClose} />
          <div className='buttonContainer'>
            <Button variant="contained" color="secondary" className='button' onClick={submitInvestment}>
              I Agree
            </Button>
            <Button variant="contained" color="secondary" className='button declineBtn' onClick={handleClose}>
              I Decline
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
