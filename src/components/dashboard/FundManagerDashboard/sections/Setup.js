import React, { useEffect, useState } from 'react';
import { every } from 'lodash';
import moment from 'moment';
import { Typography, LinearProgress, Grid } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { dealSteps } from './dealSteps';
import { SimpleBox, ModalTooltip } from '../widgets';
import Loader from '../../../utils/Loader';
import { nWithCommas } from '../../../../utils/numbers';

const StepsContainer = ({
  title,
  steps,
  id,
  openTooltip,
  handleTooltip,
  tooltipContent,
  classes,
}) => {
  return (
    <Grid item xs={6} lg={3} style={{ height: 'auto' }}>
      <SimpleBox
        title={title}
        titleData={
          <CheckCircleIcon
            style={{ color: '#39C522', opacity: every(steps, { checked: true }) ? '100%' : '25%' }}
          />
        }
        autoHeight
        size="fourth"
        fullWidthContent
        openTooltip={openTooltip}
        handleTooltip={handleTooltip}
        id={id}
        tooltipContent={<Typography color="inherit">{tooltipContent}</Typography>}
      >
        {steps.map((step, idx) => {
          return (
            <ModalTooltip
              title={step.value}
              handleTooltip={handleTooltip}
              tooltipContent={<Typography color="inherit">{step.tooltip}</Typography>}
              openTooltip={openTooltip}
              id={step.value.split(' ').join()}
              key={`step-${idx}`}
            >
              <div
                className={classes.setupStep}
                onClick={() => handleTooltip(step.value.split(' ').join())}
              >
                <CheckCircleIcon
                  style={{
                    color: '#0461FF',
                    opacity: step.checked ? '100%' : '25%',
                    marginRight: '0.5em',
                  }}
                  id={`check-${step.value.split(' ').join()}`}
                />
                <Typography>{step.value}</Typography>
              </div>
            </ModalTooltip>
          );
        })}
      </SimpleBox>
    </Grid>
  );
};

