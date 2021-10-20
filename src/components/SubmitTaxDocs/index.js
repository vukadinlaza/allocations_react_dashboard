import React, { useState } from 'react';
import KYCModal from '../DealNextSteps/KYCModal';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { MenuItem, Select, Button } from '@material-ui/core';
import DocIcon from '../../assets/buildDoc.svg';
import './styles.scss';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      documents
      accredidation_status
      investments {
        _id
        deal {
          _id
          slug
        }
        amount
        value
        submissionData {
          country
          state
          investor_type
          legalName
          accredited_investor_status
          fullName
          title
          investmentId
          submissionId
        }
      }
    }
  }
`;

function SubmitTaxDocs() {
  const [open, setOpen] = useState(false);
  const [taxForm, setTaxForm] = useState('W-9');
  const [showTaxAsCompleted, setShowTaxAsCompleted] = useState(false);
  const { data, loading, refetch } = useQuery(GET_INVESTOR, { fetchPolicy: 'network-only' });

  console.log('!!!!', data);

  const templateMap = {
    'W-9': { id: 'tpl_dM4QcQbyLckdPXgtyx', name: 'W9 Individual' },
    'W-9-E': { id: 'tpl_HSJjJ9c9jb2N4GXFkt', name: 'W9 Entity' },
    'W-8-BEN': { id: 'tpl_qDaxDLgRkFpHJD2cFX', name: 'W8 BEN' },
    'W-8-BEN-E': { id: 'tpl_mXPLm5EXAyHJKhQekf', name: 'W8 BEN-E' },
  };

  const handleClick = (formName) => {
    setTaxForm(formName);
    setOpen(true);
  };
  const buttonItems = Object.entries(templateMap).map(([key, value]) => {
    return (
      <Button onClick={() => handleClick(key)} className="form-select-button">
        <div className="button-content">
          <img src={DocIcon} />
          <p>{value.name}</p>
        </div>
      </Button>
    );
  });

  return (
    <section className="SubmitTaxDocs">
      <div className="section-header">
        <div className="text">
          <p>Investor</p>
          <p>/</p>
          <p className="page">Submit Tax Documents</p>
        </div>
      </div>

      <div className="select-form">
        <h2>Select Tax Document:</h2>
        <div className="button-container">{buttonItems}</div>
      </div>

      <KYCModal
        open={open}
        setOpen={setOpen}
        kycTemplateId={templateMap[taxForm].id}
        kycTemplateName={taxForm}
        refetch={refetch}
        deal={{}}
        setShowTaxAsCompleted={setShowTaxAsCompleted}
      />
    </section>
  );
}

export default SubmitTaxDocs;
