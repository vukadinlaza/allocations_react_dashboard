import moment from 'moment';
import { Box, Checkbox, Typography, Button } from '@material-ui/core';
import React from 'react';
import './styles.scss';

function TermsAndConditionsPanel({
  deal: { documents, signDeadline, status },
  checkedTAT,
  setCheckedTAT,
  confirmInvestment,
  isEdit,
  requireSecondSigChecked,
}) {
  const doc = (documents || []).find((d) => {
    return d.path.includes('Agreement');
  });

  const anchor = doc ? (
    <a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer">
      Private Fund Documents (Operating Agreement, Private Placement Memorandum and Subscription
      Agreement)
    </a>
  ) : (
    'Private Fund Documents (Operating Agreement, Private Placement Memorandum and Subscription Agreement'
  );

  const isClosed = status === 'closed';
  const weOrI = requireSecondSigChecked ? 'We' : 'I';
  const ourOrMy = requireSecondSigChecked ? 'our' : 'my';

  return (
    <section className="TermsAndConditions">
      <div className="terms-container">
        <p className="section-label">Terms and Conditions</p>
        <Box p={3}>
          <Typography>
            {weOrI} consent to electronic delivery of all documents, notices and agreements as
            related to my investment;
          </Typography>
          <Typography>
            {weOrI} have read and agree to the issuer’s {anchor} and hereby authorize
            {ourOrMy} signature{requireSecondSigChecked && 's'} to the SPV Documents; and
          </Typography>
          <Typography>
            {weOrI} have read and agree to the Portfolio Company’s investment agreement, which is
            attached to the SPV Documents and will be executed between the Portfolio Company and the
            SPV.
          </Typography>
          <Typography>
            The Manager and Administrative Manager reserve the right to reject any investment.
          </Typography>
          <Typography>
            {weOrI} understand that {weOrI} must do {ourOrMy} own diligence, read the investment
            documents and ask any questions {weOrI} think are relevant to {ourOrMy} investment
            decision. Portfolio Company information may be incomplete and has not been verified. The
            Manager may not have done extensive due diligence on the Portfolio Company. Investing
            with notable investors doesn’t guarantee any level of diligence has been performed.
          </Typography>
          <Typography>
            {weOrI} understand that the Manager and other investors may have access to material
            information regarding the company that has not been shared with me.
          </Typography>
          <Typography>
            {weOrI} understand that {ourOrMy} subscription amount is not guaranteed and the final
            investment amount accepted by the SPV may be less than {ourOrMy} desired subscription
            amount.
          </Typography>
        </Box>
        <label htmlFor="terms-checkbox">
          <Checkbox
            className="terms-checkbox"
            onChange={(e) => setCheckedTAT(e.target.checked)}
            classes={{
              checked: 'terms-checkbox-checked',
            }}
            id="terms-checkbox"
          />
          {weOrI} have read and accept the terms of the investment.
        </label>
      </div>
      {isClosed ? (
        <Typography style={{ color: 'red', fontSize: '1em' }}>
          You can no longer invest in this deal. This deal's deadline was:{' '}
          {moment(signDeadline).format('dddd, MMMM D YYYY, h:mm a [EST]')}.
        </Typography>
      ) : (
        <Button
          className="confirm-investment-button"
          disabled={!checkedTAT}
          onClick={confirmInvestment}
        >
          {isEdit ? 'Update Investment' : 'Confirm Investment'}
        </Button>
      )}
    </section>
  );
}

export default TermsAndConditionsPanel;
