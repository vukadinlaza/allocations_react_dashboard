import React, { useState, useEffect } from 'react';
import { Paper, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { gql } from 'apollo-boost';
import { useFetch, useSimpleReducer } from '../../utils/hooks';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';
import BuildStep from './build';
import SignStep from './sign';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '250px',
    height: '250px',
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
    background: 'linear-gradient(180deg, rgba(32,93,245,1) 0%, rgba(0,94,255,1) 140px, rgba(255,255,255,1) 140px)',
    marginTop: '-30px',
    paddingTop: '30px',
    paddingBottom: '60px',
    marginLeft: '-32px',
    paddingLeft: '32px',
    marginRight: '-32px',
    paddingRight: '32px',
  },
  a: {
    minWidth: '100%',
  },
  modal: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '12vh',
    borderRadius: '.5rem',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
}));
const GET_INVESTOR = gql`
  {
    investor {
      _id
      email
      first_name
      last_name
      admin
      deals {
        company_name
        airtableId
        status
      }
    }
  }
`;

const BASE = 'appdPrRjapx8iYnIn';
const TABEL_NAME = 'Deals';
export default ({}) => {
  const classes = useStyles();
  const [step, setStep] = useState('');
  const itemDone = false;
  const { data: allATDeals } = useFetch(BASE, TABEL_NAME);
  const [data, setData] = useSimpleReducer({});

  const { userProfile } = useAuth(GET_INVESTOR);

  useEffect(() => {
    if (allATDeals && userProfile) {
      const tableDeals = allATDeals.map((r) => ({ id: r.id, ...r.fields }));
      const dbDeal = userProfile?.deals?.find((d) => d?.airtableId && d?.status === 'draft');
      const activeDeal = tableDeals?.find((d) => d.id === dbDeal?.airtableId) || {};
      setData({ airtableId: activeDeal.id, ...activeDeal });
    }
  }, [allATDeals, setData, userProfile]);

  if (!userProfile || !allATDeals) return <Loader />;
  return (
    <>
      <div className={classes.blueContainer}>
        <Typography variant="h3" style={{ color: 'white' }}>
          Build
        </Typography>
        {step && <div style={{ marginTop: '4rem' }} />}
        {step === 'build' && (
          <BuildStep deal={data} user={userProfile} setData={setData} data={data} setStep={setStep} />
        )}
        {step === 'sign' && <SignStep deal={data} user={userProfile} />}
        {!step && (
          <>
            <Typography variant="h6" style={{ color: 'black', marginTop: '100px' }}>
              Build Phase
            </Typography>
            <Grid container spacing={12} justify="space-between" style={{ marginTop: '10px', marginBottom: '1rem' }}>
              <Grid item>
                <Paper className={classes.paper}>
                  <Grid container justify="space-between">
                    <Grid item style={{ width: '50px' }} />
                    <Grid item>
                      <img
                        src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                        alt="oops"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Grid>
                    <Grid style={{ width: '50px' }}>
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: '1rem', width: '40px', height: '40px', opacity: itemDone ? '1' : '.25' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Scope & Build</Typography>
                  <Button
                    onClick={() => setStep('build')}
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: '1rem', minWidth: '100%' }}
                  >
                    Build
                  </Button>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <Grid container justify="space-between">
                    <Grid item style={{ width: '50px' }} />
                    <Grid item>
                      <img
                        src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                        alt="oops"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Grid>
                    <Grid style={{ width: '50px' }}>
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: '1rem', width: '40px', height: '40px', opacity: itemDone ? '1' : '.25' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Preview</Typography>
                  <Button color="secondary" variant="contained" style={{ marginTop: '1rem', minWidth: '100%' }}>
                    Review
                  </Button>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <Grid container justify="space-between">
                    <Grid item style={{ width: '50px' }} />
                    <Grid item>
                      <img
                        src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                        alt="oops"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Grid>
                    <Grid style={{ width: '50px' }}>
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: '1rem', width: '40px', height: '40px', opacity: itemDone ? '1' : '.25' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Service Agreement</Typography>
                  <Button
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: '1rem', minWidth: '100%' }}
                    onClick={() => setStep('sign')}
                  >
                    Sign
                  </Button>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" style={{ color: 'black' }}>
              Set Up Phase
            </Typography>
            <Grid container spacing={12} justify="space-between" style={{ marginTop: '10px', marginBottom: '1rem' }}>
              <Grid item>
                <Paper className={classes.paper}>
                  <Grid container justify="space-between">
                    <Grid item style={{ width: '50px' }} />
                    <Grid item>
                      <img
                        src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                        alt="oops"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Grid>
                    <Grid style={{ width: '50px' }}>
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: '1rem', width: '40px', height: '40px', opacity: itemDone ? '1' : '.25' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Entity & bank status</Typography>
                  <Button color="secondary" variant="contained" style={{ marginTop: '1rem', minWidth: '100%' }}>
                    View Status
                  </Button>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <Grid container justify="space-between">
                    <Grid item style={{ width: '50px' }} />
                    <Grid item>
                      <img
                        src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                        alt="oops"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Grid>
                    <Grid style={{ width: '50px' }}>
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: '1rem', width: '40px', height: '40px', opacity: itemDone ? '1' : '.25' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Investment docs & materials</Typography>
                  <Button color="secondary" variant="contained" style={{ marginTop: '1rem', minWidth: '100%' }}>
                    View Status
                  </Button>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <Grid container justify="space-between">
                    <Grid item style={{ width: '50px' }} />
                    <Grid item>
                      <img
                        src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                        alt="oops"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Grid>
                    <Grid style={{ width: '50px' }}>
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: '1rem', width: '40px', height: '40px', opacity: itemDone ? '1' : '.25' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Interal review</Typography>
                  <Button color="secondary" variant="contained" style={{ marginTop: '1rem', minWidth: '100%' }}>
                    View Status
                  </Button>
                </Paper>
              </Grid>
            </Grid>
            <Typography variant="h6" style={{ color: 'black' }}>
              Onboarding Phase
            </Typography>
            <Grid container spacing={12} justify="space-between" style={{ marginTop: '10px', marginBottom: '1rem' }}>
              <Grid item>
                <Paper className={classes.paper}>
                  <Grid container justify="space-between">
                    <Grid item style={{ width: '50px' }} />
                    <Grid item>
                      <img
                        src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                        alt="oops"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Grid>
                    <Grid style={{ width: '50px' }}>
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: '1rem', width: '40px', height: '40px', opacity: itemDone ? '1' : '.25' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Final client review</Typography>
                  <Button color="secondary" variant="contained" style={{ marginTop: '1rem', minWidth: '100%' }}>
                    View
                  </Button>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <Grid container justify="space-between">
                    <Grid item style={{ width: '50px' }} />
                    <Grid item>
                      <img
                        src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                        alt="oops"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Grid>
                    <Grid style={{ width: '50px' }}>
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: '1rem', width: '40px', height: '40px', opacity: itemDone ? '1' : '.25' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Final pre-signing</Typography>
                  <Button color="secondary" variant="contained" style={{ marginTop: '1rem', minWidth: '100%' }}>
                    View
                  </Button>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <Grid container justify="space-between">
                    <Grid item style={{ width: '50px' }} />
                    <Grid item>
                      <img
                        src="https://allocations-public.s3.us-east-2.amazonaws.com/architecture-and-city.svg"
                        alt="oops"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Grid>
                    <Grid style={{ width: '50px' }}>
                      <CheckCircleIcon
                        color="secondary"
                        style={{ marginLeft: '1rem', width: '40px', height: '40px', opacity: itemDone ? '1' : '.25' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Live deal</Typography>
                  <Button color="secondary" variant="contained" style={{ marginTop: '1rem', minWidth: '100%' }}>
                    View{' '}
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </>
  );
};
