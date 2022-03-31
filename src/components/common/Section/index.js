import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import useStyles from './styles';

const Section = ({ title, children }) => {
  const styles = useStyles();
  return (
    <Grid container spacing={1} className={styles.section}>
      <Typography className={styles.sectionTitle}>{title}</Typography>
      {children}
    </Grid>
  );
};

export default Section;
