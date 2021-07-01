import React, { useEffect, useState } from 'react';
import { Paper, Grid, Typography, Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import { toast } from 'react-toastify';
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
    background: 'linear-gradient(180deg, rgba(32,93,245,1) 0%, rgba(0,94,255,1) 160px, rgba(255,255,255,1) 160px)',
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
export default ({}) => {
  const classes = useStyles();
  const history = useHistory();
  const { userProfile, loading } = useAuth(GET_INVESTOR);
  const [updateInvestor] = useMutation(UPDATE_USER);
  const [postZap, {}] = useMutation(POST_ZAP);
  const [seedOptions, setSeedOptions] = useState(false);

  useEffect(() => {
    if (!loading && userProfile._id) {
      updateInvestor({
        variables: {
          investor: { showInvestAndMrkPlc: true, _id: userProfile._id },
        },
      });
    }
  }, [loading, updateInvestor, userProfile]);

  useEffect(() => {
    postZap({
      variables: { body: { action: 'Viewed Invest Page' } },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={classes.blueContainer}>
        <Typography variant="h3" style={{ color: 'white' }}>
          Demo
        </Typography>
        <Grid container spacing={12} justify="space-between" style={{ marginTop: '40px', marginBottom: '1rem' }}>
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
                  history.push({ pathname: `/deals/305-ventures` });
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
                  // postZap({
                  //   variables: { body: { name: userProfile.first_name, action: 'Viewed Investor Demo' } },
                  // });
                  history.push({
                    pathname: `/investor/${
                      // If true use Kingsley's ID otherwise Joel for Staging ENV
                      process.env.NODE_ENV === 'production' ? '5de560a92817ed4e5b8a7af4' : '5ef11c26b864940023a05ec5'
                    }/home`,
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
                  // postZap({
                  //   variables: { body: { name: userProfile.first_name, action: 'Viewed Marketplace Demo' } },
                  // });
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
                  // postZap({
                  //   variables: { body: { name: userProfile.first_name, action: 'Viewed Fund Manager Demo' } },
                  // });
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
