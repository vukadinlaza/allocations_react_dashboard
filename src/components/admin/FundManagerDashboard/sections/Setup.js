import React from 'react';
import { Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { SimpleBox } from '../widgets'

const buildSteps = ['Initial Build', 'Term Sheet', 'Deck', 'Services Agreement', 'Investor Onboarding List Provided', 'Portfolio Company Wire Instructions', 'Identification'];
const preOnboardingSteps = ['Entity', 'Bank Account', 'Pre-Sign Private Fund Docs'];
const onboardingSteps = ['Investor Onboarding List Provided', 'Onboarding Email Sent', 'Investor Follow Up Sent', 'Blue Sky Fees Finalized', '506c Review', 'KYC Review', 'Invoice Sent']

const Setup = ({ classes }) => {
  return (
    <div className={classes.section}>
      <div className={classes.subSection}>
        <SimpleBox
          title="Build"
          titleData={<CheckCircleIcon style={{color: "#39C522", opacity: "25%"}}/>}
          autoHeight={true}
          size="third"
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
          size="third"
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
          size="third"
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
      </div>
      <SimpleBox size="third" title="Target Raise" info="Explanation">Child</SimpleBox>
      <SimpleBox size="third" title="Next Close Date" info="Explanation">Child</SimpleBox>
      <SimpleBox size="third" title="Final Close Date" info="Explanation">Child</SimpleBox>
      <SimpleBox size="third" title="Management Fee" info="Explanation">Child</SimpleBox>
      <SimpleBox size="third" title="Carry" info="Explanation">Child</SimpleBox>
      <SimpleBox size="third" title="Raise Type" info="Explanation">Child</SimpleBox>
    </div>
  );
}

export default Setup;
