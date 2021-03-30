import { Box, Checkbox, Typography, Button } from '@material-ui/core';
import React from 'react';
import './styles.scss';

function TermsAndConditionsPanel({ deal, investor, checkedTAT, setCheckedTAT, confirmInvestment }) {
  const doc = (deal.documents || []).find((d) => {
    return d.path.includes('Subscription');
  });
  const anchor = doc ? (
    <a href={`https://${doc.link}`} target="_blank">
      SPV Documents (Operating Agreement, Private Placement Memorandum and Subscription Agreement)
    </a>
  ) : (
    'SPV Documents (Operating Agreement, Private Placement Memorandum and Subscription Agreement'
  );

  return (
    <section className="TermsAndConditions">
      <div className="terms-container">
        <p className="section-label">Terms and Conditions</p>
        <Box p={3}>
          <Typography>
            I consent to electronic delivery of all documents, notices and agreements as related to my investment;
          </Typography>
          <Typography>
            I have read and agree to the issuer’s {anchor} and hereby authorize my signature to the SPV Documents; and
          </Typography>
          <Typography>
            I have read and agree to the Portfolio Company’s investment agreement, which is attached to the SPV Documents
            and will be entered between the Portfolio Company and the SPV.
          </Typography>
        </Box>
        <label>
          <Checkbox className="terms-checkbox" onChange={(e) => setCheckedTAT(e.target.checked)} />I have read and accept
          the terms of the investment.
        </label>
      </div>
      <Button className="confirm-investment-button" disabled={!checkedTAT} onClick={confirmInvestment}>
        Confirm investment
      </Button>
    </section>
  );
}

export default TermsAndConditionsPanel;
