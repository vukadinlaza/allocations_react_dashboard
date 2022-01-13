import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import allocationsIcon from '../../../../../../../assets/for-allocations-icon.svg';
import forYouIcon from '../../../../../../../assets/for-you-icon.svg';
import grayCheck from '../../../../../../../assets/gray-check.svg';
import styles from '../../../../styles.ts';

const defaultDesc =
  'An Allocations representative will be reaching out shortly to assist you in completing this step. If you have any questions, do not hesitate to contact support@allocations.com.';

const CurrentStep = ({ classes, phase, task }) => {
  const forFM = !task?.type?.includes('process');
  return (
    <Grid container className={classes.currentStepBody}>
      <div className={classes.stepTitleRow}>
        <img alt="gray check" src={grayCheck} />
        <Typography>
          {phase && `${phase}:`} {task?.title}
        </Typography>
        <img
          alt={forFM ? 'for you icon' : 'allocations icon'}
          src={forFM ? forYouIcon : allocationsIcon}
        />
      </div>

      <Typography style={{ fontSize: '12px', textAlign: 'left', width: '100%' }}>
        {forFM ? 'Something else happens' : defaultDesc}
      </Typography>
    </Grid>
  );
};

export default withStyles(styles)(CurrentStep);
