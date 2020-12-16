import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Confetti from 'react-confetti';

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
export default ({}) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.landingContainer}>
      <Grid className={classes.centerGrid}>
        <Confetti />

        <img src="https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/startup-step-custom+(3).svg" />
        <Typography
          variant="title1"
          style={{ color: 'white', marginTop: '1rem', marginBottom: '.25rem', fontSize: '2rem' }}
        >
          Congratulations on submitting your first SPV!
        </Typography>
        <Typography style={{ color: 'white', fontSize: '1rem' }}>
          We will be in touch with you shortly to talk next steps!{' '}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push('/')}
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
          Go back to Allocations Home
        </Button>
      </Grid>
    </div>
  );
};
