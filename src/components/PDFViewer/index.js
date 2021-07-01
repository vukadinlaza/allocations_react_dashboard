import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CloseIcon from '@material-ui/icons/Close';

import './index.scss';

function AllPagesPDFViewer({ document, handleClose, usePreview }) {
  const { link } = document;

  if (!link) {
    return (
      <div className="wire" style={{ padding: '20px' }}>
        Contact For Wire Details
      </div>
    );
  }

  const url = usePreview ? link : `https://${link}`;
  return (
    <section className="root-container-spv-viewer">
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <div />
        <div>
          <FontAwesomeIcon icon={['far', 'file-pdf']} />
          <a href={url} target="_blank" rel="noopener noreferrer">
            {' '}
            Open Agreement in new tab
          </a>
        </div>
        <CloseIcon className="closed-icon" onClick={handleClose} />
      </div>
      <div className="embed-responsive embed-responsive-1by1">
        <iframe className="embed-responsive-item iframe-spv-agreement" title="SPV Document" src={url} />
      </div>
    </section>
  );
}

export default AllPagesPDFViewer;
