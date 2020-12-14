/* eslint-disable max-len */
import React, { useState } from 'react';
import { Paper, Grid, Typography, Modal, Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { groupBy, map, get, toNumber } from 'lodash';
import { gql } from 'apollo-boost';
import Confetti from 'react-confetti';
import StepConnector from '@material-ui/core/StepConnector';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import QuestionsTwo from './newBuild';
import './style.scss';

const initialState = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};
const images = {
  basic: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/graphic-bg.svg',
  1: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/blank-platform.svg',
  Startup: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/startup-step-1.svg',
  Startup: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/startup-step-2.svg',
  // Startup: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/startup-step-custom.svg',
  Crypto: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/crypto-step-2.svg',
  Crypto: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/crypto-step-3.svg',
  // Crypto: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/crypto-step-custom.svg',
  Realestate: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/real-estate-step-1.svg',
  Realestate: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/real-estate-step-3.svg',
  // Realestate: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/real-estate-step-custom.svg',
  Custom: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/custom-step-setup.svg',
  Custom: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/custom-step-details.svg',
  // Custom: 'https://allocations-public.s3.us-east-2.amazonaws.com/build-icons/custom-step-custom.svg',
};
const zapierWebhook = 'https://hooks.zapier.com/hooks/catch/7904699/ol1c7go/';
const useStyles = makeStyles((theme) => ({
  button: {
    border: 'solid 2px #2676FF',
    minWidth: '90%',
    width: '90%',
    color: '#2676FF',
  },
  sidebar: {
    postion: 'sticky',
    top: '30vh !important',
  },
}));
const ColorlibConnector = withStyles({
  line: {
    minHeight: '100%',
    borderLeftWidth: '2px',
  },
})(StepConnector);
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
  return ['Fund info', 'Delivery speed', 'Fees', 'Compliance'];
}

