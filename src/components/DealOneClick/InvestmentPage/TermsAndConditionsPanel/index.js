import { Box, Checkbox, Typography, Button } from '@material-ui/core';
import React from 'react';
import './styles.scss';

function TermsAndConditionsPanel({ deal, checkedTAT, setCheckedTAT, confirmInvestment }) {
  const doc = (deal.documents || []).find((d) => {
    return d.path.includes('Agreement');
  });

  const anchor = doc ? (
    <a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer">
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
            I have read and agree to the Portfolio Company’s investment agreement, which is attached to the SPV
            Documents and will be executed between the Portfolio Company and the SPV.
          </Typography>
          <Typography>The Manager and Administrative Manager reserve the right to reject any investment.</Typography>
          <Typography>
            I understand that I must do my own diligence, read the investment documents and ask any questions I think
            are relevant to my investment decision. Portfolio Company information may be incomplete and has not been
            verified. The Manager may not have done extensive due diligence on the Portfolio Company. Investing with
            notable investors doesn’t guarantee any level of diligence has been performed.
          </Typography>
          <Typography>
            I understand that the Manager and other investors may have access to material information regarding the
            company that has not been shared with me.
          </Typography>
          <Typography>
            I understand that my subscription amount is not guaranteed and the final investment amount accepted by the
            SPV may be less than my desired subscription amount.
          </Typography>
        </Box>
        <label>
          <Checkbox
            className="terms-checkbox"
            onChange={(e) => setCheckedTAT(e.target.checked)}
            classes={{
              checked: "terms-checkbox-checked"
            }}
            />
          I have read and accept the terms of the investment.
        </label>
      </div>
      <Button className="confirm-investment-button" disabled={!checkedTAT} onClick={confirmInvestment}>
        Confirm investment
      </Button>
    </section>
  );
}

export default TermsAndConditionsPanel;
