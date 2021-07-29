import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  List,
  TextField,
  Paper,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Checkbox,
} from '@material-ui/core';

export default function TaxTreaty({ investor, errors, handleChange, setInvestor }) {
  return (
    <>
      <Typography variant="subtitle2">
        Claim of Tax Treaty Benefits (for chapter 3 purposes)
      </Typography>
      {!investor.usePermAddressAsMailing && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              required
              error={errors.includes('tax_treaty_rates_conditions')}
              style={{ width: '100%' }}
              value={get(investor, 'tax_treaty_rates_conditions') || ''}
              onChange={handleChange('tax_treaty_rates_conditions')}
              label="Special Rates And Conditions Paragraph "
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              required
              error={errors.includes('claim_percent_withholding')}
              style={{ width: '100%' }}
              value={get(investor, 'claim_percent_withholding') || ''}
              onChange={handleChange('claim_percent_withholding')}
              label="Percent Of claim to withhold"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              required
              error={errors.includes('types_of_income')}
              style={{ width: '100%' }}
              value={get(investor, 'types_of_income') || ''}
              onChange={handleChange('types_of_income')}
              label="Types of Income"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              required
              error={errors.includes('additional_explanation')}
              style={{ width: '100%' }}
              value={get(investor, 'additional_explanation') || ''}
              onChange={handleChange('additional_explanation')}
              label="Additional explanation"
              variant="outlined"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
