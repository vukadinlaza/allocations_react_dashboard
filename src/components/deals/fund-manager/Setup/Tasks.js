import React, { useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Grid, Typography, Button, TextField, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import Loader from '../../../utils/Loader';
import { DocumentBox, UploadBox } from '../../../common/common';
import pmButton from '../../../../assets/parallel-button.svg';
import styles from './styles';

export const taskTypes = {
  docUpload: ['fm-document-upload', 'admin-document-upload'],
  userTask: ['fm-document-signature'],
  review: ['admin-review'],
  text: ['admin-info', 'fm-info'],
  automaticTasks: ['service'],
};

export const TextTask = withStyles(styles)(
  ({ task, handleChange, taskData, handleUploadDeal, classes }) => {
    const taskFields = task.metadata.collect.map((field, i) => {
      return (
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          justify="center"
          className={classes.taskContainer}
        >
          <Grid item sm={12} lg={12} key={`field-${i}`} style={{ minWidth: '90%', width: '100%' }}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <Typography className={classes.subTaskTitle}>
                {_.startCase(_.camelCase(field.key))}
              </Typography>
              <TextField
                value={taskData[field.key] || ''}
                onChange={handleChange(field.key)}
                fullWidth
                className={classes.textField}
              />
            </FormControl>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleUploadDeal}
            style={{ margin: '0 0 10px 0' }}
          >
            Save
          </Button>
          <Typography className={classes.taskLastUpdated}>
            Last updated on
            {` ${moment(task.updated_at).format('MM/DD/YY')}`}
          </Typography>
        </Grid>
      );
    });
    return <>{taskFields}</>;
  },
);

export const DocumentUploadTask = withStyles(styles)(
  ({
    task,
    deal_id,
    addDoc,
    phase,
    setTaskLoading,
    gettingTaskData,
    setGettingTaskData,
    documentData,
    getDocument,
    deleteDoc,
    classes,
  }) => {
    const [addDoc] = useMutation(ADD_DOC, {
      onCompleted: () => {
        setSnackbarData({
          type: 'success',
          message: 'Success! Document uploaded.',
        });
        setTimeout(() => {
          // RefetchDeal gets triggered before the phase can be updated. TODO: Find better solution instead of setTimeout
          refetchDeal();
          getDocument({ variables: { task_id: task._id } });
        }, 3000);
      },
    });
    useEffect(() => {
      setGettingTaskData(true);
      getDocument({ variables: { task_id: task._id } });
    }, [task._id]);

    if (gettingTaskData) {
      return (
        <div style={{ margin: '30px 0' }}>
          <Loader />
        </div>
      );
    }

    return (
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justify="center"
        className={classes.taskContainer}
      >
        <Typography className={classes.subTaskTitle}>{` ${task.title}`}</Typography>
        <Grid
          item
          sm={12}
          lg={12}
          style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}
        >
          {_.get(documentData, 'link') ? (
            <div style={{ position: 'relative', marginTop: '10px', width: '100%' }}>
              <CancelIcon
                className={classes.cancelIcon}
                onClick={() => {
                  setTaskLoading(true);
                  deleteDoc({
                    variables: {
                      document_id: documentData._id,
                      task_id: task._id,
                      phase_id: phase._id,
                    },
                  });
                }}
              />
              <DocumentBox doc={documentData} docPath={documentData.title} minWidth="0" />
            </div>
          ) : (
            <FormControl
              required
              disabled
              variant="outlined"
              style={{ width: '100%', padding: '10px 0' }}
            >
              <UploadBox>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept="application/pdf"
                  multiple
                  onChange={({ target }) => {
                    if (target.validity.valid) {
                      setTaskLoading(true);
                      addDoc({
                        variables: {
                          doc: target.files[0],
                          task_id: task._id,
                          deal_id,
                          phase: phase.name,
                        },
                      });
                    }
                  }}
                />
              </UploadBox>
            </FormControl>
          )}
        </Grid>
        <Grid item sm={12} lg={12}>
          <Typography className={classes.taskLastUpdated}>
            Last updated on
            {` ${moment(task.updated_at).format('MM/DD/YY')}`}
          </Typography>
        </Grid>
      </Grid>
    );
  },
);

export const ReviewTask = withStyles(styles)(
  ({
    task,
    deal_id,
    phase_name,
    updateReview,
    setTaskLoading,
    previousTasksCompleted,
    classes,
  }) => {
    return (
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justify="center"
        className={classes.taskContainer}
      >
        <Grid item sm={12} lg={12} style={{ width: '100%' }}>
          <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
            <Typography>{task.title}</Typography>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              component="label"
              style={{ margin: '10px 0' }}
              disabled={!previousTasksCompleted}
              onClick={() => {
                setTaskLoading(true);
                updateReview({ variables: { deal_id, task_id: task._id, phase: phase_name } });
              }}
            >
              Confirm Review
            </Button>
          </FormControl>
        </Grid>
        <Grid item sm={12} lg={12}>
          <Typography className={classes.taskLastUpdated}>
            Last updated on
            {` ${moment(task.updated_at).format('MM/DD/YY')}`}
          </Typography>
        </Grid>
      </Grid>
    );
  },
);

export const KYCServiceTask = withStyles(styles)(({ task, taskData, classes }) => {
  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      justify="center"
      className={classes.taskContainer}
    >
      <Grid item sm={12} lg={12}>
        <FormControl required disabled variant="outlined">
          <Typography>{task.title}</Typography>
          <a
            href={`${process.env.REACT_APP_KYC_LAMBDA_URL}/get-login-url?host=${encodeURIComponent(
              window.location.href,
            )}&userId=${taskData?.user_id}`}
            target="'_blank'"
          >
            <Button>
              <img src={pmButton} alt="Parallel Markets Login Button" />
            </Button>
          </a>
        </FormControl>
      </Grid>
    </Grid>
  );
});

export const SignTask = ({ dataRequestId, tokenId, tokenSecret }) => {
  useEffect(() => {
    if (dataRequestId && tokenId && tokenSecret) {
      // eslint-disable-next-line no-undef
      DocSpring.createVisualForm({
        dataRequestId,
        tokenId,
        tokenSecret,
        domainVerification: false,
      });
    }
  }, [dataRequestId, tokenId, tokenSecret]);

  return null;
};
