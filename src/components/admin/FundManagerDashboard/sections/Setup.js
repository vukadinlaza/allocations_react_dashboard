import React from 'react';
import { Typography, LinearProgress } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import { SimpleBox } from '../widgets'

const buildSteps = ['Initial Build', 'Services Agreement Signed', 'ID', 'Investment Docs', 'Portfolio Company Deck'];
const preOnboardingSteps = ['SS4 Signature', 'Entity Formation', 'Bank Account', 'Private Fund Docs Review & Signing'];
const onboardingSteps = ['Investor Onboarding List Provided', 'Carry & Management Fee Review', 'Onboarding Email Sent', 'Investor Follow Up Sent', '506b/c Review', 'KYC Review']
const closingSteps = ['Portfolio Company Wire Instructions', 'Investor Ledger Reconciliation', 'Blue Sky Fees Review', 'Signing Portfolio Company Documents', 'Wire Approval Review', 'Invoice Receipt Sent', 'Reg D Filing', 'Management Fee Distribution']

const Setup = ({ classes }) => {
  return (
    <div className={classes.section}>
      <div className={classes.subSection}>
        <SimpleBox
          title="Build"
          titleData={<CheckCircleIcon style={{color: "#39C522", opacity: "25%"}}/>}
          autoHeight={true}
          size="fourth"
          info="The process of submitting a build request for an SPV / Fund"
          fullWidthContent
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
          info="The setup process for an SPV / Fund"
          fullWidthContent
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
          info="The process of onboarding investors and finalizing terms"
          fullWidthContent
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
          info="The process of closing and post-closing the SPV / Fund "
          fullWidthContent
          >
          {closingSteps.map((step, idx) =>
            <div className={classes.setupStep} key={`step-${idx}`}>
              <CheckCircleIcon style={{color: "#0461FF", opacity: "25%", marginRight: "0.5em"}}/>
              <Typography>{step}</Typography>
            </div>
          )}
        </SimpleBox>
      </div>
      <SimpleBox size="third" title="Target Raise" info="This is how much you plan to raise. This is important specifically for Funds as the target raise is material to the offering and its performance to investors.">
        <div className={classes.simpleBoxDataRow}>
          <Typography style={{fontSize: "26px"}}>$5,000,000</Typography>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
        <div className={classes.simpleBoxDataRow} style={{margin: 0}}>
          <LinearProgress
            variant="determinate"
            value={50}
            classes={{
              root: classes.progressContainer,
              colorPrimary: classes.progress,
              bar: classes.bar
            }}
            />
          <Typography>50%</Typography>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Next Close Date" info="This is the expected next close date for the offering">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <CalendarTodayIcon style={{marginRight: "0.5em"}}/>
            <Typography style={{fontSize: "20px"}}>June 15th, 2021</Typography>
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Final Close Date" info="This is the expected final close date for the offering">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <CalendarTodayIcon style={{marginRight: "0.5em"}}/>
            <Typography style={{fontSize: "20px"}}>June 15th, 2021</Typography>
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Management Fee" info="This is the management fee chosen by the Fund Manager">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography style={{fontSize: "26px"}}>2% <span style={{fontSize: "14px"}}>per annum</span></Typography>
            {/*<ExpandMoreIcon style={{marginLeft: "0.5em"}}/>*/}
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Carry" info="This is the carry fee chosen by the Fund Manager">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography style={{fontSize: "20px"}}>20%</Typography>
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Raise Type" info="This is the offering type chosen by the Fund Manager">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography style={{fontSize: "20px"}}>506c</Typography>
          </div>
          {/*<div className={classes.boxEditButton}><EditIcon/></div>*/}
        </div>
      </SimpleBox>
    </div>
  );
}

export default Setup;
