import React from 'react';
import moment from 'moment'
import { Typography, LinearProgress } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Loader from '../../../utils/Loader'
import { nWithCommas } from '../../../../utils/numbers'

import { SimpleBox } from '../widgets'

const buildSteps = ['Initial Build', 'Services Agreement Signed', 'ID', 'Investment Docs', 'Portfolio Company Deck'];
const preOnboardingSteps = ['SS4 Signature', 'Entity Formation', 'Bank Account', 'Private Fund Docs Review & Signing'];
const onboardingSteps = ['Investor Onboarding List Provided', 'Carry & Management Fee Review', 'Onboarding Email Sent', 'Investor Follow Up Sent', '506b/c Review', 'KYC Review']
const closingSteps = ['Portfolio Company Wire Instructions', 'Investor Ledger Reconciliation', 'Blue Sky Fees Review', 'Signing Portfolio Company Documents', 'Wire Approval Review', 'Invoice Receipt Sent', 'Reg D Filing', 'Management Fee Distribution']

const Setup = ({ classes, data, openTooltip, handleTooltip }) => {

  if(!data) return <Loader/>

  const { target, raised, dealParams, investmentType } = data;
  const { signDeadline, wireDeadline, dealType, totalCarry, fundTotalCarry, totalManagementFee, managementFeesDollar, fundManagementFeesDollar, fundManagementFees, managementFeeType, fundManagementFeeType } = dealParams;


  const getManagementFee = () => {
    const managementFees = investmentType === 'fund'? fundManagementFees : totalManagementFee;
    const managementFeeDollar = investmentType === 'fund'? fundManagementFeesDollar : managementFeesDollar;
    const feeType = investmentType === 'fund'? fundManagementFeeType : managementFeeType;

    if (managementFees?.length > 0 && feeType === 'percentage') {
      return `${managementFees}%`;
    }else if (managementFeeDollar?.length > 0 && feeType === 'fixed') {
      return `$${managementFeeDollar}`;
    }
  };


  const getCarry = () => {
    return investmentType === 'fund'? fundTotalCarry : totalCarry;
  }

  const getRaisedPercentage = () => {
    const isRaisedANumber = raised && !isNaN(raised);
    const isTargetANumber = target && !isNaN(target)
    return  isTargetANumber && isRaisedANumber? Math.round((raised/target) * 100) : 0;
  }


  const getSetupData = () => {
    const raisedPercentage = getRaisedPercentage();
    const managementFee = getManagementFee()
    const carry = getCarry()

    return {
      target,
      raisedPercentage,
      wireDeadline: moment(wireDeadline).format('MMMM Do, YYYY'),
      signDeadline: moment(signDeadline).format('MMMM Do, YYYY'),
      managementFee,
      carry,
      dealType
    }
  }

  const setupData = getSetupData()
  return (
    <div className={classes.section}>
      <div className={classes.subSection}>
        <SimpleBox
          title="Build"
          titleData={<CheckCircleIcon style={{color: "#39C522", opacity: "25%"}}/>}
          autoHeight={true}
          size="fourth"
          fullWidthContent
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="build"
          tooltipContent={<Typography color="inherit" >The process of submitting a build request for an SPV / Fund</Typography>}
          >
          {buildSteps.map((step, idx) =>
            <div className={classes.setupStep} key={`step-${idx}`}>
              <CheckCircleIcon style={{color: "#0461FF", opacity: "25%", marginRight: "0.5em"}}/>
              <Typography>{step}</Typography>
            </div>
          )}
        </SimpleBox>
        <SimpleBox
          title="Pre-onboarding"
          titleData={<CheckCircleIcon style={{color: "#39C522", opacity: "25%"}}/>}
          autoHeight={true}
          size="fourth"
          fullWidthContent
          handleTooltip={handleTooltip}
          openTooltip={openTooltip}
          id="preOnboarding"
          tooltipContent={<Typography color="inherit" >The setup process for an SPV / Fund</Typography>}
          >
          {preOnboardingSteps.map((step, idx) =>
            <div className={classes.setupStep} key={`step-${idx}`}>
              <CheckCircleIcon style={{color: "#0461FF", opacity: "25%", marginRight: "0.5em"}}/>
              <Typography>{step}</Typography>
            </div>
          )}
        </SimpleBox>
        <SimpleBox
          title="Onboarding Investors"
          titleData={<CheckCircleIcon style={{color: "#39C522", opacity: "25%"}}/>}
          autoHeight={true}
          size="fourth"
          fullWidthContent
          handleTooltip={handleTooltip}
          openTooltip={openTooltip}
          id="onboarding"
          tooltipContent={<Typography color="inherit" >The process of onboarding investors and finalizing terms</Typography>}
          >
          {onboardingSteps.map((step, idx) =>
            <div className={classes.setupStep} key={`step-${idx}`}>
              <CheckCircleIcon style={{color: "#0461FF", opacity: "25%", marginRight: "0.5em"}}/>
              <Typography>{step}</Typography>
            </div>
          )}
        </SimpleBox>
        <SimpleBox
          title="Closing & Post-close"
          titleData={<CheckCircleIcon style={{color: "#39C522", opacity: "25%"}}/>}
          autoHeight={true}
          size="fourth"
          fullWidthContent
          handleTooltip={handleTooltip}
          openTooltip={openTooltip}
          id="closing"
          tooltipContent={<Typography color="inherit" >The process of closing and post-closing the SPV / Fund</Typography>}
          >
          {closingSteps.map((step, idx) =>
            <div className={classes.setupStep} key={`step-${idx}`}>
              <CheckCircleIcon style={{color: "#0461FF", opacity: "25%", marginRight: "0.5em"}}/>
              <Typography>{step}</Typography>
            </div>
          )}
        </SimpleBox>
      </div>
      <SimpleBox
        size="third"
        title="Target Raise"
        handleTooltip={handleTooltip}
        openTooltip={openTooltip}
        id="target"
        tooltipContent={<Typography color="inherit" >This is how much you plan to raise. This is important specifically for Funds as the target raise is material to the offering and its performance to investors.</Typography>}
        >
        <div className={classes.simpleBoxDataRow}>
          <Typography style={{fontSize: "26px"}}>${nWithCommas(setupData.target)}</Typography>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
        <div className={classes.simpleBoxDataRow} style={{margin: 0}}>
          <LinearProgress
            variant="determinate"
            value={setupData.raisedPercentage}
            classes={{
              root: classes.progressContainer,
              colorPrimary: classes.progress,
              bar: classes.bar
            }}
            />
          <Typography>{setupData.raisedPercentage}%</Typography>
        </div>
      </SimpleBox>
      <SimpleBox
        size="third"
        title="Next Close Date"
        handleTooltip={handleTooltip}
        openTooltip={openTooltip}
        id="nextClose"
        tooltipContent={<Typography color="inherit" >This is the expected next close date for the offering</Typography>}
        >
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <CalendarTodayIcon style={{marginRight: "0.5em"}}/>
            <Typography style={{fontSize: "20px"}}>{setupData.wireDeadline || 'No date available'}</Typography>
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
      <SimpleBox
        size="third"
        title="Final Close Date"
        handleTooltip={handleTooltip}
        openTooltip={openTooltip}
        id="finalClose"
        tooltipContent={<Typography color="inherit" >This is the expected final close date for the offering</Typography>}
        >
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <CalendarTodayIcon style={{marginRight: "0.5em"}}/>
            <Typography style={{fontSize: "20px"}}>{setupData.signDeadline || 'No date available'}</Typography>
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
      <SimpleBox
        size="third"
        title="Management Fee"
        handleTooltip={handleTooltip}
        openTooltip={openTooltip}
        id="managementFee"
        tooltipContent={<Typography color="inherit" >This is the management fee chosen by the Fund Manager</Typography>}
        >
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography style={{fontSize: "26px"}}>{setupData.managementFee? setupData.managementFee : 'No Management Fee'} {setupData.managementFee? <span style={{fontSize: "14px"}}>per annum</span> : ''}</Typography>
            {/*<ExpandMoreIcon style={{marginLeft: "0.5em"}}/>*/}
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
      <SimpleBox
        size="third"
        title="Carry"
        handleTooltip={handleTooltip}
        openTooltip={openTooltip}
        id="carry"
        tooltipContent={<Typography color="inherit" >This is the carry fee chosen by the Fund Manager</Typography>}
        >
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography style={{fontSize: "20px"}}>{setupData.carry? `${setupData.carry}%` : 'No carry'}</Typography>
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
      <SimpleBox
        size="third"
        title="Raise Type"
        handleTooltip={handleTooltip}
        openTooltip={openTooltip}
        id="raiseType"
        tooltipContent={<Typography color="inherit" >This is the offering type chosen by the Fund Manager</Typography>}
        >
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography style={{fontSize: "20px"}}>{setupData.dealType || 'No raise type'}</Typography>
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
    </div>
  );
}

export default Setup;
