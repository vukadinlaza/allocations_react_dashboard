import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import allocationsIcon from '../../../../../../../assets/allocations_bar_logo.svg';
import grayCheck from '../../../../../../../assets/gray-check.svg';
import profile from '../../../../../../../assets/profile-icon.svg';
import styles from '../../../../styles.ts';
import UploadDocs from '../UploadDocs';

const defaultDesc =
  'An Allocations representative will be reaching out shortly to assist you in completing this step. If you have any questions, do not hesitate to contact support@allocations.com.';

const CurrentStep = ({ classes, phase, task, dealType }) => {
  const forFM = !task?.type?.includes('process');

  const isUploadDocumentTask = [
    'Upload Company Deck',
    'Upload Company Logo',
    'Upload Term Sheet',
    'Upload Fund Logo',
  ].includes(task?.title);

  return (
    <Grid container className={classes.currentStepBody}>
      <div className={classes.stepTitleRow}>
        <img alt="gray check" src={grayCheck} />
        <Typography>
          {phase && `${phase.name}:`} {task?.title}
        </Typography>
        <div className={forFM ? classes.badgeGray : classes.badgeBlue}>
          <img alt="icon" src={forFM ? profile : allocationsIcon} style={{ height: '12px' }} />
          <span>{forFM ? 'For You' : 'For Allocations'}</span>
        </div>
      </div>

      <Typography style={{ fontSize: '12px', textAlign: 'left', width: '100%' }}>
        {isUploadDocumentTask && <UploadDocs phase={phase} dealType={dealType} />}
        {forFM ? 'Something else happens' : defaultDesc}
      </Typography>
    </Grid>
  );
};

export default withStyles(styles)(CurrentStep);
