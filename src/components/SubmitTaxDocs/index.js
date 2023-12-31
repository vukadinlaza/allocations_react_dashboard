import React, { useState } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import KYCModal from '../DealNextSteps/KYCModal';
import DocIcon from '../../assets/buildDoc.svg';
import styles from './styles';

function SubmitTaxDocs() {
  const classes = styles();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const form = query.get('form')?.toUpperCase();
  const templateMap = {
    'W-9': {
      id: 'tpl_dM4QcQbyLckdPXgtyx',
      name: 'W9 Individual',
      tooltipContent:
        'Form W-9 Individual is generally used by U.S citizens or resident aliens (trusts should use W9 Entity)',
    },
    'W-9-E': {
      id: 'tpl_HSJjJ9c9jb2N4GXFkt',
      name: 'W9 Entity',
      tooltipContent:
        'Form W-9 Entity is generally used by entities created or organized in the U.S. (including partnerships, corporations, LLCs, estates, and trusts)',
    },
    'W-8-BEN': {
      id: 'tpl_JmDP5PPQkSy7LYgJHF',
      name: 'W8 BEN',
      tooltipContent: 'Form W-8BEN is generally used by nonresident alien individuals',
    },
    'W-8-BEN-E': {
      id: 'tpl_mXPLm5EXAyHJKhQekf',
      name: 'W8 BEN-E',
      tooltipContent: 'Form W-8BEN-E is generally used by foreign entities',
    },
  };
  const validForms = Object.keys(templateMap);
  const [open, setOpen] = useState(!!validForms.includes(form));
  const [activeForm, setActiveForm] = useState(validForms.includes(form) ? form : 'W-9');
  const [templateId, setTemplateId] = useState(
    validForms.includes(form) ? templateMap[form].id : 'tpl_dM4QcQbyLckdPXgtyx',
  );

  const handleClick = (formName) => {
    setActiveForm(formName);
    setTemplateId(templateMap[formName].id);
    setOpen(true);
  };

  const buttonItems = Object.entries(templateMap).map(([key, value]) => {
    return (
      <div className={classes.buttonContainer}>
        <Tooltip title={value.tooltipContent} styles={{ fontSize: '16px' }} arrow>
          <Button key={key} onClick={() => handleClick(key)} className={classes.formSelectButton}>
            <div className={classes.buttonContent}>
              <img src={DocIcon} alt="document icon" />
              <p className={classes.buttonText}>{value.name}</p>
            </div>
          </Button>
        </Tooltip>
      </div>
    );
  });

  return (
    <section>
      <div className={classes.sectionHeader}>
        <div className={classes.text}>
          <p>Investor</p>
          <p>/</p>
          <p className={classes.page}>Submit Tax Documents</p>
        </div>
      </div>

      <div className={classes.selectForm}>
        <h2>Select Tax Document:</h2>
        <div className={classes.optionsContainer}>{buttonItems}</div>
      </div>

      <KYCModal
        open={open}
        setOpen={setOpen}
        kycTemplateId={templateId}
        kycTemplateName={activeForm}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        refetch={() => {}}
        deal={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setShowTaxAsCompleted={() => {}}
      />
    </section>
  );
}

export default SubmitTaxDocs;
