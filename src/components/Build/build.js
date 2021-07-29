/* eslint-disable max-len */
import React from 'react';
import { Paper, Grid, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import StepConnector from '@material-ui/core/StepConnector';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { useMutation, gql } from '@apollo/client';
import QuestionsTwo from './newBuild';
import './style.scss';

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {},
  },
  completed: {
    '& $line': {
      backgroundColor: '#26C604',
    },
  },
  line: {
    width: 6,
    border: 0,
    backgroundColor: '#00000029',
    borderRadius: 0,
    minHeight: '100%',
  },
  vertical: {
    margin: '0 11px',
    padding: 0,
  },
})(StepConnector);
const useQontoStepIconStyles = makeStyles({
  root: {
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  inactive: {
    fontSize: 28,
    color: '#00000029',
  },
  completed: {
    color: '#26C604',
    zIndex: 1,
    fontSize: 28,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <CheckCircleIcon className={classes.completed} />
      ) : (
        <CheckCircleIcon className={classes.inactive} />
      )}
    </div>
  );
}

const POST_ZAP = gql`
  mutation PostZap($body: Object) {
    postZap(data: $body) {
      _id
    }
  }
`;
const BASE = 'appdPrRjapx8iYnIn';
const TABEL_NAME = 'Deals';

function getSteps() {
  return ['Welcome', 'Fund info', 'Delivery speed', 'Fees', 'Compliance'];
}

export default ({ deal, user, data, setData, setActiveStep, activeStep, atQuestionsData }) => {
  const steps = getSteps();
  const [postZap] = useMutation(POST_ZAP);

  const submitData = async () => {
    try {
      if (!data.airtableId) {
        const response = await fetch(`https://api.airtable.com/v0/${BASE}/${TABEL_NAME}`, {
          method: 'post', // make sure it is a "POST request"
          body: JSON.stringify({
            fields: { userId: user?._id, activeStep, email: user.email, ...data },
          }),
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`, // API key
            'Content-Type': 'application/json', // we will recive a json object
          },
        });
        const res = await response.json();
        return setData({ airtableId: res.id });
      }

      const payload = {
        records: [
          {
            id: data.airtableId,
            fields: { ...data, activeStep, userId: user?._id },
          },
        ],
      };

      await fetch(`https://api.airtable.com/v0/${BASE}/${TABEL_NAME}`, {
        method: 'patch', // make sure it is a "PATCH request"
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`, // API key
          'Content-Type': 'application/json', // we will recive a json object
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  if (!deal) return null;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    submitData();
    // if (activeStep >= 4) {
    //   postZap({
    //     variables: { body: { zapUrl: zapierWebhook, ...data } },
    //   });
    // }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (!deal) return null;
  return (
    <>
      <Grid
        xs={12}
        sm={12}
        md={12}
        lg={12}
        style={{ display: 'flex', marginTop: '3rem', marginRight: '5%' }}
      >
        <Grid
          xs={0}
          sm={3}
          md={3}
          lg={3}
          style={{ border: '1rem solid transparent', position: 'relative', minHeight: '100%' }}
        />
        <Grid
          xs={12}
          sm={4}
          md={4}
          lg={4}
          style={{ border: '1rem solid transparent', position: 'relative', minHeight: '100%' }}
        >
          <Paper xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <div
              style={{
                marginTop: '1.5rem',
                marginLeft: '1.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '4rem', color: '#2576FF' }}>{activeStep}</span>{' '}
                <span style={{ fontWeight: 'bolder', fontSize: '1.25rem' }}>/5</span>
              </div>
            </div>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              style={{ height: '85%', border: 'none', boxShadow: '0', paddingBottom: '30%' }}
              connector={<QontoConnector />}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
        {/* Left Column */}
        <Grid
          xs={12}
          sm={7}
          md={7}
          lg={7}
          style={{ border: '1rem solid transparent', position: 'relative', height: '90%' }}
        >
          <Paper style={{ padding: '1rem', height: '95vh', maxHeight: '95vh' }}>
            <Grid
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{
                marginBottom: '2rem',
                minHeight: '100%',
                maxHeight: '100%',
              }}
            >
              <Typography
                variant="title1"
                style={{ marginTop: '1rem', marginBottom: '1.5rem', fontSize: '2rem' }}
              >
                {activeStep === 2 ? 'Tell us about your SPV/Fund' : steps[activeStep - 1]}
              </Typography>
              <QuestionsTwo
                setData={setData}
                data={data}
                postZap={postZap}
                activeStep={activeStep}
                handleNext={handleNext}
                handleBack={handleBack}
                submitData={submitData}
              />
            </Grid>
          </Paper>
        </Grid>
        {/* end grid */}
      </Grid>
    </>
  );
};
