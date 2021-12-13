import React from 'react';
import PDFDisplay from '../widgets/PDFDisplay';
import pdf from './sampleLandscape.pdf';

function PitchDeck() {
  return <PDFDisplay pdf={pdf} />;
}
export default PitchDeck;
