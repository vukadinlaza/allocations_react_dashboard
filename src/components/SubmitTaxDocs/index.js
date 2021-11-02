import React, { useState } from 'react';
import KYCModal from '../DealNextSteps/KYCModal';
import { Button } from '@material-ui/core';
import DocIcon from '../../assets/buildDoc.svg';
import { useLocation } from 'react-router-dom';
import './styles.scss';

function SubmitTaxDocs() {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const form = query.get('form')?.toUpperCase();
  const templateMap = {
    'W-9': { id: 'tpl_dM4QcQbyLckdPXgtyx', name: 'W9 Individual' },
    'W-9-E': { id: 'tpl_HSJjJ9c9jb2N4GXFkt', name: 'W9 Entity' },
    'W-8-BEN': { id: 'tpl_qDaxDLgRkFpHJD2cFX', name: 'W8 BEN' },
    'W-8-BEN-E': { id: 'tpl_mXPLm5EXAyHJKhQekf', name: 'W8 BEN-E' },
  };
  const validForms = Object.keys(templateMap);
  const [open, setOpen] = useState(validForms.includes(form) ? true : false);
  const [activeForm, setActiveForm] = useState(form || 'W-9');

  const handleClick = (formName) => {
    setActiveForm(formName);
    setOpen(true);
  };

  const buttonItems = Object.entries(templateMap).map(([key, value]) => {
    return (
      <Button key={key} onClick={() => handleClick(key)} className="form-select-button">
        <div className="button-content">
          <img className="button-img" src={DocIcon} />
          <p className="button-text">{value.name}</p>
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
        kycTemplateId={validForms.includes(form) ? templateMap[activeForm].id : ''}
        kycTemplateName={activeForm}
        refetch={() => {}}
        deal={{}}
        setShowTaxAsCompleted={() => {}}
      />
    </section>
  );
}

export default SubmitTaxDocs;