/* eslint-disable no-undef */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import allocationsIcon from '../../../../../../../assets/for-allocations-icon.svg';
import forYouIcon from '../../../../../../../assets/for-you-icon.svg';
import grayCheck from '../../../../../../../assets/gray-check.svg';
import styles from '../../../../styles.ts';
import UploadDocs from '../UploadDocs';
import SignAgreementStep from '../SignAgreementStep';
import { capitalizePhaseName } from '../CompletedTasksList';

const defaultDesc =
  'An Allocations representative will be reaching out shortly to assist you in completing this step. If you have any questions, do not hesitate to contact support@allocations.com.';

const CurrentStep = ({ classes, phase, task, deal }) => {
  const isForFM = !task?.type?.includes('process');

  const isUploadDocumentTask = [
    'Upload Company Deck',
    'Upload Company Logo',
    'Upload Term Sheet',
    'Upload Fund Logo',
  ].includes(task?.title);
  const isAgreementSigner = task?.title?.includes('Sign Investment Agreement');

  return (
    <Grid container className={classes.currentStepBody}>
      <div className={classes.stepTitleRow}>
        <img alt="gray check" src={grayCheck} />
        <Typography>
          {phase &&
            `${capitalizePhaseName(phase.name)}: ${
              isUploadDocumentTask ? 'Upload Your Documents' : task?.title
            }`}
        </Typography>
        <img
          alt={isForFM ? 'for you icon' : 'allocations icon'}
          src={isForFM ? forYouIcon : allocationsIcon}
        />
      </div>

      {isAgreementSigner && <SignAgreementStep task={task} deal={deal} />}
      {isUploadDocumentTask && <UploadDocs phase={phase} dealType={deal?.type} />}
      {!isForFM && (
        <Typography style={{ fontSize: '12px', textAlign: 'left', width: '100%' }}>
          {defaultDesc}
        </Typography>
      )}
    </Grid>
  );
};

export default withStyles(styles)(CurrentStep);
