import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

pdfjs.GlobalWorkerOptions.workerSrc = `${props}/pdf.worker.js`;

function PDFDisplay(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  console.log(typeof numPages, typeof pageNumber, 'numPages');

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log(typeof numPages, 'PAGE NUMBER on load');

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

  const { pdf } = props;
  return (
    <>
      {/* <Document
        file={pdf}
        // options={{ workerSrc: './sample.pdf' }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document> */}

      <Document
        file={{
          url: { pdf },
        }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
          &lt;
        </button>
        <span>
          {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </span>
        <button type="button" disabled={pageNumber >= numPages} onClick={nextPage}>
          &gt;
        </button>
      </div>
    </>
  );
}
export default PDFDisplay;
