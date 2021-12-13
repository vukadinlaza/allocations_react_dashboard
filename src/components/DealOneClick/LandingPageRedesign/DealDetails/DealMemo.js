import React from 'react';
import PDFDisplay from '../widgets/PDFDisplay';
// import pdf from './revolve.pdf';

function DealMemo() {
  const pdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  return <PDFDisplay pdf={pdf} />;
}
export default DealMemo;
