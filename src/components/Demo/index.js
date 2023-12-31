import React from 'react';
import { Paper, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { colors } from '@allocations/design-system';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '250px',
    height: '350px',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  img: {
    height: 150,
    width: '90%',
    marginBottom: 16,
    paddingRight: 32,
  },
  h5: {
    color: theme.colors.gray[500],
  },
  body: {
    color: theme.colors.gray[500],
  },
  button: {
    textTransform: 'capitalize',
    color: theme.colors.primary[600],
    fontSize: '1.4rem',
    marginLeft: -10,
    marginTop: 8,
  },
  blueContainer: {
    background: `linear-gradient(180deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[500]} 160px, ${theme.colors.white[100]} 160px)`,
    padding: '1.5rem',
  },
  a: {
    minWidth: '100%',
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '12vh',
    borderRadius: '.5rem',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  gridContainer: {
    marginTop: '40px',
    marginBottom: '1rem',
    [theme.breakpoints.down(600)]: {
      justifyContent: 'center',
    },
  },
}));

export default () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <>
      <div className={classes.blueContainer}>
        <Typography variant="h3" style={{ color: colors.white[100] }}>
          Demo
        </Typography>
        <Grid container spacing={12} justify="space-between" className={classes.gridContainer}>
          <Grid item>
            <Paper className={classes.paper}>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/analysis-icon.svg"
                alt="oops"
                style={{ width: '50px', height: '50px' }}
              />
              <Typography variant="h6">One Click Invest</Typography>
              <Divider variant="middle" />

              <Typography variant="subtitle2" style={{ fontSize: '.75rem' }}>
                A streamlined process to investing in deals.
              </Typography>
              <Button
                color="secondary"
                variant="contained"
                style={{ marginTop: '1rem', minWidth: '100%' }}
                onClick={() => {
                  history.push({ pathname: `/deals/allocations/klarna-demo` });
                }}
              >
                View
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                alt="oops"
                style={{ width: '50px', height: '50px' }}
              />
              <Typography variant="h6">Investor Demo</Typography>
              <Divider variant="middle" />

              <Typography variant="subtitle2" style={{ fontSize: '.75rem' }}>
                Manage SPVs / Funds Calculate portfolio value Buy & sell interests on exchange
              </Typography>
              <Button
                color="secondary"
                variant="contained"
                style={{ marginTop: '1rem', minWidth: '100%' }}
                onClick={() => {
                  history.push({
                    pathname: `/investor/5de560a92817ed4e5b8a7af4/home`,
                    search: '?demo=true',
                  });
                }}
              >
                View
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/group-icon.svg"
                alt="oops"
                style={{ width: '50px', height: '50px' }}
              />
              <Typography variant="h6">Marketplace Demo</Typography>
              <Divider variant="middle" />

              <Typography variant="subtitle2" style={{ fontSize: '.75rem' }}>
                Deal discovery Access to private SPVs Leaderboard of most popular deals
              </Typography>
              <Button
                color="secondary"
                variant="contained"
                style={{ marginTop: '1rem', minWidth: '100%' }}
                onClick={() => {
                  history.push({ pathname: `/marketplace` });
                }}
              >
                View
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/analysis-icon.svg"
                alt="oops"
                style={{ width: '50px', height: '50px' }}
              />
              <Typography variant="h6">Fund Manager Demo</Typography>
              <Divider variant="middle" />

              <Typography variant="subtitle2" style={{ fontSize: '.75rem' }}>
                Manage portfolio & LPs Track progress on fundraising Automated fund admin
              </Typography>
              <Button
                color="secondary"
                variant="contained"
                style={{ marginTop: '1rem', minWidth: '100%' }}
                onClick={() => {
                  history.push({ pathname: `/admin/demo-fund` });
                }}
              >
                View
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
