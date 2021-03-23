import React from 'react'
import { Button } from '@material-ui/core'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import './styles.scss'


function DealDocumentsPanel({ deal }) {

  const { documents } = deal;

  const documentItems = (documents || []).map(doc => {
    return (
      <Button>
        <InsertDriveFileIcon />
        {doc.path}
      </Button>
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
