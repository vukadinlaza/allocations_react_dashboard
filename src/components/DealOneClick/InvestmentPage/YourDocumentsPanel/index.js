import React from 'react'
import { Button } from '@material-ui/core'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import './styles.scss'


function YourDocumentsPanel({ investment }) {

  const { documents } = investment;

  const signedDocuments = (documents || []).map(doc => {
    const file = doc?.path.slice(0, 12) === "investments/" ? doc.path.split('/')[2] : doc.path.split('/')[1]

    return (
      <a href={`https://${doc.link}`} target="_blank">
        <Button>
          <InsertDriveFileIcon />
          {file}
        </Button>
      </a>
    )
  })
  return (
    <section className="DealDocumentsPanel">
      <p className="section-label">Your signed documents</p>
      { signedDocuments.length > 2 ?
        signedDocuments :
        <p className="no-docs">You do not have any signed documents.</p>

    }
    </section>
  )
}

export default YourDocumentsPanel