export default ({ deal, user, data, setData, setStep, atQuestionsData }) => {
  const steps = getSteps();
  const [activeStep, setActiveStep] = useState(3);

  const [showConfetti, setShowConfetti] = useState(false);
  const [postZap, {}] = useMutation(POST_ZAP);
  const fieldData = groupBy(atQuestionsData, 'Page');

  const submitData = async () => {
    if (!data.airtableId) {
      const response = await fetch(`https://api.airtable.com/v0/${BASE}/${TABEL_NAME}`, {
        method: 'post', // make sure it is a "POST request"
        body: JSON.stringify({ fields: { userId: user._id, ...data } }),
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
          fields: data,
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
  };
  if (!deal) return null;

  // let price = 0;
  // if (data['Choose your fund type'] === 'SPV') {
  //   price += 8000;
  // }
  // if (data['Choose your fund type'] === 'Fund') {
  //   price += 26000;
  // }
  // if (data['Would you like to hire Allocations as the exempt reporting advisor?'] === 'Yes') {
  //   price += 2000;
  // }
  // if (data['Will you invite any investors from New York?'] === 'Yes') {
  //   price += 1200;
  // }
  // if (data['Will you charge same fees for all investors?'] === 'No') {
  //   price += 2000;
  // }
  // if (!data['Choose your fund type']) {
  //   price = 0;
  // }
  // const blueSkyFees = 500;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
        style={{ display: 'flex', marginTop: '3rem', marginLeft: '6rem', marginRight: '6rem' }}
      >
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
                <span style={{ fontSize: '4rem', color: '#2576FF' }}>{activeStep + 1}</span>{' '}
                <span style={{ fontWeight: 'bolder', fontSize: '1.25rem' }}>/4</span>
              </div>
            </div>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              style={{ height: '85%', border: 'none', boxShadow: '0', paddingBottom: '30%' }}
              connector={<ColorlibConnector />}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
        {/* Left Column */}
        <Grid
          xs={12}
          sm={8}
          md={8}
          lg={8}
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
              {/* <Questions setData={setData} answers={data} classes={classes} activePage={page} /> */}
              <Typography variant="title1" style={{ marginTop: '1rem', marginBottom: '1.5rem', fontSize: '2rem' }}>
                {steps[activeStep]}
              </Typography>
              <QuestionsTwo
                setData={setData}
                data={data}
                activeStep={activeStep}
                handleNext={handleNext}
                handleBack={handleBack}
              />

              {showConfetti && <div> yes </div>}
            </Grid>
          </Paper>
        </Grid>
        {/* end grid */}
      </Grid>

      {/* <Grid
        xs={12}
        sm={12}
        md={12}
        lg={12}
        style={{
          display: 'flex',
          margin: '0',
          color: 'black',
          background: 'white',
          borderTop: 'solid 1px black',
          position: 'fixed',
          bottom: '0',
          width: '90%',
          marginLeft: '-2rem',
          padding: '1rem',
          paddingBottom: '1.5rem',
        }}
      >
        <Grid xs={3} sm={3} md={3} lg={3}>
          <Grid container>
            <Grid
              xs={4}
              sm={4}
              md={4}
              lg={4}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}
            >
              <Typography variant="body1">
                <span style={{ minWidth: '120px' }}> Subtotal </span>
              </Typography>
              <Typography variant="body1">
                <span style={{ minWidth: '120px', marginTop: '1rem' }}> Estimated blue sky fees </span>
              </Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8} lg={8}>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', marginLeft: '1rem' }}> ${nWithCommas(price)}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', marginLeft: '1rem' }}>
                {' '}
                ${nWithCommas(blueSkyFees)}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={3} sm={3} md={3} lg={3}>
          <Grid container style={{ marginTop: '1rem' }}>
            <Grid
              xs={4}
              sm={4}
              md={4}
              lg={4}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}
            >
              <Typography variant="body1">
                <span style={{ minWidth: '120px' }}> Grand Total </span>
              </Typography>
            </Grid>
            <Grid xs={8} sm={8} md={8} lg={8}>
              <span style={{ fontSize: '2.5rem', fontWeight: '900', marginLeft: '1rem' }}>
                {' '}
                ${nWithCommas(price + blueSkyFees)}
              </span>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={2} sm={2} md={2} lg={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1"> Estimated Delivery: {data['Choose your wiring date']}</Typography>
        </Grid>
        <Grid xs={2} sm={2} md={2} lg={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              width: '180px',
              borderRadius: '1rem',
              fontSize: '1.2rem',
              textAlign: 'center',
              padding: '.25rem',
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
            }}
            className="nextBtn"
            onClick={() => {
              submitData();
              toast.success('Success!');
              setShowConfetti(true);
              setData(initialState);
              // postZap({
              //   variables: { body: { zapUrl: zapierWebhook, ...data } },
              // });
            }}
          >
            Review & Submit
          </div>
        </Grid>
      </Grid> */}
      <ConfirmationModal showConfetti={showConfetti} setShowConfetti={setShowConfetti} />
    </>
  );
};
const ConfirmationModal = ({ showConfetti, setShowConfetti }) => {
  return (
    <Modal open={showConfetti}>
      <Grid
        container
        xs={12}
        sm={12}
        md={12}
        lg={12}
        style={{
          display: 'flex',
          margin: '0',
          marginTop: '20vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid xs={12} sm={12} md={4} lg={4}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h4" style={{ textAlign: 'center', color: '#5C6E84' }} center>
              Thanks for submitting your SPV!
            </Typography>
            <Typography
              variant="h6"
              style={{ textAlign: 'center', color: '#5C6E84', marginTop: '1rem', marginBottom: '1rem' }}
              center
            >
              Someone from Allocations will reach out shortly to confirm your details.
            </Typography>
            <Grid style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowConfetti(false)}
                style={{ width: '30%', padding: '1rem', margin: '1rem', textSize: '1.5rem' }}
              >
                Close
              </Button>
            </Grid>
            <Confetti />
          </Paper>
        </Grid>
      </Grid>
    </Modal>
  );
};
