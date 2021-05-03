import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.scss';

function WireInstructions({ deal }) {
  const link =
    deal.documents && (deal.documents || []).find((d) => d.path === 'wire-instructions')
      ? `https://${deal.documents.find((d) => d.path === 'wire-instructions').link}`
      : null;

  if (!link) {
    return (
      <div className="wire" style={{ padding: '20px' }}>
        Contact For Wire Details
      </div>
    );
  }

  const onDocumentLoadSuccess = () => {
    console.log('loaded doc');
  };

  return (
    <section className="WireInstructions">
      <div className="wire-doc-iframe">
        <div className="embed-responsive embed-responsive-1by1">
          <iframe className="embed-responsive-item" title="Onboarding Document" src={link} />
        </div>
      </div>
      <div className="wire-link">
        <div style={{ marginBottom: '15px' }}>
          <FontAwesomeIcon icon={['far', 'file-pdf']} />
          <a href={link} target="_blank" rel="noopener noreferrer">
            {' '}
            Open in new tab
          </a>
        </div>
      </div>
      <p className="wire-warning">Please ensure to wire from the same entity you have signed from.</p>
    </section>
  );
}

export default WireInstructions;
