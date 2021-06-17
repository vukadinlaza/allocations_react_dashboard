import React, { useEffect } from 'react';
import { Paper, Grid, Typography, Button, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useAuth } from '../../auth/useAuth';

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
    background: 'linear-gradient(180deg, rgba(32,93,245,1) 0%, rgba(0,94,255,1) 250px, rgba(255,255,255,1) 250px)',
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
      showInvestAndMrkPlc
    }
  }
`;
const POST_ZAP = gql`
  mutation PostZap($body: Object) {
    postZap(data: $body) {
      _id
    }
  }
`;
const UPDATE_USER = gql`
  mutation UpdateUser($investor: UserInput!) {
    updateUser(input: $investor) {
      _id
    }
  }
`;
export default () => {
  const classes = useStyles();
  const { userProfile, loading } = useAuth(GET_INVESTOR);
  const [updateInvestor] = useMutation(UPDATE_USER);


  useEffect(() => {
    if (!loading && userProfile._id) {
      updateInvestor({
        variables: {
          investor: { showCredit: true, _id: userProfile._id },
        },
      });
    }
  }, [loading, updateInvestor, userProfile]);

  return (
    <>
      <div className={classes.blueContainer}>
        <Typography variant="h4" style={{ color: 'white' }}>
          Credit
        </Typography>
        <Grid container spacing={3} style={{ marginTop: '40px', marginBottom: '1rem' }}>
          <Grid item style={{ marginTop: '-8rem' }}>
            <>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/Investor+Dashboard%402x.png"
                alt="oops"
                style={{ width: '150px', height: '150px', position: 'relative', bottom: '-5rem', left: '20%' }}
              />
              <Paper className={classes.paper}>
                <Typography variant="h6" style={{ marginTop: '2rem' }}>
                  Capital Call Line
                </Typography>

                <Typography component="div" style={{ fontSize: '1.1rem' }}>
                  <Box fontWeight="fontWeightBold" m={1}>
                    Interest rate:
                  </Box>
                  <Box fontWeight="fontWeightBold" m={1}>
                    4.99%
                  </Box>
                </Typography>

                <Grid container>
                  <Grid item>
                    <CheckCircleIcon color="secondary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" style={{ marginTop: '.1rem', marginLeft: '.5rem' }}>
                      Instant initial application{' '}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <CheckCircleIcon color="secondary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" style={{ marginTop: '.1rem', marginLeft: '.5rem' }}>
                      Automated credit check
                    </Typography>
                  </Grid>
                </Grid>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginTop: '1rem', minWidth: '100%' }}
                  onClick={() => toast.success('Success! Your interest has been recorded')}
                >
                  Apply Now
                </Button>
              </Paper>
            </>
          </Grid>
          <Grid item style={{ marginTop: '-8rem' }}>
            <>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/Investor+Dashboard%402x.png"
                alt="oops"
                style={{ width: '150px', height: '150px', position: 'relative', bottom: '-5rem', left: '20%' }}
              />
              <Paper className={classes.paper}>
                <Typography variant="h6" style={{ marginTop: '2rem' }}>
                  Loan to Portfolio Company
                </Typography>

                <Typography component="div" style={{ fontSize: '1.1rem' }}>
                  <Box fontWeight="fontWeightBold" m={1}>
                    Interest rate:
                  </Box>
                  <Box fontWeight="fontWeightBold" m={1}>
                    4.99%
                  </Box>
                </Typography>

                <Grid container>
                  <Grid item>
                    <CheckCircleIcon color="secondary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" style={{ marginTop: '.1rem', marginLeft: '.5rem' }}>
                      Instant initial application{' '}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <CheckCircleIcon color="secondary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" style={{ marginTop: '.1rem', marginLeft: '.5rem' }}>
                      Automated credit check
                    </Typography>
                  </Grid>
                </Grid>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginTop: '1rem', minWidth: '100%' }}
                  onClick={() => toast.success('Success! Your interest has been recorded')}
                >
                  Apply Now
                </Button>
              </Paper>
            </>
          </Grid>
          <Grid item style={{ marginTop: '-8rem' }}>
            <>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/SPV%402x.png"
                alt="oops"
                style={{ width: '150px', height: '150px', position: 'relative', bottom: '-5rem', left: '20%' }}
              />
              <Paper className={classes.paper}>
                <Typography variant="h6" style={{ marginTop: '2rem' }}>
                  Management Credit Line{' '}
                </Typography>

                <Typography component="div" style={{ fontSize: '1.1rem' }}>
                  <Box fontWeight="fontWeightBold" m={1}>
                    Interest rate:
                  </Box>
                  <Box fontWeight="fontWeightBold" m={1}>
                    4.99%
                  </Box>
                </Typography>

                <Grid container>
                  <Grid item>
                    <CheckCircleIcon color="secondary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" style={{ marginTop: '.1rem', marginLeft: '.5rem' }}>
                      Instant initial application{' '}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <CheckCircleIcon color="secondary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" style={{ marginTop: '.1rem', marginLeft: '.5rem' }}>
                      Automated credit check
                    </Typography>
                  </Grid>
                </Grid>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginTop: '1rem', minWidth: '100%' }}
                  onClick={() => toast.success('Success! Your interest has been recorded')}
                >
                  Apply Now
                </Button>
              </Paper>
            </>
          </Grid>
          <Grid item style={{ marginTop: '-8rem' }}>
            <>
              <img
                src="https://allocations-public.s3.us-east-2.amazonaws.com/SPV%402x.png"
                alt="oops"
                style={{ width: '150px', height: '150px', position: 'relative', bottom: '-5rem', left: '20%' }}
              />
              <Paper className={classes.paper}>
                <Typography variant="h6" style={{ marginTop: '2rem' }}>
                  GP Capital Contribution Line{' '}
                </Typography>

                <Typography component="div" style={{ fontSize: '1.1rem' }}>
                  <Box fontWeight="fontWeightBold" m={1}>
                    Interest rate:
                  </Box>
                  <Box fontWeight="fontWeightBold" m={1}>
                    4.99%
                  </Box>
                </Typography>

                <Grid container>
                  <Grid item>
                    <CheckCircleIcon color="secondary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" style={{ marginTop: '.1rem', marginLeft: '.5rem' }}>
                      Instant initial application{' '}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <CheckCircleIcon color="secondary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" style={{ marginTop: '.1rem', marginLeft: '.5rem' }}>
                      Automated credit check
                    </Typography>
                  </Grid>
                </Grid>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginTop: '1rem', minWidth: '100%' }}
                  onClick={() => toast.success('Success! Your interest has been recorded')}
                >
                  Apply Now
                </Button>
              </Paper>
            </>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
