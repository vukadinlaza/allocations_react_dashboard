import React from 'react';
import './styles.scss';
import { useParams } from 'react-router';
import { nWithCommas } from '../../../../utils/numbers';
import DealDocumentsPanel from '../../InvestmentPage/DealDocumentsPanel';

const TermsPanel = ({ deal }) => {
  const {
    deal_lead,
    dealParams: {
      minimumInvestment,
      totalCarry,
      managementFees,
      spvName,
      fundGeneralPartner,
      fundTotalCarry,
      fundManagementFees,
      managementFeeType,
      managementFeesDollar,
      fundManagementFeeType,
      customCurrency,
    },
  } = deal;
  const params = useParams();
  const { organization = '' } = params;

  const dealLead = fundGeneralPartner || deal_lead || '';
  const carry = fundTotalCarry || totalCarry || '';
  const fees = fundManagementFees || managementFees || '';
  const feeFrequency = fundManagementFeeType || managementFeeType || '';
  return (
    <div className="terms-and-documents">
      <section className="TermsPanel">
        <p className="section-label">Terms</p>
        <ul>
          {dealLead && (
            <li>
              <p>Manager:</p>
              <h3>{dealLead}</h3>
            </li>
          )}
          {spvName && (
            <li>
              <p>SPV Name:</p>
              <h3>{spvName}</h3>
            </li>
          )}
          {carry && (
            <li>
              <p>Total Carry:</p>
              <h3>{Number(carry) >= 0 ? `${carry}%` : carry}</h3>
            </li>
          )}
          {managementFeesDollar && (
            <li>
              <p>Total Management Fee:</p>
              <h3>${managementFeesDollar}</h3>
            </li>
          )}
          {fees && (
            <li>
              <p>Total Management Fee:</p>
              <h3>{fees}%</h3>
            </li>
          )}
          {feeFrequency && (
            <li>
              <p>Fee Frequency:</p>
              <h3>{feeFrequency}</h3>
            </li>
          )}
          {minimumInvestment && (
            <li>
              <p>Minimum Investment:</p>
              <h3>
                {customCurrency || '$'}
                {nWithCommas(minimumInvestment)}
              </h3>
            </li>
          )}
          {['62d0637a2d09f8b35de1e58f'].includes(deal._id) && (
            <li>
              <h5>See Special Provisions for Custom Fees</h5>
            </li>
          )}
        </ul>
      </section>
      {/* Specific request from Type One Ventures Fund Manager */}
      {organization === 'type-one-ventures' ? <DealDocumentsPanel deal={deal} /> : ''}
    </div>
  );
};

export default TermsPanel;
