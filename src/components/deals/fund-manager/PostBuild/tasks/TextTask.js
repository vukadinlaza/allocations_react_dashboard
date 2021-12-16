import React, { useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { FormControl, Grid, TextField, Typography } from '@material-ui/core';
import { Button } from 'reactstrap';
import { gql, useMutation } from '@apollo/client';

const UPDATE_DEAL_SERVICE = gql`
  mutation UpdateDealService(
    $deal_id: String!
    $task_id: String!
    $phase: String!
    $payload: Object!
  ) {
    updateDealService(deal_id: $deal_id, task_id: $task_id, phase: $phase, payload: $payload) {
      _id
    }
  }
`;

const TextTask = ({ deal, phase, task, classes, setSnackbarData, refetchDeal }) => {
  const [taskData, setTaskData] = useState({ ...deal });

  const [updateDeal] = useMutation(UPDATE_DEAL_SERVICE, {
    onCompleted: () => {
      refetchDeal();
      setSnackbarData({
        type: 'success',
        message: 'Success! Task updated.',
      });
    },
  });

  const handleChange = (prop) => (e) => {
    e.persist();
    return setTaskData((prev) => ({ ...prev, [prop]: e.target.value }));
  };

  const handleUploadDeal = () => {
    updateDeal({
      variables: {
        deal_id: deal._id,
        phase: phase.name,
        task_id: task._id,
        payload: taskData,
      },
    });
  };

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
};

export default TextTask;
