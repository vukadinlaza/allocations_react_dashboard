import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import allocationsIcon from '../../../../../../assets/allocations_bar_logo.svg';
import grayCheck from '../../../../../../assets/gray-check.svg';
import profile from '../../../../../../assets/profile-icon.svg';
import styles from '../../../styles.ts';

const NextStep = ({ classes, data }) => {
  return (
    <Grid container className={classes.nextStepBody}>
      <div className={classes.stepTitleRow} style={{ padding: '0px' }}>
        <img alt="gray check" src={grayCheck} />
        <Typography>{data.title}</Typography>
        {data.tag && (
          <div className={data.tag.includes('You') ? classes.badgeGray : classes.badgeBlue}>
            <img
              alt="icon"
              src={data.tag.includes('You') ? profile : allocationsIcon}
              style={{ height: '12px' }}
            />
            <span>{data.tag}</span>
          </div>
        )}
      </div>
    </Grid>
  );
};

export default withStyles(styles)(NextStep);
