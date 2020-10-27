import React from 'react';
import { Paper, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(() => ({
  paper: {
    padding: 30,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: '250px',
    height: '300px',
    textAlign: 'center',
  },
  img: {
    height: 150,
    width: '90%',
    marginBottom: 16,
    paddingRight: 32,
  },
  h5: {
    color: '#707070',
  },
  body: {
    color: '#707070',
  },
  button: {
    textTransform: 'capitalize',
    color: '#205DF5',
    fontSize: '1.4rem',
    marginLeft: -10,
    marginTop: 8,
  },
  blueContainer: {
    background: 'linear-gradient(180deg, rgba(32,93,245,1) 0%, rgba(0,94,255,1) 200px, rgba(255,255,255,1) 200px)',
    marginTop: '-30px',
    paddingTop: '30px',
    paddingBottom: '60px',
    marginLeft: -'32px',
    paddingLeft: '32px',
    marginRight: -'32px',
    paddingRight: '32px',
  },
}));
export default ({}) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.blueContainer}>
        <Typography variant="h2">Invest</Typography>
        <Divider variant="middle" />

        <Grid container spacing={12} justify="space-between" style={{ marginTop: '40px', marginBottom: '1rem' }}>
          <Grid item>
            <Paper className={classes.paper}>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/presentation.svg"
                alt="oops"
                style={{ width: '50px', height: '50px', marginTop: '10%' }}
              />
              <Typography variant="h6">Deck</Typography>
              <Divider variant="middle" />

              <Typography variant="subtitle">Allocations deck Last updated: October 2020</Typography>
              <Button color="secondary" variant="contained" style={{ marginTop: '2rem', width: '100%' }}>
                View
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/presentation.svg"
                alt="oops"
                style={{ width: '50px', height: '50px', marginTop: '10%' }}
              />
              <Typography variant="h6">Deck</Typography>
              <Divider variant="middle" />

              <Typography variant="subtitle">Allocations deck Last updated: October 2020</Typography>
              <Button color="secondary" variant="contained" style={{ marginTop: '2rem', width: '100%' }}>
                View
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/presentation.svg"
                alt="oops"
                style={{ width: '50px', height: '50px', marginTop: '10%' }}
              />
              <Typography variant="h6">Deck</Typography>
              <Divider variant="middle" />

              <Typography variant="subtitle">Allocations deck Last updated: October 2020</Typography>
              <Button color="secondary" variant="contained" style={{ marginTop: '2rem', width: '100%' }}>
                View
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/presentation.svg"
                alt="oops"
                style={{ width: '50px', height: '50px', marginTop: '10%' }}
              />
              <Typography variant="h6">Deck</Typography>
              <Divider variant="middle" />

              <Typography variant="subtitle">Allocations deck Last updated: October 2020</Typography>
              <Button color="secondary" variant="contained" style={{ marginTop: '2rem', width: '100%' }}>
                View
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/presentation.svg"
                alt="oops"
                style={{ width: '50px', height: '50px', marginTop: '10%' }}
              />
              <Typography variant="h6">Deck</Typography>
              <Divider variant="middle" />

              <Typography variant="subtitle">Allocations deck Last updated: October 2020</Typography>
              <Button color="secondary" variant="contained" style={{ marginTop: '2rem', width: '100%' }}>
                View
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
      ;
    </>
  );
};
