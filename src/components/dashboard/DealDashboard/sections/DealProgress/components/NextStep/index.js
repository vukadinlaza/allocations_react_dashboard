import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import grayCheck from '../../../../../../../assets/gray-check.svg';
import allocationsIcon from '../../../../../../../assets/for-allocations-icon.svg';
import forYouIcon from '../../../../../../../assets/for-you-icon.svg';
import styles from '../../../../styles.ts';

const NextStep = ({ classes, phase, task }) => {
  const forFM = !task?.type?.includes('process');

  return (
    <Grid container className={classes.nextStepBody}>
      <div className={classes.stepTitleRow} style={{ padding: '0px' }}>
        <img alt="gray check" src={grayCheck} />
        <Typography>
          {phase && `${phase}:`} {task?.title}
        </Typography>
        <img
          alt={forFM ? 'for you icon' : 'allocations icon'}
          src={forFM ? forYouIcon : allocationsIcon}
        />
      </div>
    </Grid>
  );
};

export default withStyles(styles)(NextStep);
