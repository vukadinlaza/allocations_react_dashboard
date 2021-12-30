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
    task: 'Pre-Onboarding',
    description: defaultDesc,
  },
  {
    task: 'Confirm Deal Details',
    description: defaultDesc,
  },
  {
    task: 'Invite Investors',
    tag: 'For You',
    description:
      'You can now invite investors to your deal. Please have their email addresses ready.',
    button: 'BUTTON HERE',
  },
  {
    task: '506c Review',
    tag: 'For Allocations',
    description: defaultDesc,
  },
  {
    task: 'Fund Manager KYC Review',
    tag: 'For You',
    description: defaultDesc,
  },
  {
    task: 'Closing',
    description: defaultDesc,
  },
  {
    task: 'Post-Closing',
    description: defaultDesc,
  },
];

const DealProgress = ({ data, classes }) => {
  const [currentPhase, setCurrentPhase] = useState('Pre-Onboarding');
  const [currentTaskTitle, setCurrentTaskTitle] = useState('');

  const [currentStep, setCurrentStep] = useState(demoData[6]);
  const [nextStep, setNextStep] = useState(demoData[3]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Pre-Onboarding', 'Onboarding', 'Closing', 'Post-Closing'];
  console.log('Phase:', currentPhase);
  console.log('Task Title:', currentTaskTitle);
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
    // console.log('DATA:', data);
    const phase = data?.phases.find((phase) => phase.tasks.find((task) => task.complete === false));
    const task = phase.tasks.find((task) => task.complete === false);

    if (phase) {
      setCurrentPhase(stepMap.get(phase.name));
      setCurrentStep(stepMap.get(phase.name));
      setActiveStep(steps.indexOf(currentStep));
    }
    if (task) {
      setCurrentTaskTitle(task.title);
    }
  }, [data, activeStep]);

  const tasks = data?.phases.flatMap((phase) =>
    phase.tasks.map((task) => ({
      phase: phase.name,
      title: task.title,
      type: task.type,
      complete: task.complete,
    })),
  );
  console.log('TASKS:', tasks);

  return (
    <>
      <ProgressBar steps={steps} activeStep={activeStep} />

      <Grid container className={classes.bodyContainer}>
        <Grid item xs={10} lg={10} className={classes.currentStepContainer}>
          <Typography className={classes.stepText}>Current Step</Typography>
          <CurrentStep data={currentStep} phase={currentPhase} taskTitle={currentTaskTitle} />
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
