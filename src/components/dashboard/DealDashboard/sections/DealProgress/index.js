import React, { useState, useEffect } from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import CurrentStep from './components/CurrentStep';
import NextStep from './components/NextStep';
import ProgressBar from './components/Progressbar';
import CompletedTasksList from './components/CompletedTasksList';
import styles from '../../styles';
import CongratsStep from './components/CongratsStep';

const steps = ['Pre-Onboarding', 'Onboarding', 'Closing', 'Post-Closing'];

const stepMap = new Map([
  ['build', 'Pre-Onboarding'],
  ['post-build', 'Pre-Onboarding'],
  ['pre-onboarding', 'Pre-Onboarding'],
  ['onboarding', 'Onboarding'],
  ['closing', 'Closing'],
  ['post-closing', 'Post-Closing'],
]);

const hiddenTasks = [
  'Create Process Street Run: 01. Client Solutions',
  'Create Process Street Run: 01. Client Solutions (Fund)',
  'Process Investment Agreement',
  'Upload Company Deck',
  'Upload Company Logo',
  'Upload Fund Logo',
];

const DealProgress = ({ data, handleComplete, updateDealLoading, orgSlug, classes }) => {
  const [currentPhase, setCurrentPhase] = useState('Pre-Onboarding');
  const [currentTask, setCurrentTask] = useState({});
  const [nextTask, setNextTask] = useState({});
  const [nextTaskPhase, setNextTaskPhase] = useState('Pre-Onboarding');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const phase = data?.phases?.find((phase) =>
      phase.tasks.find(
        (task) => task.complete === false && !task.title.includes('Create Process Street Run'),
      ),
    );

    const tasks = data?.phases
      ?.filter((phase) => phase.name !== 'build')
      .flatMap((phase) =>
        phase.tasks
          .map((task) => ({
            _id: task._id,
            phase: phase.name,
            title: task.title,
            type: task.type,
            complete: task.complete,
          }))
          .filter((task) => !hiddenTasks.includes(task.title)),
      );

    const task = tasks?.find((task) => task.complete === false);
    const taskIndex = tasks?.indexOf(task);

    if (phase) {
      setCurrentPhase(stepMap.get(phase.name));
      setActiveStep(steps.indexOf(currentPhase));
    }
    if (task) {
      setCurrentTask(task);
      setNextTask(tasks[taskIndex + 1]);
      if (nextTask?.phase) {
        setNextTaskPhase(stepMap.get(nextTask.phase));
      }
    }
  }, [data, currentPhase]);

  const completedTasks = data.phases.flatMap((phase) =>
    phase.tasks
      .filter((task) => task.complete && !hiddenTasks.includes(task.title))
      .map((task) => {
        if (task.title.includes('Upload')) {
          task.title = 'Upload Your Documents';
          task.realTitle = 'Upload Company Deck';
        }
        return { ...task, phase: phase.name };
      }),
  );

  return (
    <>
      <ProgressBar steps={steps} activeStep={activeStep} />

      <Grid container className={classes.bodyContainer}>
        {currentTask?.title?.includes('User Acknowledged Complete') ? (
          <CongratsStep handleComplete={handleComplete} updateDealLoading={updateDealLoading} />
        ) : (
          <Grid item xs={10} lg={10} className={classes.currentStepContainer}>
            <Typography className={classes.stepText}>Current Step</Typography>
            <CurrentStep
              phase={data?.phases.find((phase) => phase.name === currentPhase.toLowerCase())}
              task={currentTask}
              deal={data}
              orgSlug={orgSlug}
            />
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
