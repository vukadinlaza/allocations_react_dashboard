import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import styles from '../styles';

// I moved this because adding the next functionality is going to make things messy

const ProgressBar = ({ classes, steps }) => {
  return (
    <Stepper alternativeLabel classes={{ root: classes.stepperContainer }}>
      {/* Need to pass props */}
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default withStyles(styles)(ProgressBar);
