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
const dataCopy = [
  {
    phase: 'build',
    title: 'Sign Service Agreement',
    type: 'fm-document-signature',
    complete: true,
  },
  {
    phase: 'post-build',
    title: 'Create Process Street Run: 01. Client Solutions',
    type: 'service',
    complete: true,
  },
  {
    phase: 'pre-onboarding',
    title: 'Sign Investment Agreement',
    type: 'fm-document-signature',
    complete: false,
  },
  {
    phase: 'pre-onboarding',
    title: 'Upload Company Deck',
    type: 'fm-document-upload',
    complete: false,
  },
  {
    phase: 'pre-onboarding',
    title: 'Upload Company Logo',
    type: 'fm-document-upload',
    complete: false,
  },
  {
    phase: 'pre-onboarding',
    title: 'Upload Term Sheet',
    type: 'fm-document-upload',
    complete: false,
  },
  {
    phase: 'pre-onboarding',
    title: 'Migration Banking',
    type: 'process-street-checklist',
    complete: true,
  },
  {
    phase: 'pre-onboarding',
    title: 'Creating Bank Account',
    type: 'process-street-checklist',
    complete: true,
  },
  {
    phase: 'pre-onboarding',
    title: 'Legals / Deal Setup',
    type: 'process-street-checklist',
    complete: true,
  },
  {
    phase: 'onboarding',
    title: 'Confirm Deal Details',
    type: 'process-street-tasks',
    complete: true,
  },
  { phase: 'onboarding', title: 'Invite Investors', type: 'fm-document-upload', complete: false },
  {
    phase: 'onboarding',
    title: 'Invite Investors Confirmed',
    type: 'process-street-tasks',
    complete: false,
  },
  {
    phase: 'onboarding',
    title: 'Fund Manager KYC Review',
    type: 'process-street-tasks',
    complete: false,
  },
  { phase: 'closing', title: 'Next Steps', type: 'process-street-checklist', complete: true },
  {
    phase: 'post-closing',
    title: 'Compliance EDGAR Submission',
    type: 'process-street-checklist',
    complete: true,
  },
  {
    phase: 'post-closing',
    title: 'Compliance Reg D + Blue Sky',
    type: 'process-street-checklist',
    complete: true,
  },
];

const DealProgress = ({ data, classes }) => {
  const [currentPhase, setCurrentPhase] = useState('Pre-Onboarding');
  const [currentTask, setCurrentTask] = useState('');

  const [nextTask, setNextTask] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Pre-Onboarding', 'Onboarding', 'Closing', 'Post-Closing'];
  // console.log('Phase:', currentPhase);
  // console.log('Task:', currentTask);
  // console.log('Active Step:', activeStep);

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
    const tasks = data?.phases.flatMap((phase) =>
      phase.tasks.map((task) => ({
        phase: phase.name,
        title: task.title,
        type: task.type,
        complete: task.complete,
      })),
    );
    const task = tasks.find((task) => task.complete === false);
    const taskIndex = tasks.indexOf(task);

    if (phase) {
      setCurrentPhase(stepMap.get(phase.name));
      setActiveStep(steps.indexOf(currentPhase));
    }
    if (task) {
      setCurrentTask(task);
      setNextTask(tasks[taskIndex + 1]);
    }
  }, [data]);

  return (
    <>
      <ProgressBar steps={steps} activeStep={activeStep} />

      <Grid container className={classes.bodyContainer}>
        <Grid item xs={10} lg={10} className={classes.currentStepContainer}>
          <Typography className={classes.stepText}>Current Step</Typography>
          <CurrentStep phase={currentPhase} task={currentTask} />
        </Grid>
        <Grid item xs={10} lg={10} className={classes.nextStepContainer}>
          <Typography className={classes.stepText}>Up Next</Typography>
          <NextStep task={nextTask} />
        </Grid>
      </Grid>
    </>
  );
};

export default withStyles(styles)(withRouter(DealProgress));
