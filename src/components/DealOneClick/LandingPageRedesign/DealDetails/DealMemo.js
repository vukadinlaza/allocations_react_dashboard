import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import { Document, Page } from 'react-pdf';
import samplePDF from './sample.pdf';

const useStyles = makeStyles((theme) =>
  createStyles({
    headerIndicator: {
      width: '5px',
      backgroundColor: theme.palette.primary.main,
      marginRight: '4px',
    },
  }),
);

export default function DealMemo() {
  // const classes = useStyles();
  // const samplePDf = 'https://dochub.com/claudia-mazariegos/Dbd3xkWVe2zyz4mw49AYlz/sample-pdf';
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  //   setPageNumber(1);
  // }
  // const changePage = (offset) => {
  //   setPageNumber((prevPageNumber) => prevPageNumber + offset);
  // };

  return (
    <>
      <Document file={samplePDF}>{/* <Page pageNumber={pageNumber} /> */}</Document>
      {/* <div>
        <p>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </p>
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={() => {
            changePage(-1);
          }}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={pageNumber >= numPages}
          onClick={() => {
            changePage(1);
          }}
        >
          Next
        </button>
      </div> */}
    </>
  );
}
