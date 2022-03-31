import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import useStyles from './styles';
import { nWithCommas } from '../../../utils/numbers';

const isValidValue = (value) => value !== undefined && value !== null;

const formatField = (field, value) => {
  switch (field) {
    case 'admin':
      return value ? 'Yes' : 'No';
    case 'amount':
      return nWithCommas(value);
    case 'users':
      return value ? value.map((user) => user.email).reduce((acc, n) => `${acc}, ${n}`) : '';
    default:
      if (typeof value === 'object') return `Invalid Data (${typeof value})`;
      return value;
  }
};

const GridSection = ({ title, fields, item }) => {
  const styles = useStyles();
  return (
    <Grid container spacing={1} className={styles.section}>
      <Typography className={styles.sectionTitle}>{title}</Typography>
      <Grid container item xs={12} spacing={3}>
        {fields.map((field, index) => (
          <Grid item xs={4} className={styles.dataBlock} key={`field-${index}`}>
            <div className={styles.dataContainer}>
              <Typography className={styles.fieldTitle}>{field.label}</Typography>
              <Typography className={styles.fieldValue}>
                {item
                  ? isValidValue(item[field.value])
                    ? formatField(field.value, item[field.value])
                    : 'N/A'
                  : 'N/A'}
              </Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default GridSection;
