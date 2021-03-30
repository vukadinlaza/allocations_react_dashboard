import React from 'react'
import { Button } from '@material-ui/core'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import './styles.scss'


function DealDocumentsPanel({ deal }) {

  const { documents } = deal;

  const documentItems = (documents || []).map((doc, i) => {
    return (
      <a key={i} href={`https://${doc.link}`} target="_blank">
        <Button>
          <InsertDriveFileIcon />
          {doc.path}
        </Button>
      </a>
    )
  })
  return (
    <section className="DealDocumentsPanel">
      <p className="section-label">Deal documents</p>
      { documentItems }
    </section>
  )
}

export default DealDocumentsPanel
