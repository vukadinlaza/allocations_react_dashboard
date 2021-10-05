import React, { useState, useEffect } from 'react';
import _, { every } from 'lodash';
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
  CircularProgress,
} from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import { AiOutlineCheckCircle, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import AllocationsRocket from '../DealNextSteps/AllocationsRocket/AllocationsRocket';
import pmButton from '../../assets/parallel-button.svg';

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

const SERVICE_AGREEMENT_LINK = gql`
  query serviceAgreementLink($deal_id: String) {
    dataRequest: getServiceAgreementLink(deal_id: $deal_id) {
      dataRequestId: id
      tokenId: token_id
      tokenSecret: token_secret
    }
  }
`;

const INVESTMENT_AGREEMENT_LINK = gql`
  query investmentAgreementLink($deal_id: String) {
    dataRequest: getInvestmentAgreementLink(deal_id: $deal_id) {
      dataRequestId: id
      tokenId: token_id
      tokenSecret: token_secret
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

  const mockFundInfo = data.map((item) => {
    return (
      <Grid key={item.title} item sm={12} lg={2}>
        <Card>
          <CardContent style={{ fontWeight: '600' }}> {item.title}</CardContent>
          <Divider />
          <Typography style={{ fontSize: '1.25rem', padding: '16px' }}> {item.value}</Typography>
        </Card>
      </Grid>
    );
  });
  return mockFundInfo;
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

const DocumentUploadTask = ({
  task,
  deal_id,
  addDoc,
  phase_name,
  docLoading,
  setCurrentLoadingState,
}) => {
  const [currentTask, setCurrentTask] = useState(task);
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    if (docLoading) {
      setCurrentTask({ ...currentTask, complete: true });
      setCurrentLoadingState(true);
    }
  }, [docLoading]);

  useEffect(() => {
    if (doc) {
      addDoc({
        variables: {
          doc,
          task_id: task._id,
          deal_id,
          phase: phase_name,
        },
      });

      setDoc(null);
    }
  }, [doc]);

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
            value={doc ? '' : null}
            onChange={({ target }) => {
              if (target.validity.valid) {
                setDoc(target.files[0]);
              }
            }}
          />
        </Button>
      </FormControl>
    </Grid>
  );
};

const ServiceTask = ({ task, deal_id, phase_name, taskData }) => {
  return (
    <Grid item sm={12} lg={12}>
      <FormControl required disabled variant="outlined">
        <Typography>{task.title}</Typography>
        {task.title.includes('KYC') ? (
          <a
            href={`https://mfl80ihum2.execute-api.us-east-1.amazonaws.com/dev/kyc/get-login-url?host=${encodeURIComponent(
              window.location.href,
            )}&userId=${taskData?.user_id}`}
            target="'_blank'"
          >
            <Button
            // onClick={() =>
            //   updateReview({ variables: { deal_id, task_id: task._id, phase: phase_name } })
            // }
            >
              <img src={pmButton} alt="Parallel Markets Login Button" />
            </Button>
          </a>
        ) : (
          <Button
            fullWidth
            variant="contained"
            component="label"
            style={{ height: 39 }}
            // onClick={() =>
            //   updateReview({ variables: { deal_id, task_id: task._id, phase: phase_name } })
            // }
          >
            Service Button
          </Button>
        )}
      </FormControl>
    </Grid>
  );
};

const ReviewTask = ({ task, deal_id, phase_name, updateReview }) => {
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

const SignTask = ({ dataRequestId, tokenId, tokenSecret }) => {
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

const TaskAction = ({ task, deal, refetchDeal, phase, setCurrentLoadingState }) => {
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

  const completeStatus = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  const { data: serviceAgreementLink } = useQuery(SERVICE_AGREEMENT_LINK, {
    variables: { deal_id },
  });
  const { data: investmentAgreementLink } = useQuery(INVESTMENT_AGREEMENT_LINK, {
    variables: { deal_id },
  });

  const [addDoc, { loading: docLoading }] = useMutation(ADD_DOC, {
    onCompleted: async () => {
      await completeStatus();
      toast.success('Success! Document uploaded.');
      await refetchDeal();
      setCurrentLoadingState(false);
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
      <DocumentUploadTask
        task={task}
        deal_id={deal_id}
        addDoc={addDoc}
        phase_name={phase.name}
        docLoading={docLoading}
        setCurrentLoadingState={setCurrentLoadingState}
      />
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

  // service = fund manager kyc, create investment agreement, onboarding email, pre-sign investment agreement
  // admin-info = confirm port company sercurities... others
  // admin-review = review docs.... others
  if (JSON.stringify(task).includes('Service Agreement')) {
    action = <SignTask {...(serviceAgreementLink?.dataRequest ?? {})} />;
  }

  if (JSON.stringify(task).includes('Pre-Sign Investment Agreement')) {
    action = <SignTask {...(investmentAgreementLink?.dataRequest ?? {})} />;
  }

  return (
    <Grid container spacing={1} direction="column" alignItems="center" justifyContent="center">
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
  const { data, refetch: refetchDeal } = useQuery(DEAL, {
    variables: { deal_id: query.get('id') },
  });
  useQuery(SERVICE_AGREEMENT_LINK, { variables: { deal_id: query.get('id') } });
  useQuery(INVESTMENT_AGREEMENT_LINK, { variables: { deal_id: query.get('id') } });

  const [currentPhase, setCurrentPhase] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const [currentLoadingState, setCurrentLoadingState] = useState(false);

  useEffect(() => {
    if (currentPhase && data?.getDealWithTasks) {
      const { getDealWithTasks: deal } = data;
      setCurrentPhase(deal?.phases?.find((p) => p.name === currentPhase.name));
      if (currentTask && deal.phases.tasks) {
        setCurrentTask(deal?.phases?.tasks.find((t) => t.title === currentTask.title));
      }
    }
  }, [data]);

  if (!data) return null;
  console.log(data);

  const { getDealWithTasks: deal } = data;

  return (
    <>
      <Grid style={{ margin: '1.25rem 0 ', fontWeight: '900' }}>
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
                      key={p.name}
                      button
                      onClick={() => {
                        setCurrentPhase(currentPhase ? (p === currentPhase ? false : p) : p);
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
                  {currentPhase?.tasks?.map((t) => {
                    return (
                      <ListItem
                        button
                        onClick={() =>
                          setCurrentTask(currentTask ? (t === currentTask ? false : t) : t)
                        }
                      >
                        <ListItemIcon>
                          {/* {(currentTask === t && currentLoadingState) ||
                          (currentTask === t && currentLoadingState && t.complete) ? (
                            <CircularProgress size={24} />
                          ) : ( */}
                          <AiOutlineCheckCircle
                            style={{
                              color:
                                (currentLoadingState && currentTask === t) || t.complete
                                  ? '#1be01e'
                                  : 'grey',
                            }}
                            size="1.75rem"
                          />
                          {/* )} */}
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
                  setCurrentLoadingState={setCurrentLoadingState}
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
