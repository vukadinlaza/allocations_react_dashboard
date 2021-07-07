import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  landingContainer: {
    minWidth: '100vw',
    minHeight: '100vh',
    background: 'transparent linear-gradient(127deg, #2576FF 0%, #4F8EFA 100%) 0% 0% no-repeat padding-box;',
  },
  centerGrid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
    minHeight: '100vh',
    flexDirection: 'column',
  },
}));
export default ({ Link }) => {
  const classes = useStyles();

  return (
    <div className={classes.landingContainer}>
      <Grid className={classes.centerGrid}>
        <img src="https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/startup-step-custom+(1).svg" alt='Rocket ship'/>
        <Typography
          variant="title1"
          style={{ color: 'white', marginTop: '1rem', marginBottom: '.25rem', fontSize: '2rem' }}
        >
          Allocations is the fastest fund administration experience ever made
        </Typography>
        <Typography style={{ color: 'white', fontSize: '1rem' }}>
          Get started, raise captial and close your next private fund{' '}
        </Typography>
        <Link activeClass="active" to="anchor" spy smooth offset={50} duration={500}>
          <Button
            variant="contained"
            color="primary"
            style={{
              fontSize: '1.5rem',
              margin: '1rem',
              backgroundColor: '#2576FF',
              borderRadius: '2rem',
              padding: '.5rem',
              paddingLeft: '2rem',
              paddingRight: '2rem',
              marginTop: '2rem',
            }}
          >
            Start Building{' '}
          </Button>
        </Link>
      </Grid>
    </div>
  );
};
