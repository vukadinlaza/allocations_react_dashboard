import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Typography, LinearProgress, Grid } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import EditIcon from '@material-ui/icons/Edit';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { get, every } from 'lodash';
import Loader from '../../../utils/Loader';
import { nWithCommas } from '../../../../utils/numbers';
import { SimpleBox, ModalTooltip } from '../widgets';
import { dealSteps } from './dealSteps'


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
  const [setupSteps, setSetupSteps] = useState(dealSteps)
  const { buildSteps, preOnboardingSteps, onboardingSteps, closingSteps } = setupSteps;

  useEffect(() => {
    const tasks = data?.dealOnboarding?.dealTasks;
    if(tasks) setDealTasks(tasks)
  }, [data])


  const getManagementFee = () => {
    const managementFee = investmentType === 'fund' ? fundManagementFees : managementFees;
    const managementFeeDollar = investmentType === 'fund' ? fundManagementFeesDollar : managementFeesDollar;
    const feeType = investmentType === 'fund' ? fundManagementFeeType : managementFeeType;
    if ((managementFee || managementFee === "0") && feeType === 'percentage') {
      return `${managementFee}%`;
    }else if (managementFeeDollar?.length > 0) {
      return `$${managementFeeDollar}`;
    }
  };

  const getCarry = () => {
    return investmentType === 'fund' ? fundTotalCarry : totalCarry;
  };

  const getRaisedPercentage = () => {
    const isRaisedANumber = raised && !isNaN(raised);
    const isTargetANumber = target && !isNaN(target);
    return isTargetANumber && isRaisedANumber ? Math.round((raised / target) * 100) : 0;
  };

  const getSetupData = () => {
    const raisedPercentage = getRaisedPercentage();
    const managementFee = getManagementFee();
    const carry = getCarry();

    return {
      target,
      raisedPercentage,
      wireDeadline: moment(wireDeadline).format('MMMM Do, YYYY'),
      signDeadline: moment(signDeadline).format('MMMM Do, YYYY'),
      managementFee,
      carry,
      dealType,
    };
  };

  const setupData = getSetupData();

  const getStepStatus = (step) => {
    const stepValue = step.value;
    let taskChecked = false;
    if(!dealTasks || !dealTasks.length) return false;
    
    const currentTask = dealTasks.find(task => step.processStreetTask.includes(task.taskName.toLowerCase()));
    if(!currentTask){
      console.log(`Task "${step.processStreetTask}" not matching`)
      return false;
    }

    switch (stepValue) {
      case 'Entity Formation Complete':
        const hvpField = currentTask.formFields?.find(field => field.fieldLabel.toLowerCase() === 'high volume partnership');
        if(!hvpField){
          taskChecked = false;
        }else if(hvpField.fieldValue === 'Yes'){
          taskChecked = currentTask.taskStatus === 'Completed'
        }else if(hvpField.fieldValue === 'No'){
          taskChecked = true;
        }
        break;
      default:
        taskChecked = currentTask.taskStatus === 'Completed'
        break;
    }
    return taskChecked;
  }

  const stepsVerification = (steps) => {
    return steps.map((step) => {
      const checked = getStepStatus(step)
      return { ...step, checked };
    });
  }

  useEffect(() => {
    if(setupSteps){
      let newSetupSteps = {};
      Object.keys(setupSteps).forEach(group => {
        const verifiedData = stepsVerification(setupSteps[group]);
        newSetupSteps[group] = verifiedData;
      });
      setSetupSteps(newSetupSteps)
    }
  }, [dealTasks])

  useEffect(() => {
    if(subscriptionData?.dealOnboarding){
      const { dealOnboarding: subscriptionTask} = subscriptionData;
      let stepSection = '';
      let stepIndex = -1;

      for(let section in setupSteps){
        stepIndex = setupSteps[section].findIndex(step => step.processStreetTask.includes(subscriptionTask.taskName.toLowerCase()));
        if(stepIndex >= 0){
          stepSection = section;
          break;
        }
      }
      if(stepIndex >= 0){
        const setupStepsCopy = Object.assign({}, setupSteps);
        const stepToUpdate = setupStepsCopy[stepSection][stepIndex];
        const checked = getStepStatus(stepToUpdate);
        stepToUpdate.checked = checked;
        setSetupSteps(setupStepsCopy);
      }
    }
  }, [subscriptionData])

  if(!buildSteps || !preOnboardingSteps || !onboardingSteps || !closingSteps) return <Loader/>

  return (
    <Grid container spacing={1} className={classes.section}>
      <Grid container spacing={3} item xs={12} style={{marginBottom: "0px"}}>
        <Grid item xs={6} lg={3} style={{height: "auto"}}>
          <SimpleBox
            title="Build"
            titleData={
              <CheckCircleIcon
                style={{ color: '#39C522', opacity: every(buildSteps, { checked: true }) ? '100%' : '25%' }}
              />
            }
            autoHeight
            size="fourth"
            fullWidthContent
            openTooltip={openTooltip}
            handleTooltip={handleTooltip}
            id="build"
            tooltipContent={
              <Typography color="inherit">The process of submitting a build request for an SPV / Fund</Typography>
            }
          >
            {buildSteps.map((step, idx) => {
              return(
                <ModalTooltip
                  title={step.value}
                  handleTooltip={handleTooltip}
                  tooltipContent={<Typography color="inherit">{step.tooltip}</Typography>}
                  openTooltip={openTooltip}
                  id={step.value.split(' ').join()}
                  key={`step-${idx}`}
                >
                  <div className={classes.setupStep} onClick={(e) => handleTooltip(step.value.split(' ').join())}>
                    <CheckCircleIcon
                      style={{ color: '#0461FF', opacity: step.checked ? '100%' : '25%', marginRight: '0.5em' }}
                      id={`check-${step.value.split(' ').join()}`}
                    />
                    <Typography>{step.value}</Typography>
                  </div>
                </ModalTooltip>
              )
            })}
          </SimpleBox>
        </Grid>
        <Grid item xs={6} lg={3} style={{height: "auto"}}>
          <SimpleBox
            title="Pre-onboarding"
            titleData={
              <CheckCircleIcon
                style={{
                  color: '#39C522',
                  opacity: every(preOnboardingSteps, { checked: true }) ? '100%' : '25%',
                }}
              />
            }
            autoHeight
            size="fourth"
            fullWidthContent
            handleTooltip={handleTooltip}
            openTooltip={openTooltip}
            id="preOnboarding"
            tooltipContent={<Typography color="inherit">The setup process for an SPV / Fund</Typography>}
          >
            {preOnboardingSteps.map((step, idx) => (
              <ModalTooltip
                title={step.value}
                handleTooltip={handleTooltip}
                tooltipContent={<Typography color="inherit">{step.tooltip}</Typography>}
                openTooltip={openTooltip}
                id={step.value.split(' ').join()}
                key={`step-${idx}`}
              >
                <div className={classes.setupStep} onClick={(e) => handleTooltip(step.value.split(' ').join())}>
                  <CheckCircleIcon
                    style={{ color: '#0461FF', opacity: step.checked ? '100%' : '25%', marginRight: '0.5em' }}
                    id={`check-${step.value.split(' ').join()}`}
                  />
                  <Typography>{step.value}</Typography>
                </div>
              </ModalTooltip>
            ))}
          </SimpleBox>
        </Grid>
        <Grid item xs={6} lg={3} style={{height: "auto"}}>
          <SimpleBox
            title="Onboarding Investors"
            titleData={
              <CheckCircleIcon
                style={{ color: '#39C522', opacity: every(onboardingSteps, { checked: true }) ? '100%' : '25%' }}
              />
            }
            autoHeight
            size="fourth"
            fullWidthContent
            handleTooltip={handleTooltip}
            openTooltip={openTooltip}
            id="onboarding"
            tooltipContent={
              <Typography color="inherit">The process of onboarding investors and finalizing terms</Typography>
            }
          >
            {onboardingSteps.map((step, idx) => (
              <ModalTooltip
                title={step.value}
                handleTooltip={handleTooltip}
                tooltipContent={<Typography color="inherit">{step.tooltip}</Typography>}
                openTooltip={openTooltip}
                id={step.value.split(' ').join()}
                key={`step-${idx}`}
              >
                <div className={classes.setupStep} onClick={(e) => handleTooltip(step.value.split(' ').join())}>
                  <CheckCircleIcon
                    style={{ color: '#0461FF', opacity: step.checked ? '100%' : '25%', marginRight: '0.5em' }}
                    id={`check-${step.value.split(' ').join()}`}
                  />
                  <Typography>{step.value}</Typography>
                </div>
              </ModalTooltip>
            ))}
          </SimpleBox>
        </Grid>
        <Grid item xs={6} lg={3} style={{height: "auto"}}>
          <SimpleBox
            title="Closing & Post-close"
            titleData={
              <CheckCircleIcon
                style={{ color: '#39C522', opacity: every(closingSteps, { checked: true }) ? '100%' : '25%' }}
              />
            }
            autoHeight
            size="fourth"
            fullWidthContent
            handleTooltip={handleTooltip}
            openTooltip={openTooltip}
            id="closing"
            tooltipContent={
              <Typography color="inherit">The process of closing and post-closing the SPV / Fund</Typography>
            }
          >
            {closingSteps.map((step, idx) => (
              <ModalTooltip
                title={step.value}
                handleTooltip={handleTooltip}
                tooltipContent={<Typography color="inherit">{step.tooltip}</Typography>}
                openTooltip={openTooltip}
                id={step.value.split(' ').join()}
                key={`step-${idx}`}
              >
                <div className={classes.setupStep} onClick={(e) => handleTooltip(step.value.split(' ').join())}>
                  <CheckCircleIcon
                    style={{ color: '#0461FF', opacity: step.checked ? '100%' : '25%', marginRight: '0.5em' }}
                    id={`check-${step.value.split(' ').join()}`}
                  />
                  <Typography>{step.value}</Typography>
                </div>
              </ModalTooltip>
            ))}
          </SimpleBox>
        </Grid>
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
                This is how much you plan to raise. This is important specifically for Funds as the target raise is material
                to the offering and its performance to investors.
              </Typography>
            }
          >
            <div className={classes.simpleBoxDataRow}>
              <Typography style={{ fontSize: '26px' }}>${nWithCommas(setupData.target)}</Typography>
              {/* <div className={classes.boxEditButton}><EditIcon/></div> */}
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
            tooltipContent={<Typography color="inherit">This is the expected next close date for the offering</Typography>}
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon style={{ marginRight: '0.5em' }} />
                <Typography style={{ fontSize: '20px' }}>{setupData.wireDeadline || 'No date available'}</Typography>
              </div>
              {/* <div className={classes.boxEditButton}><EditIcon/></div> */}
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
            tooltipContent={<Typography color="inherit">This is the expected final close date for the offering</Typography>}
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon style={{ marginRight: '0.5em' }} />
                <Typography style={{ fontSize: '20px' }}>{setupData.signDeadline || 'No date available'}</Typography>
              </div>
              {/* <div className={classes.boxEditButton}><EditIcon/></div> */}
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
            tooltipContent={<Typography color="inherit">This is the management fee chosen by the Fund Manager</Typography>}
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography style={{ fontSize: '26px' }}>
                  {setupData.managementFee ? setupData.managementFee : 'No Management Fee'}{' '}
                  {setupData.managementFee ? <span style={{ fontSize: '14px' }}>per annum</span> : ''}
                </Typography>
                {/* <ExpandMoreIcon style={{marginLeft: "0.5em"}}/> */}
              </div>
              {/* <div className={classes.boxEditButton}><EditIcon/></div> */}
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
            tooltipContent={<Typography color="inherit">This is the carry fee chosen by the Fund Manager</Typography>}
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography style={{ fontSize: '20px' }}>{setupData.carry ? `${setupData.carry}%` : 'No carry'}</Typography>
              </div>
              {/* <div className={classes.boxEditButton}><EditIcon/></div> */}
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
            tooltipContent={<Typography color="inherit">This is the offering type chosen by the Fund Manager</Typography>}
          >
            <div className={classes.simpleBoxDataRow}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography style={{ fontSize: '20px' }}>{setupData.dealType || 'No raise type'}</Typography>
              </div>
              {/* <div className={classes.boxEditButton}><EditIcon/></div> */}
            </div>
          </SimpleBox>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Setup;