const Setup = ({ classes, data, openTooltip, handleTooltip, subscriptionData }) => {
  const { target, raised, dealParams, investmentType } = data;
  const {
    signDeadline,
    wireDeadline,
    dealType,
    totalCarry,
    fundTotalCarry,
    managementFees,
    managementFeesDollar,
    fundManagementFeesDollar,
    fundManagementFees,
    managementFeeType,
    fundManagementFeeType,
  } = dealParams;

  const [dealTasks, setDealTasks] = useState([]);
  const [setupSteps, setSetupSteps] = useState(dealSteps);
  const { buildSteps, preOnboardingSteps, onboardingSteps, closingSteps } = setupSteps;

  useEffect(() => {
    const tasks = data?.dealOnboarding?.dealTasks;
    if (tasks) setDealTasks(tasks);
  }, [data]);

  const getManagementFee = () => {
    const managementFee = investmentType === 'fund' ? fundManagementFees : managementFees;
    const managementFeeDollar =
      investmentType === 'fund' ? fundManagementFeesDollar : managementFeesDollar;
    if (managementFee || managementFee === '0') {
      return `${managementFee}%`;
    }
    if (managementFeeDollar?.length > 0) {
      return `$${managementFeeDollar}`;
    }
  };

  const getCarry = () => {
    return investmentType === 'fund' ? fundTotalCarry : totalCarry;
  };

  const getRaisedPercentage = () => {
    const isRaisedANumber = raised && !Number.isNaN(raised);
    const isTargetANumber = target && !Number.isNaN(target);
    return isTargetANumber && isRaisedANumber ? Math.round((raised / target) * 100) : 0;
  };

  const getSetupData = () => {
    const raisedPercentage = getRaisedPercentage();
    const managementFee = getManagementFee();
    const carry = getCarry();

    return {
      target,
      raisedPercentage,
      managementFee,
      carry,
      dealType,
      wireDeadline: moment(wireDeadline).format('MMMM Do, YYYY'),
      signDeadline: moment(signDeadline).format('MMMM Do, YYYY'),
      feeType: investmentType === 'fund' ? fundManagementFeeType : managementFeeType,
    };
  };

  const setupData = getSetupData();

  const getStepStatus = (step) => {
    const stepValue = step.value;
    let taskChecked = false;
    if (!dealTasks || !dealTasks.length) return false;

    const currentTask = dealTasks.find((task) =>
      step.processStreetTask.includes(task.taskName.toLowerCase()),
    );
    if (!currentTask) {
      // console.log(`Task "${step.processStreetTask}" not matching`)
      return false;
    }

    const hvpTask = dealTasks.find((task) => task.taskName.toLowerCase() === 'enter deal details');
    const hvpField = hvpTask.formFields?.find(
      (field) => field.fieldLabel.toLowerCase() === 'high volume partnership',
    );
    const tasksNeeded = dealTasks.filter((task) =>
      step.processStreetTask.includes(task.taskName.toLowerCase()),
    );
    const bothTasksApproved = tasksNeeded.every((task) => task.taskStatus === 'Completed');
    switch (stepValue) {
      case 'Entity Formation Complete':
        if (!hvpField) {
          taskChecked = false;
        } else if (hvpField.fieldValue === 'Yes') {
          taskChecked = currentTask.taskStatus === 'Completed';
        } else if (hvpField.fieldValue === 'No') {
          taskChecked = true;
        }
        break;
      case 'Wire Approval Review Complete':
        if (bothTasksApproved) {
          taskChecked = true;
        } else {
          taskChecked = false;
        }
        break;
      default:
        taskChecked = currentTask.taskStatus === 'Completed';
        break;
    }
    return taskChecked;
  };

  const stepsVerification = (steps) => {
    return steps.map((step) => {
      const checked = getStepStatus(step);
      return { ...step, checked };
    });
  };

  useEffect(() => {
    if (setupSteps) {
      const newSetupSteps = {};
      Object.keys(setupSteps).forEach((group) => {
        const verifiedData = stepsVerification(setupSteps[group]);
        newSetupSteps[group] = verifiedData;
      });
      setSetupSteps(newSetupSteps);
    }
  }, [dealTasks]);

  useEffect(() => {
    if (subscriptionData?.dealOnboarding) {
      const { dealOnboarding } = subscriptionData;
      // if dealOnboarding subscription type is a new task checked or unchecked
      if (dealOnboarding.taskName) {
        let stepSection = '';
        let stepIndex = -1;

        // set new tasks based on new subscription information
        if (dealTasks && dealTasks.length) {
          const dealTasksCopy = dealTasks.map((t) => t);
          const subsTaskIndex = dealTasksCopy.findIndex(
            (task) => task.taskId === dealOnboarding.taskId,
          );
          dealTasksCopy[subsTaskIndex] = dealOnboarding;
          setDealTasks(dealTasksCopy);
        }
        // get step index and section of step inside current setupSteps
        for (const section in setupSteps) {
          stepIndex = setupSteps[section].findIndex((step) =>
            step.processStreetTask.includes(dealOnboarding.taskName.toLowerCase()),
          );
          if (stepIndex >= 0) {
            stepSection = section;
            break;
          }
        }
        // set new setupSteps with updated task data
        if (stepIndex >= 0) {
          const setupStepsCopy = { ...setupSteps };
          const stepToUpdate = setupStepsCopy[stepSection][stepIndex];
          const checked = getStepStatus(stepToUpdate);
          stepToUpdate.checked = checked;
          setSetupSteps(setupStepsCopy);
        }
      } else if (dealOnboarding.dealName) {
        // if type of dealOnboarding subscription is a new run workflow
        const tasks = dealOnboarding?.dealTasks;
        if (tasks) setDealTasks(tasks);
      }
    }
  }, [subscriptionData]);

  if (!buildSteps || !preOnboardingSteps || !onboardingSteps || !closingSteps) return <Loader />;

  return (
    <Grid container spacing={1} className={classes.section}>
      <Grid container spacing={3} item xs={12} style={{ marginBottom: '0px' }}>
        <StepsContainer
          title="Build"
          steps={buildSteps}
          id="build"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          tooltipContent="The process of submitting a build request for an SPV / Fund"
          classes={classes}
        />
        <StepsContainer
          title="Pre-onboarding"
          steps={preOnboardingSteps}
          id="preOnboarding"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          tooltipContent="The setup process for an SPV / Fund"
          classes={classes}
        />
        <StepsContainer
          title="Onboarding Investors"
          steps={onboardingSteps}
          id="onboarding"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          tooltipContent="The process of onboarding investors and finalizing terms"
          classes={classes}
        />
        <StepsContainer
          title="Closing & Post-close"
          steps={closingSteps}
          id="closing"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          tooltipContent="The process of closing and post-closing the SPV / Fund"
          classes={classes}
        />
      </Grid>
      <Grid container spacing={3} item xs={12}>
        <Grid item xs={6} lg={4}>
          <SimpleBox
            size="third"
            title="Target Raise"
            handleTooltip={handleTooltip}
            openTooltip={openTooltip}
            id="target"
            tooltipContent={
              <Typography color="inherit">
                This is how much you plan to raise. This is important specifically for Funds as the
                target raise is material to the offering and its performance to investors.
              </Typography>
            }
          >
            <div className={classes.simpleBoxDataRow}>
              <Typography style={{ fontSize: '26px' }}>${nWithCommas(setupData.target)}</Typography>
            </div>
            <div className={classes.simpleBoxDataRow} style={{ margin: 0 }}>
              <LinearProgress
                variant="determinate"
                value={setupData.raisedPercentage}
                classes={{
                  root: classes.progressContainer,
                  colorPrimary: classes.progress,
                  bar: classes.bar,
                }}
              />
              <Typography>{setupData.raisedPercentage}%</Typography>
            </div>
          </SimpleBox>
        </Grid>
        <Grid item xs={6} lg={4}>
          <SimpleBox
            size="third"
            title="Next Close Date"
            handleTooltip={handleTooltip}
            openTooltip={openTooltip}
            id="nextClose"
            tooltipContent={
              <Typography color="inherit">
                This is the expected next close date for the offering
              </Typography>
            }
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon style={{ marginRight: '0.5em' }} />
                <Typography style={{ fontSize: '20px' }}>
                  {setupData.wireDeadline || 'No date available'}
                </Typography>
              </div>
            </div>
          </SimpleBox>
        </Grid>
        <Grid item xs={6} lg={4}>
          <SimpleBox
            size="third"
            title="Final Close Date"
            handleTooltip={handleTooltip}
            openTooltip={openTooltip}
            id="finalClose"
            tooltipContent={
              <Typography color="inherit">
                This is the expected final close date for the offering
              </Typography>
            }
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon style={{ marginRight: '0.5em' }} />
                <Typography style={{ fontSize: '20px' }}>
                  {setupData.signDeadline || 'No date available'}
                </Typography>
              </div>
            </div>
          </SimpleBox>
        </Grid>
        <Grid item xs={6} lg={4}>
          <SimpleBox
            size="third"
            title="Management Fee"
            handleTooltip={handleTooltip}
            openTooltip={openTooltip}
            id="managementFee"
            tooltipContent={
              <Typography color="inherit">
                This is the management fee chosen by the Fund Manager
              </Typography>
            }
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography style={{ fontSize: '26px' }}>
                  {setupData.managementFee ? setupData.managementFee : 'No Management Fee'}{' '}
                  {setupData.managementFee ? (
                    <span style={{ fontSize: '14px' }}>
                      {setupData.feeType
                        ? setupData.feeType === 'Annual'
                          ? 'per annum'
                          : setupData.feeType
                        : ''}
                    </span>
                  ) : (
                    ''
                  )}
                </Typography>
              </div>
            </div>
          </SimpleBox>
        </Grid>
        <Grid item xs={6} lg={4}>
          <SimpleBox
            size="third"
            title="Carry"
            handleTooltip={handleTooltip}
            openTooltip={openTooltip}
            id="carry"
            tooltipContent={
              <Typography color="inherit">
                This is the carry fee chosen by the Fund Manager
              </Typography>
            }
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography style={{ fontSize: '20px' }}>
                  {setupData.carry ? `${setupData.carry}%` : 'No carry'}
                </Typography>
              </div>
            </div>
          </SimpleBox>
        </Grid>
        <Grid item xs={6} lg={4}>
          <SimpleBox
            size="third"
            title="Raise Type"
            handleTooltip={handleTooltip}
            openTooltip={openTooltip}
            id="raiseType"
            tooltipContent={
              <Typography color="inherit">
                This is the offering type chosen by the Fund Manager
              </Typography>
            }
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography style={{ fontSize: '20px' }}>
                  {setupData.dealType || 'No raise type'}
                </Typography>
              </div>
            </div>
          </SimpleBox>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Setup;
