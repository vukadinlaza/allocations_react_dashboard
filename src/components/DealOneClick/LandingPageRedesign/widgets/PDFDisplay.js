import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { makeStyles } from '@material-ui/core/styles';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles(() => ({
  container: {
    width: '40%',
    float: 'right',
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
  },
  arrowLeft: {
    border: '1px solid #CBD5E1',
    borderRadius: '8px 0px 0px 8px',
    padding: '10px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'center',
    color: '#64748B',
  },
  arrowRight: {
    border: '1px solid #CBD5E1',
    borderRadius: '0px 8px 8px 0px',
    padding: '10px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'center',
    color: '#64748B',
  },
  numberContainer: {
    border: '1px solid #CBD5E1',
    borderRadius: '0px',
    padding: '10px 24px',
  },
  pdfContainer: {
    border: '1px solid #CBD5E1',
    padding: '10px 24px',
    marginTop: '40px',
    marginRight: '70px',
    marginLeft: '70px',
  },
  numbers: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'center',
    color: '#64748B',
    margin: '10px 0px',
    padding: '12px 0px',
  },
}));

function PDFDisplay({ pdf }) {
  const classes = useStyles();
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  return (
    <div>
      <Document file={pdf} className={classes.pdfContainer} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>

      <div className={classes.container}>
        <button
          type="button"
          className={classes.arrowLeft}
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          &lt;
        </button>
        <span className={classes.numberContainer}>
          <span className={classes.numbers}>
            {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
          </span>
        </span>
        <button
          type="button"
          className={classes.arrowRight}
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
export default PDFDisplay;
