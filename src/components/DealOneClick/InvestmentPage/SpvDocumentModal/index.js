import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AllPagesPDFViewer from '../../../PDFViewer';
import './styles.scss';
import Loader from '../../../utils/Loader';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function SPVDocumentModal({ setOpen, open, deal, submitInvestment, previewData, loadingPreview }) {

  const [numPages, setNumPages] = useState(null);
  const [inputNumber, setInputNumber] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const spvDoc = (deal.documents || []).find((doc) => {
    return doc.path.includes('Agreement');
  });

  function previousPage() {
    let newPage = pageNumber - 1;
    if(pageNumber === 1) return
    setPageNumber(newPage);
    setInputNumber(newPage);
  }

  function nextPage() {
    let newPage = pageNumber + 1
    if(pageNumber === numPages) return
    setPageNumber(newPage);
    setInputNumber(newPage);
  }

  function enterPage(e) {
    let newPage = Number(e.target.value)
    const nan = isNaN(parseFloat(newPage))
    if(newPage < 1){
      setInputNumber(newPage)
      return
    }else if(newPage > numPages || nan){
      return
    }
    setPageNumber(newPage)
    setInputNumber(newPage)
  }

  const previewLink = previewData?.getInvestmentPreview?.previewLink;
  const document = previewLink ? previewLink : spvDoc;
  const pageInputLength = pageNumber?.toString().length * 8

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
        style: {background: "none"}
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
              <div className="top-controls">
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
                    className="button declineBtn"
                    onClick={handleClose}
                    >
                    I Decline
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    className="button"
                    onClick={submitInvestment}
                    >
                    I Agree
                  </Button>
                </div>
              </div>
              <Page
                pageNumber={pageNumber}
                className="page"
                renderAnnotationLayer={false}
                />
              <div className="controls">
                <button onClick={previousPage}>{`<`}</button>
                <span>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    value={inputNumber}
                    onChange={enterPage}
                    style={{width: `${pageInputLength + 32}px`}}
                    />
                  {` of ${numPages}`}
                </span>
                <button onClick={nextPage}>{`>`}</button>
              </div>
            </Document>
          </div>
        </Fade>
  </Modal>
  );
}
