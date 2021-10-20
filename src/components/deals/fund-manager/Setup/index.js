import React, { useState, useEffect } from 'react';
import _, { every } from 'lodash';
import moment from 'moment';
import {
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  ListItemIcon,
  Typography,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useQuery, gql } from '@apollo/client';
import { AiOutlineCheckCircle, AiFillCheckCircle } from 'react-icons/ai';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { useLocation, withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import AllocationsLoader from '../../../utils/AllocationsLoader';
import AllocationsTable from '../../../utils/AllocationsTable';
import TaskList from './TaskList';
import TaskAction from './TaskAction';
import styles from './styles';

const DEAL = gql`
  query getDealWithTasks($deal_id: String) {
    getDealWithTasks(deal_id: $deal_id) {
      _id
      metadata
      manager_name
      name
      wire_deadline
      phase
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

const boxesHeaders = [
  { value: 'title', label: 'Name', align: 'left', alignHeader: true },
  { value: 'fundManager', label: 'Fund Manager', align: 'left', alignHeader: true },
  { value: 'status', label: 'Status', align: 'left', alignHeader: true, type: 'tag' },
  // { value: 'timeline', label: 'Timeline Status', align: 'left', alignHeader: true, type: 'tag' },
  { value: 'type', label: 'Type', align: 'left', alignHeader: true },
  { value: 'wireDeadline', label: 'Wire Deadline', align: 'left', alignHeader: true },
];

const taskTypes = {
  docUpload: ['fm-document-upload', 'admin-document-upload'],
  userTask: ['fm-document-signature'],
  review: ['admin-review'],
  text: ['admin-info', 'fm-info'],
  automaticTasks: ['service'],
};

const PhaseList = ({ classes, phases, currentPhase, handlePhaseClick }) => {
  const getItemClass = (currentPhase, item, complete) => {
    if (currentPhase === item) {
      if (complete) {
        return classes.listItemActiveComplete;
      }
      return classes.listItemActive;
    }
    if (complete) {
      return classes.listItemComplete;
    }
    return classes.listItem;
  };

  return (
    <>
      <Grid item sm={12} lg={4}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <List component="div" disablePadding>
              {phases.map((phase, i) => {
                const complete = every(phase.tasks, { complete: true });
                return (
                  <ListItem
                    key={`phase-${i}`}
                    button
                    className={getItemClass(currentPhase, phase, complete)}
                    onClick={() => handlePhaseClick(currentPhase, phase)}
                  >
                    <ListItemIcon>
                      {complete ? (
                        <AiFillCheckCircle style={{ color: '#1be01e' }} size="1.75rem" />
                      ) : (
                        <AiOutlineCheckCircle style={{ color: 'grey' }} size="1.75rem" />
                      )}
                    </ListItemIcon>
                    <ListItemText size="small" primary={_.capitalize(phase.name)} />
                    <ListItemIcon className={classes.itemIcon}>
                      {phase === currentPhase ? (
                        <IoIosArrowBack size="1.2rem" />
                      ) : (
                        <IoIosArrowForward size="1.2rem" />
                      )}
                    </ListItemIcon>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

const DealSetup = ({ match, classes }) => {
  const query = new URLSearchParams(useLocation().search);

  const { data, refetch: refetchDeal } = useQuery(DEAL, {
    fetchPolicy: 'network-only',
    pollInterval: 1000,
    variables: { deal_id: query.get('id') },
  });

  const [snackbarData, setSnackbarData] = useState({});
  const [currentPhase, setCurrentPhase] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);

  useEffect(() => {
    if (currentPhase && data?.getDealWithTasks) {
      const { getDealWithTasks: deal } = data;
      setCurrentPhase(deal?.phases?.find((p) => p.name === currentPhase.name));
      if (currentTask && deal.phases.tasks) {
        setCurrentTask(deal?.phases?.tasks.find((t) => t.title === currentTask.title));
      }
    }
  }, [data]);

  const handleCloseSnackbar = () => {
    setSnackbarData({});
  };

  const handlePhaseClick = (current, item) => {
    setCurrentPhase(current ? (item === current ? false : item) : item);
    if (currentTask) setCurrentTask(false);
  };

  const handleTaskClick = (currentTask, task) => {
    if (task.type.startsWith('admin')) {
      setCurrentTask(false);
      return;
    }
    setCurrentTask(currentTask ? (task === currentTask ? false : task) : task);
  };

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'tag':
        return (
          <div
            style={{
              backgroundColor: 'rgb(213 251 212)',
              color: '#34AF1F',
              fontWeight: 'bold',
              padding: '0.3em 2em',
              borderRadius: '2em',
              width: 'auto',
              textAlign: 'center',
              transform: 'translateX(-39%)',
            }}
          >
            {row[headerValue]}
          </div>
        );
      default:
        return <div />;
    }
  };

  if (!data)
    return (
      <div className={classes.loaderContainer}>
        <AllocationsLoader fullHeight />
      </div>
    );
  const { getDealWithTasks: deal } = data;

  const mainBoxes = [
    {
      title: deal.name,
      fundManager: deal?.manager_name || deal?.metadata?.manager?.name,
      status: deal.phase,
      timeline: 'On Time',
      type: 'International',
      wireDeadline: moment(deal.wire_deadline).format('MM/DD/YYYY'),
    },
  ];

  return (
    <>
      <Snackbar
        open={!!Object.keys(snackbarData).length}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarData.type}
        >
          {snackbarData.message}
        </MuiAlert>
      </Snackbar>
      <Grid item sm={12} lg={12} className={classes.mainTitle}>
        <Typography>SPVs</Typography>
      </Grid>
      <Grid container spacing={1} className={classes.mainBoxes}>
        {/* {mainBoxes(deal.metadata.name)} */}
        <AllocationsTable
          data={mainBoxes}
          headers={boxesHeaders}
          getCellContent={getCellContent}
          rowHeight="90px"
          noShadow
        />
      </Grid>
      <Grid container spacing={5}>
        <PhaseList
          classes={classes}
          phases={deal?.phases}
          handlePhaseClick={handlePhaseClick}
          currentPhase={currentPhase}
        />

        {currentPhase && (
          <TaskList
            tasks={currentPhase?.tasks || []}
            currentTask={currentTask}
            handleTaskClick={handleTaskClick}
          />
        )}

        {currentTask && (
          <Grid item sm={12} lg={4}>
            <Card className={classes.card}>
              <CardContent style={{ padding: '0 16px' }}>
                <TaskAction
                  task={currentTask}
                  deal={deal?.metadata}
                  refetchDeal={refetchDeal}
                  phase={currentPhase}
                  classes={classes}
                  setSnackbarData={setSnackbarData}
                />
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* {currentPhase.name === 'build' && <Build tasks={currentPhase.tasks} tasks={currentPhase.tasks} />}
        {currentPhase.name === 'post-build' && <PostBuild tasks={currentPhase.tasks} />}
        {currentPhase.name === 'entity' && <Entity tasks={currentPhase.tasks} />}
        {currentPhase.name === 'post-entity' && <PostEntity tasks={currentPhase.tasks} />}
        {currentPhase.name === 'pre-onboarding' && <PreOnboarding tasks={currentPhase.tasks} />}
        {currentPhase.name === 'onboarding' && <Onboarding tasks={currentPhase.tasks} />} */}
      </Grid>
    </>
  );
};

export default withStyles(styles)(withRouter(DealSetup));
