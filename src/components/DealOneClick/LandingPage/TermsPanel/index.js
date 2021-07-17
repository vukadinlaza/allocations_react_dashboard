import React from 'react';
import './styles.scss';
import { nWithCommas } from '../../../../utils/numbers';

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
      managementFeesDollar
    },
  } = deal;

  const dealLead = fundGeneralPartner || deal_lead || '';
  const carry = fundTotalCarry || totalCarry || '';
  const fees = fundManagementFees || managementFees || '';
  return (
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
            <p>Total carry:</p>
            <h3>{carry}%</h3>
          </li>
        )}
        {managementFeesDollar && (
          <li>
            <p>Total management fee:</p>
            <h3>${managementFeesDollar}{managementFeeType? ` (${managementFeeType})` : ''}</h3>
          </li>
        )}
        {fees && (
          <li>
            <p>Total management fee:</p>
            <h3>{fees}%</h3>
          </li>
        )}
        {minimumInvestment && (
          <li>
            <p>Minimum Investment:</p>
            <h3>${nWithCommas(minimumInvestment)}</h3>
          </li>
        )}
      </ul>
    </section>
  );
};

export default TermsPanel;
