import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import styles from '../../../../styles.ts';

const ProgressBar = ({ classes, steps, activeStep }) => {
  // activeStep needs to be a number. the index of the step

  return (
    <Stepper alternativeLabel classes={{ root: classes.stepperContainer }} activeStep={activeStep}>
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default withStyles(styles)(ProgressBar);
