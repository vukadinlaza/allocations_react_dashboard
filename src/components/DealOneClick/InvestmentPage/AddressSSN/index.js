import React from 'react';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import { get } from 'lodash';
import { PanelContainer } from '../../../Panel';

function TINAndAddress({
  investor,
  setInvestor,
  errors,
  isFromModal = false,
  docSpringTemplateId,
}) {
  if (docSpringTemplateId !== 'tpl_eg24nTFZrC2Kqs3FMf') return null;

  const handleChange = (prop) => (e) => {
    if (e) {
      e.persist();
    }
    return setInvestor((prev) => ({ ...prev, [prop]: e.target.value }));
  };

  const ssnOrTIN = investor.investor_type === 'individual' ? 'SSN' : 'TIN';
  const addressText =
    investor.state !== 'United States'
      ? 'Enter your Address, City and Zip Code'
      : 'Enter your Address, City, State and Zip Code';

  return (
    <PanelContainer isFromModal={isFromModal}>
      <FormControl style={{ padding: '2rem' }}>
        <TextField
          variant="outlined"
          placeholder={`Enter your ${ssnOrTIN}`}
          error={errors.includes('tax_identification_number')}
          value={get(investor, 'tax_identification_number') || ''}
          onChange={handleChange('tax_identification_number')}
        />
        {errors.includes('tax_identification_number') && (
          <FormHelperText style={{ color: 'red' }}>Please Enter your {ssnOrTIN}</FormHelperText>
        )}
        <TextField
          variant="outlined"
          placeholder={addressText}
          error={errors.includes('address')}
          value={get(investor, 'address') || ''}
          onChange={handleChange('address')}
        />
        {errors.includes('address') && (
          <FormHelperText style={{ color: 'red' }}>Please enter an address</FormHelperText>
        )}
      </FormControl>
    </PanelContainer>
  );
}

export default TINAndAddress;
