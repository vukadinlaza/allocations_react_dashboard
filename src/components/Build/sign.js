import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const powerFormLink =
  process.env === 'production'
    ? 'https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=4967a16a-d608-4192-a473-5f2a54f9e330&env=na3&acct=5ff4424d-446e-45ab-a456-3382543498de&v=2&'
    : 'https://demo.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=3655160a-bd2f-4e8f-8748-ffedb4494cd1&env=demo&acct=26630525-c754-47e0-a821-a9ca4134ac03&v=2&';
export default ({ deal, user }) => {
  const params = {
    [`signer_Email`]: user.email,
    [`signer_UserName`]: user.first_name,
    [`build-airtable-id`]: deal.airtableId,
    [`build-carried-interest-other-fees`]: `Organizer Managment Fee Amount: ${
      deal.org_charge_mgmt_fee_amount || 0
    }. Organizer Carry Amount: ${deal.org_recieve_carry_amount || 0}`,
    [`build-asset-type`]: deal.asset_type || '',
    [`build-target-company-name`]: deal.company_name || '',
    [`build-initial-closing-date`]: deal.wiring_date || '',
    [`build-organizer-name`]: deal.organizer_name || '',
    [`build-master-limit-partner-company-name`]: deal.master_series_name || '',
  };
  const urlParameters = Object.entries(params)
    .map((e) => e.map(encodeURI).join('='))
    .join('&');
  const link = `${powerFormLink}${urlParameters}`;
  return (
    <div>
      <div className="external-sign-link">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h3>
            <FontAwesomeIcon icon="signature" /> Open Directly
          </h3>
        </a>
      </div>
      <div className="embed-responsive embed-responsive-1by1">
        <iframe className="embed-responsive-item" title="Wire Instructions" src={link} />
      </div>
    </div>
  );
};
