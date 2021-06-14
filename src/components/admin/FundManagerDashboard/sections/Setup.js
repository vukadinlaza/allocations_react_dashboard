import React from 'react';
import { Typography, LinearProgress } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { SimpleBox } from '../widgets'

const buildSteps = ['Initial Build', 'Term Sheet', 'Deck', 'Services Agreement', 'Investor Onboarding List Provided', 'Portfolio Company Wire Instructions', 'Identification'];
const preOnboardingSteps = ['Entity', 'Bank Account', 'Pre-Sign Private Fund Docs'];
const onboardingSteps = ['Investor Onboarding List Provided', 'Onboarding Email Sent', 'Investor Follow Up Sent', 'Blue Sky Fees Finalized', '506c Review', 'KYC Review', 'Invoice Sent']
const closingSteps = ['Investor Ledger Reconciliation', 'Blue Sky Fees Review', 'Signing Portfolio Company Documents', 'Wire Approval Review', 'Invoice Copy Sent', 'Reg D Filing']

const Setup = ({ classes }) => {
  return (
    <div className={classes.section}>
      <div className={classes.subSection}>
        <SimpleBox
          title="Build"
          titleData={<CheckCircleIcon style={{color: "#39C522", opacity: "25%"}}/>}
          autoHeight={true}
          size="fourth"
          info="Explanation"
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
          info="Explanation"
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
          info="Explanation"
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
          info="Explanation"
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
      <SimpleBox size="third" title="Target Raise" info="Explanation">
        <div className={classes.simpleBoxDataRow}>
          <Typography style={{fontSize: "26px"}}>$5,000,000</Typography>
          <div className={classes.boxEditButton}><EditIcon/></div>
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
      <SimpleBox size="third" title="Next Close Date" info="Explanation">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <CalendarTodayIcon style={{marginRight: "0.5em"}}/>
            <Typography style={{fontSize: "20px"}}>June 15th, 2021</Typography>
          </div>
          <div className={classes.boxEditButton}><EditIcon/></div>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Final Close Date" info="Explanation">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <CalendarTodayIcon style={{marginRight: "0.5em"}}/>
            <Typography style={{fontSize: "20px"}}>June 15th, 2021</Typography>
          </div>
          <div className={classes.boxEditButton}><EditIcon/></div>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Management Fee" info="Explanation">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography style={{fontSize: "26px"}}>2% <span style={{fontSize: "14px"}}>per annum</span></Typography>
            <ExpandMoreIcon style={{marginLeft: "0.5em"}}/>
          </div>
          <div className={classes.boxEditButton}><EditIcon/></div>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Carry" info="Explanation">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography style={{fontSize: "20px"}}>20%</Typography>
          </div>
          <div className={classes.boxEditButton}><EditIcon/></div>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Raise Type" info="Explanation">
        <div className={classes.simpleBoxDataRow}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography style={{fontSize: "20px"}}>506c</Typography>
          </div>
          <div className={classes.boxEditButton}><EditIcon/></div>
        </div>
      </SimpleBox>
    </div>
  );
}

export default Setup;
