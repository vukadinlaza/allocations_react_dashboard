import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { phone, tablet } from '../../../../utils/helpers';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  container: {
    width: '40%',
    float: 'right',
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    [theme.breakpoints.down(phone)]: {
      width: '100vw',
      paddingRight: '80px',
      float: 'left',
      marginTop: '20px',
    },
    [theme.breakpoints.down(tablet)]: {
      float: 'left',
      width: '75vw',
    },
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
    height: '100%',
    width: '100%',
    border: '1px solid #CBD5E1',
    marginTop: '40px',
    [theme.breakpoints.down(phone)]: {
      height: '10%',
      width: '10%',
      border: '0px solid',
      marginTop: '40px',
      marginRight: '2000px',
    },
    [theme.breakpoints.down(tablet)]: {
      height: '10%',
      width: '10%',
      border: '0px solid',
      marginTop: '40px',
      marginRight: '2000px',
    },
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
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:768px)');

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
    <div style={{ backgroundColor: '', width: '800px' }}>
      <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
        {isMobile ? (
          <Page pageNumber={pageNumber} scale={0.448} className={classes.pdfContainer} />
        ) : isTablet ? (
          <Page pageNumber={pageNumber} scale={1} className={classes.pdfContainer} />
        ) : (
          <Page pageNumber={pageNumber} scale={1.331} className={classes.pdfContainer} />
        )}
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
