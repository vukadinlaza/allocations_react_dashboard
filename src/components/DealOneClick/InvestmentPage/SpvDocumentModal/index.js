import React from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Grid, Typography } from '@material-ui/core';
import AllPagesPDFViewer from '../../../PDFViewer';
import Loader from '../../../utils/Loader';
import './styles.scss';

export default function SPVDocumentModal({
  setOpen,
  open,
  deal,
  loading,
  submitInvestment,
  previewData,
  loadingPreview,
  requireSecondSigChecked,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const spvDoc = (deal.documents || []).find((doc) => {
    return doc.path.includes('Agreement');
  });

  const previewLink = previewData?.getInvestmentPreview?.previewLink;
  const document = previewLink ? { link: previewLink } : spvDoc;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className="SPVDocumentModal"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className="paper">
          {loadingPreview ? (
            <Grid
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10%',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h4" style={{ marginBottom: '10%' }}>
                We are generating your documents.
              </Typography>
              <Loader />
            </Grid>
          ) : (
            <>
              <AllPagesPDFViewer
                document={document}
                usePreview={!!previewLink}
                handleClose={handleClose}
              />
              <div className="buttonContainer">
                <Button
                  variant="contained"
                  color="secondary"
                  className="button"
                  onClick={submitInvestment}
                  disabled={loading}
                >
                  {requireSecondSigChecked ? 'We' : 'I'} Agree
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className="button declineBtn"
                  onClick={handleClose}
                  disabled={loading}
                >
                  {requireSecondSigChecked ? 'We' : 'I'} Decline
                </Button>
              </div>
            </>
          )}
        </div>
      </Fade>
    </Modal>
  );
}
