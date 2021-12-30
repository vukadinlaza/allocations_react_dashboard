import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import CurrentStep from './components/CurrentStep';
import NextStep from './components/NextStep';
import ProgressBar from './components/ProgressBar';
import styles from '../../styles';

const defaultDesc =
  'An Allocations representative will be reaching out shortly to assist you in completing this step. If you have any questions, do not hesitate to contact support@allocations.com.';

const demoData = [
  {
    step: 'Pre-Onboarding',
    title: 'Pre-Onboarding',
    description: defaultDesc,
  },
  {
    step: 'Onboarding',
    title: 'Onboarding: Confirm Deal Details',
    description: defaultDesc,
  },
  {
    step: 'Onboarding',
    title: 'Onboarding: Invite Investors',
    tag: 'For You',
    description:
      'You can now invite investors to your deal. Please have their email addresses ready.',
    // invite link
  },
  {
    step: 'Onboarding',
    title: 'Onboarding: 506c Review',
    tag: 'For Allocations',
    description:
      'Please wait for an Allocations representative to complete this step. If you have any questions, do not hesitate to contact support@allocations.com',
  },
  {
    step: 'Onboarding',
    title: 'Onboarding: Fund Manager KYC Review',
    tag: 'For You',
    description:
      'Please log in to Parallel Markets and complete hte KYC Review before moving onto the next Step.',
    // PM Login link
  },
  {
    step: 'Closing',
    title: 'Closing',
    description: defaultDesc,
  },
  {
    step: 'Post-Closing',
    title: 'Post-Closing',
    description: defaultDesc,
  },
];

const DealProgress = ({ data, classes }) => {
  const [currentPhase, setCurrentPhase] = useState('Pre-Onboarding');
  const [currentTask, setCurrentTask] = useState('');

  const [currentStep, setCurrentStep] = useState(demoData[6]);
  const [nextStep, setNextStep] = useState(demoData[3]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Pre-Onboarding', 'Onboarding', 'Closing', 'Post-Closing'];
  console.log('Phase:', currentPhase);
  console.log('Current Step:', currentStep);
  console.log('Active Step:', activeStep);
  const stepMap = new Map([
    ['build', 'Pre-Onboarding'],
    ['post-build', 'Pre-Onboarding'],
    ['pre-onboarding', 'Pre-Onboarding'],
    ['onboarding', 'Onboarding'],
    ['closing', 'Closing'],
    ['post-closing', 'Post-Closing'],
  ]);

  useEffect(() => {
    const phase = data?.phases.find((phase) => phase.tasks.find((task) => task.complete === false));
    const task = phase.tasks.find((task) => task.complete === false);

    if (phase) {
      setCurrentPhase(phase.name);
      setCurrentStep(stepMap.get(phase.name));
      setActiveStep(steps.indexOf(currentStep));
    }
    if (task) {
      setCurrentTask(task.title);
    }
  }, [data, activeStep]);
  // console.log('Data:', data);
  // const handleTaskClick = (currentTask, task) => {
  //   if (task.type.startsWith('admin')) {
  //     setCurrentTask(false);
  //     return;
  //   }
  //   setCurrentTask(currentTask ? (task === currentTask ? false : task) : task);
  // };

  return (
    <>
      <ProgressBar steps={steps} activeStep={activeStep} />

      <Grid container className={classes.bodyContainer}>
        <Grid item xs={10} lg={10} className={classes.currentStepContainer}>
          <Typography className={classes.stepText}>Current Step</Typography>
          <CurrentStep data={currentStep} />
        </Grid>
        <Grid item xs={10} lg={10} className={classes.nextStepContainer}>
          <Typography className={classes.stepText}>Up Next</Typography>
          <NextStep data={nextStep} />
        </Grid>
      </Grid>
    </>
  );
};

export default withStyles(styles)(withRouter(DealProgress));
