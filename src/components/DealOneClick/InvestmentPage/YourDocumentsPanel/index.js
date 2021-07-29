import React from 'react';
import { Button } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import './styles.scss';

function YourDocumentsPanel({ investment }) {
  if (!investment) {
    return null;
  }

  const { documents } = investment;

  const signedDocuments = (documents || []).map((doc, i) => {
    const file =
      doc?.path.slice(0, 12) === 'investments/' ? doc.path.split('/')[2] : doc.path.split('/')[1];

    return (
      <a key={i} href={`https://${doc.link}`} target="_blank" rel="noreferrer">
        <Button>
          <InsertDriveFileIcon />
          {file}
        </Button>
      </a>
    );
  });
  return (
    <section className="DealDocumentsPanel">
      <p className="section-label">My Signed Documents</p>
      {signedDocuments.length > 0 ? (
        signedDocuments
      ) : (
        <p className="no-docs">You do not have any signed documents.</p>
      )}
    </section>
  );
}

export default YourDocumentsPanel;
