import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import allocationsIcon from '../../../../../../assets/allocations_bar_logo.svg';
import grayCheck from '../../../../../../assets/gray-check.svg';
import profile from '../../../../../../assets/profile-icon.svg';
import styles from '../../../styles.ts';

const CurrentStep = ({ classes, phase, task }) => {
  return (
    <Grid container className={classes.currentStepBody}>
      <div className={classes.stepTitleRow}>
        <img alt="gray check" src={grayCheck} />
        <Typography>
          {phase}: {task.title}
        </Typography>
        {task && (
          <div className={task.type.includes('process') ? classes.badgeBlue : classes.badgeGray}>
            <img
              alt="icon"
              src={task.type.includes('process') ? allocationsIcon : profile}
              style={{ height: '12px' }}
            />
            <span>{task.type.includes('process') ? 'For Allocations' : 'For You'}</span>
          </div>
        )}
      </div>
      <Typography style={{ fontSize: '12px', textAlign: 'left', width: '100%' }}>
        {task.description}
      </Typography>
    </Grid>
  );
};

export default withStyles(styles)(CurrentStep);
