import React from 'react'
import { Box } from '@material-ui/core'
import './styles.scss'
import ReactHtmlParser from 'react-html-parser';

function KeyHighlights({ deal }) {

  const { company_name, memo, dealParams: { keyHighlights, risks } } = deal;

  return (
    <section className="KeyHighlights">
      <p className="section-label">Key Highlights</p>
      <Box className="content" p={3}>
        {memo && memo.length > 0 ?
          ReactHtmlParser(memo) :
          <span className="no-data">No key highlights for <b>{company_name}.</b></span>
        }
      </Box>
    </section>
  )
}

export default KeyHighlights
