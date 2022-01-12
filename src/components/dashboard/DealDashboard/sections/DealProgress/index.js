import React, { useState, useEffect } from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import CurrentStep from './components/CurrentStep';
import NextStep from './components/NextStep';
import ProgressBar from './components/Progressbar';
import CompletedTasksList from './components/CompletedTasksList';
import styles from '../../styles.ts';
import CongratsStep from './components/CongratsStep';

const dataCopy = [
  {
    phase: 'build',
    title: 'Sign Services Agreement',
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
    complete: false,
  },
  {
    phase: 'post-closing',
    title: 'User Acknowledged Complete',
    type: 'fm-review',
    complete: false,
  },
];

const steps = ['Pre-Onboarding', 'Onboarding', 'Closing', 'Post-Closing'];

const stepMap = new Map([
  ['build', 'Pre-Onboarding'],
  ['post-build', 'Pre-Onboarding'],
  ['pre-onboarding', 'Pre-Onboarding'],
  ['onboarding', 'Onboarding'],
  ['closing', 'Closing'],
  ['post-closing', 'Post-Closing'],
]);

const DealProgress = ({ data, classes }) => {
  const [currentPhase, setCurrentPhase] = useState('Pre-Onboarding');
  const [currentTask, setCurrentTask] = useState({});
  const [nextTask, setNextTask] = useState({});
  const [nextTaskPhase, setNextTaskPhase] = useState('Pre-Onboarding');
  const [activeStep, setActiveStep] = useState(0);
  // console.log('DATA:', data);
  useEffect(() => {
    const phase = data?.phases?.find((phase) =>
      phase.tasks.find((task) => task.complete === false),
    );
    const tasks = data?.phases?.flatMap((phase) =>
      phase.tasks.map((task) => ({
        phase: phase.name,
        title: task.title,
        type: task.type,
        complete: task.complete,
      })),
    );
    const task = tasks?.find((task) => task.complete === false);
    const taskIndex = tasks?.indexOf(task);

    if (phase) {
      console.log('Phase:', phase);
      setCurrentPhase(stepMap.get(phase.name));
      console.log('Step:', currentPhase);
      setActiveStep(steps.indexOf(currentPhase));
    }
    if (task) {
      setCurrentTask(task);
      console.log('Current Task:', currentTask);
      setNextTask(tasks[taskIndex + 1]);
      if (nextTask) {
        setNextTaskPhase(stepMap.get(nextTask.phase));
      }
    }
  }, [data]);

  const completedTasks = data.phases
    .filter((phase) => phase.name !== 'build')
    .flatMap((phase) =>
      phase.tasks
        .filter((task) => task.complete && !task.title.includes('Create Process Street Run'))
        .map((task) => ({ ...task, phase: phase.name })),
    );

  return (
    <>
      <ProgressBar steps={steps} activeStep={activeStep} />

      <Grid container className={classes.bodyContainer}>
        {currentTask?.title?.includes('User Acknowledged Complete') ? (
          <CongratsStep />
        ) : (
          <Grid item xs={10} lg={10} className={classes.currentStepContainer}>
            <Typography className={classes.stepText}>Current Step</Typography>
            <CurrentStep phase={currentPhase} task={currentTask} />
          </Grid>
        )}
        {nextTask !== undefined && (
          <Grid item xs={10} lg={10} className={classes.nextStepContainer}>
            <Typography className={classes.stepText}>Up Next</Typography>
            <NextStep phase={nextTaskPhase} task={nextTask} />
          </Grid>
        )}
        <Grid item xs={10} lg={12}>
          <Divider variant="middle" style={{ color: '#E2E8F0', margin: '50px 0px' }} />
        </Grid>
        <Grid item xs={10} lg={10} style={{ padding: '0px' }}>
          <CompletedTasksList completedTasks={completedTasks} classes={classes} />
        </Grid>
      </Grid>
    </>
  );
};

export default withStyles(styles)(withRouter(DealProgress));
