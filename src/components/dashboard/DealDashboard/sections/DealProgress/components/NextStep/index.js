import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import grayCheck from '../../../../../../../assets/gray-check.svg';
import allocationsIcon from '../../../../../../../assets/for-allocations-icon.svg';
import forYouIcon from '../../../../../../../assets/for-you-icon.svg';
import styles from '../../../../styles';

const NextStep = ({ classes, phase, task }) => {
  const forFM = !task?.type?.includes('process');
  const isUploadDocumentTask = [
    'Upload Company Deck',
    'Upload Company Logo',
    'Upload Term Sheet',
    'Upload Fund Logo',
  ].includes(task?.title);

  console.log(phase, 'PHASE');

  return (
    <Grid container className={classes.nextStepBody}>
      <div className={classes.stepTitleRow} style={{ padding: '0px' }}>
        <img alt="gray check" src={grayCheck} />
        {task?.title?.includes('User Acknowledged Complete') ? (
          <Typography>Finished!</Typography>
        ) : (
          <>
            <Typography>
              {phase && `${phase}:`} {isUploadDocumentTask ? 'Upload Your Documents' : task?.title}
            </Typography>
            <img
              alt={forFM ? 'for you icon' : 'allocations icon'}
              src={forFM ? forYouIcon : allocationsIcon}
            />
          </>
        )}
      </div>
    </Grid>
  );
};

export default withStyles(styles)(NextStep);
