import { Box, Checkbox, Typography } from '@material-ui/core'
import React from 'react'
import './styles.scss'

function TermsAndConditionsPanel({ deal, investor }) {
  
  return (
    <section className="TermsAndConditions">
      <p className="section-label">Terms and Conditions</p>
      <Box p={3}>
        <Typography>I consent to electronic delivery of all documents, notices and agreements as related to my investment;</Typography>
        <Typography>I have read and agree to the issuer’s SPV Documents (Operating Agreement, Private Placement Memorandum and Subscription Agreement) and hereby authorize my signature to the SPV Documents; and</Typography>
        <Typography>I have read and agree to the Portfolio Company’s investment agreement, which is attached to the SPV Documents and will be entered between the Portfolio Company and the SPV.</Typography>
      </Box>
      <label>
        <Checkbox className="terms-checkbox"/>
        I have read and accept the terms of the investment.
      </label>
    </section>
  )
}

export default TermsAndConditionsPanel
