import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.scss';
import Loader from '../../../utils/Loader';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



export default function SPVDocumentModal({ setOpen, open, deal, submitInvestment, previewData, loadingPreview }) {

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const spvDoc = (deal.documents || []).find((doc) => {
    return doc.path.includes('Agreement');
  });


  const previewLink = previewData?.getInvestmentPreview?.previewLink;
  const document = previewLink ? previewLink : spvDoc;

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
        timeout: 500
      }}
      >
        <Fade in={open}>
          <div className="document-container">
            <Document
              file={document}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="creating">
                  <Typography variant="h6" style={{ marginBottom: '10%' }}>
                    We are generating your documents...
                  </Typography>
                  <Loader/>
                </div>
              }
              className="document"
              >
              <div className="pages-container">
                { Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1 )
                    .map((page, idx) => <Page
                                          pageNumber={idx + 1}
                                          key={`page-${idx}`}
                                          style={{color: "red"}}
                                          className="page"
                                          renderAnnotationLayer={false}
                                          />
                    )
                }
              </div>
              <div className="actions">
                <div className="link-container">
                  <FontAwesomeIcon icon={['far', 'file-pdf']} style={{marginRight: "0.5em"}}/>
                  <a href={document} target="_blank" rel="noopener noreferrer">
                    Open Agreement in new tab
                  </a>
                </div>
                <div className="buttonContainer">
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    className="button"
                    onClick={submitInvestment}
                    >
                    I Agree
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    className="button declineBtn"
                    onClick={handleClose}
                    >
                    I Decline
                  </Button>
                </div>
              </div>
            </Document>
          </div>
        </Fade>
  </Modal>
  );
}
