import React from 'react';
import { FormControl, FormHelperText, Select } from '@material-ui/core';
import { PanelContainer, PanelLabel } from '../../../Panel';
import useStyles from './styles';

function RealEstateUseage({ setInvestor, errors, isFromModal = false, docSpringTemplateId }) {
  if (docSpringTemplateId !== 'tpl_qbHh2KPqMkXaTyZbr7') return null;

  const handleChange = (event) => {
    setInvestor((prev) => ({
      ...prev,
      realEstateUseage: event.target.value,
    }));
  };

  const options = [
    {
      short: '1 Month',
    },
    {
      short: '2 Months',
    },
    {
      short: '3 Months',
    },
    {
      short: '4 Months',
    },
    {
      short: '5 Months',
    },
    {
      short: '6 Months',
    },
  ];

  return (
    <PanelContainer isFromModal={isFromModal}>
      <PanelLabel
        label="Term the investors will have access to the real estate in accordance with the rules set forth by the Manager"
        isFromModal={isFromModal}
      />
      <FormControl style={{ padding: '2rem' }}>
        <Select
          native
          label="Field"
          inputProps={{
            id: 'field-filter',
          }}
          onChange={handleChange}
        >
          {options.map((o) => {
            return <option value={o.short}>{o.short}</option>;
          })}
        </Select>

        {/* <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          onChange={handleChange}
        >

          {options.map((o) => {
            return (
              <Tooltip title={o.short}>
                <FormControlLabel
                  value={o.short}
                  control={<Radio />}
                  label={o.short}
                  className={classes.radioButton}
                />
              </Tooltip>
            );
          })}
        </RadioGroup> */}
        {errors.includes('realEstateUseage') && (
          <FormHelperText style={{ color: 'red' }}>Please select an option</FormHelperText>
        )}
      </FormControl>
    </PanelContainer>
  );
}

export default RealEstateUseage;
