import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import allocationsIcon from '../../../../../../assets/allocations_bar_logo.svg';
import grayCheck from '../../../../../../assets/gray-check.svg';
import profile from '../../../../../../assets/profile-icon.svg';
import styles from '../../../styles.ts';

const NextStep = ({ classes, task }) => {
  const forFM = !task?.type?.includes('process');

  return (
    <Grid container className={classes.nextStepBody}>
      <div className={classes.stepTitleRow} style={{ padding: '0px' }}>
        <img alt="gray check" src={grayCheck} />
        <Typography>{task.title}</Typography>
        <div className={forFM ? classes.badgeGray : classes.badgeBlue}>
          <img alt="icon" src={forFM ? profile : allocationsIcon} style={{ height: '12px' }} />
          <span>{forFM ? 'For You' : 'For Allocations'}</span>
        </div>
      </div>
    </Grid>
  );
};

export default withStyles(styles)(NextStep);
