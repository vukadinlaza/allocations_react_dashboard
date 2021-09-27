import React, { useState, useEffect } from 'react';
import _, { pick, every } from 'lodash';
import {
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  ListItemIcon,
  Divider,
  Typography,
  Button,
  TextField,
  FormControl,
} from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import { AiOutlineCheckCircle, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import AllocationsRocket from '../DealNextSteps/AllocationsRocket/AllocationsRocket';

const DEAL = gql`
  query getDealWithTasks($deal_id: String) {
    getDealWithTasks(deal_id: $deal_id) {
      _id
      metadata
      phases {
        _id
        name
        deal_id
        tasks {
          _id
          title
          description
          metadata
          type
          complete
          done_by
          created_at
          updated_at
        }
      }
    }
  }
`;
const mainBoxes = (name) => {
  const data = [
    { value: name || 'Space X', title: 'Name' },
    { value: 'Kingsley Advani', title: 'Fund Manager' },
    { value: 'Pre-onboarding', title: 'Status' },
    { value: 'On Time', title: 'Timeline Status' },
    { value: 'International', title: 'Type' },
    { value: '12/3/2021', title: 'Wire Deadline' },
  ];
  const x = data.map((item) => {
    return (
      <Grid item sm={12} lg={2}>
        <Card>
          <CardContent style={{ fontWeight: '600' }}> {item.title}</CardContent>
          <Divider />
          <Typography style={{ fontSize: '1.25rem', padding: '16px' }}> {item.value}</Typography>
        </Card>
      </Grid>
    );
  });
  return x;
};
const ADD_DOC = gql`
  mutation addDealDocService($deal_id: String!, $task_id: String!, $doc: Upload!, $phase: String) {
    addDealDocService(deal_id: $deal_id, task_id: $task_id, doc: $doc, phase: $phase) {
      _id
    }
  }
`;
const COMPLETE_REVIEW = gql`
  mutation updateDealTask($deal_id: String!, $task_id: String!, $phase: String!) {
    updateDealTask(deal_id: $deal_id, task_id: $task_id, phase: $phase) {
      _id
    }
  }
`;
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

const TextTask = ({ task, handleChange, taskData, handleUploadDeal }) => {
  console.log('TASK', task);

  const taskFields = task.metadata.collect.map((field) => {
    return (
      <>
        <Grid item sm={12} lg={12}>
          <FormControl required disabled variant="outlined">
            <Typography>{_.startCase(_.camelCase(field.key))}</Typography>
            <TextField
              value={taskData[field.key] || ''}
              onChange={handleChange(field.key)}
              variant="outlined"
            />
          </FormControl>
        </Grid>
        <Button onClick={() => handleUploadDeal()}>Save</Button>
      </>
    );
  });
  return <>{taskFields}</>;
};
const DocumentUploadTask = ({ task, deal_id, addDoc, phase_name }) => {
  return (
    <Grid item sm={12} lg={12}>
      <FormControl required disabled variant="outlined">
        <Typography>{task.title}</Typography>
        <Button fullWidth variant="contained" component="label" style={{ height: 39 }}>
          Attach
          <input
            type="file"
            style={{ display: 'none' }}
            accept="application/pdf"
            multiple
            onChange={({ target }) => {
              if (target.validity.valid)
                addDoc({
                  variables: {
                    doc: target.files[0],
                    task_id: task._id,
                    deal_id,
                    phase: phase_name,
                  },
                });
            }}
          />
        </Button>
      </FormControl>
    </Grid>
  );
};
const ReviewTask = ({ task, deal_id, phase_name, updateReview }) => {
  console.log('TASK', task);

  return (
    <Grid item sm={12} lg={12}>
      <FormControl required disabled variant="outlined">
        <Typography>{task.title}</Typography>
        <Button
          fullWidth
          variant="contained"
          component="label"
          style={{ height: 39 }}
          onClick={() =>
            updateReview({ variables: { deal_id, task_id: task._id, phase: phase_name } })
          }
        >
          Confirm Review
        </Button>
      </FormControl>
    </Grid>
  );
};

const TaskAction = ({ task, deal, refetchDeal, phase }) => {
  const { _id: deal_id } = deal;
  const [updateDeal] = useMutation(UPDATE_DEAL_SERVICE, {
    onCompleted: () => {
      refetchDeal();
      toast.success('Success! Task updated.');
    },
  });
  const [updateReview] = useMutation(COMPLETE_REVIEW, {
    onCompleted: () => {
      toast.success('Success! Phase reviewed.');
      refetchDeal();
    },
  });
  const [addDoc, { data, loading }] = useMutation(ADD_DOC, {
    onCompleted: () => {
      toast.success('Success! Document uploaded.');
      refetchDeal();
    },
  });
  const [taskData, setTaskData] = useState({ ...deal });

  const handleChange = (prop) => (e) => {
    e.persist();
    return setTaskData((prev) => ({ ...prev, [prop]: e.target.value }));
  };
  const handleUploadDeal = () => {
    updateDeal({
      variables: {
        deal_id,
        phase: phase.name,
        task_id: task._id,
        payload: taskData,
      },
    });
  };

  let action = null;
  if (JSON.stringify(task).includes('text')) {
    action = (
      <TextTask
        handleChange={handleChange}
        taskData={taskData}
        task={task}
        handleUploadDeal={handleUploadDeal}
      />
    );
  }
  if (JSON.stringify(task).includes('document-upload')) {
    action = (
      <DocumentUploadTask task={task} deal_id={deal_id} addDoc={addDoc} phase_name={phase.name} />
    );
  }
  if (JSON.stringify(task).includes('review')) {
    action = (
      <ReviewTask
        task={task}
        deal_id={deal_id}
        phase_name={phase.name}
        updateReview={updateReview}
      />
    );
  }

  return (
    <Grid container spacing={1} direction="column" alignItems="center" justify="center">
      <Grid item sm={12} lg={12}>
        <Typography style={{ fontWeight: '600' }}>Edit {task.title}</Typography>
      </Grid>
      <Grid item sm={12} lg={12} style={{ minWidth: '90%' }}>
        {action}
      </Grid>
    </Grid>
  );
};

export default () => {
  const query = new URLSearchParams(useLocation().search);
  const {
    data,
    refetch: refetchDeal,
    loading,
  } = useQuery(DEAL, {
    variables: { deal_id: query.get('id') },
  });

  const [currentPhase, setCurentPhase] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  useEffect(() => {
    if (currentPhase && data?.getDealWithTasks) {
      const { getDealWithTasks: deal } = data;
      setCurentPhase(deal?.phases?.find((p) => p.name === currentPhase.name));
      if (currentTask && deal.phases.tasks) {
        setCurrentTask(deal?.phases?.tasks.find((t) => t.title === currentTask.title));
      }
    }
  }, [data]);
  if (!data) return null;
  const { getDealWithTasks: deal } = data;

  return (
    <>
      <Grid sm={12} lg={12} style={{ margin: '1.25rem 0 ', fontWeight: '900' }}>
        <Typography variant="h3">SPVs</Typography>
      </Grid>
      <Grid container spacing={1} style={{ margin: '2rem 0' }}>
        {mainBoxes(deal.metadata.name)}
      </Grid>
      <Grid container spacing={1}>
        <Grid item sm={12} lg={4}>
          <Card>
            <CardContent>
              <List component="div" disablePadding>
                {deal.phases.map((p) => {
                  return (
                    <ListItem
                      button
                      className
                      onClick={() => {
                        setCurentPhase(currentPhase ? (p === currentPhase ? false : p) : p);
                        if (currentTask) {
                          setCurrentTask(false);
                        }
                      }}
                    >
                      <ListItemIcon>
                        <AiOutlineCheckCircle
                          style={{
                            color: every(p.tasks, { complete: true }) ? '#1be01e' : 'grey',
                          }}
                          size="1.75rem"
                        />
                      </ListItemIcon>
                      <ListItemText size="small" primary={_.capitalize(p.name)} />
                      <ListItemIcon
                        style={{
                          marginLeft: '.25rem',
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {currentPhase === p ? (
                          <AiOutlineArrowLeft style={{}} size="1.2rem" />
                        ) : (
                          <AiOutlineArrowRight style={{}} size="1.2rem" />
                        )}
                      </ListItemIcon>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {currentPhase && (
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent>
                <List component="div" disablePadding>
                  {currentPhase?.tasks?.map((t, i) => {
                    return (
                      <ListItem
                        button
                        className
                        onClick={() =>
                          setCurrentTask(currentTask ? (t === currentTask ? false : t) : t)
                        }
                      >
                        <ListItemIcon>
                          <AiOutlineCheckCircle
                            style={{
                              color: t.complete ? '#1be01e' : 'grey',
                            }}
                            size="1.75rem"
                          />
                        </ListItemIcon>
                        <ListItemText size="small" primary={_.capitalize(t.title)} />
                        <ListItemIcon
                          style={{
                            marginLeft: '.25rem',
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {currentTask === t ? (
                            <AiOutlineArrowLeft style={{}} size="1.2rem" />
                          ) : (
                            <AiOutlineArrowRight style={{}} size="1.2rem" />
                          )}
                        </ListItemIcon>
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
        {currentTask && (
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent>
                <TaskAction
                  task={currentTask}
                  deal={deal.metadata}
                  refetchDeal={refetchDeal}
                  phase={currentPhase}
                />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      <AllocationsRocket />
    </>
  );
};
