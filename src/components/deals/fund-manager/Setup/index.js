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
import styles from './styles';
import Build from './phases/Build';
import PostBuild from './phases/PostBuild';
import Entity from './phases/Entity';
import PostEntity from './phases/PostEntity';
import PreOnboarding from './phases/PreOnboarding';
import Onboarding from './phases/Onboarding';

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

// const mainBoxes = (name) => {
//   const data = [
//     { value: name || 'Space X', title: 'Name' },
//     { value: 'Kingsley Advani', title: 'Fund Manager' },
//     { value: 'Pre-onboarding', title: 'Status' },
//     { value: 'On Time', title: 'Timeline Status' },
//     { value: 'International', title: 'Type' },
//     { value: '12/3/2021', title: 'Wire Deadline' },
//   ];
//   const x = data.map((item, i) => {
//     return (
//       <Grid item sm={12} lg={2} key={`box-${i}`}>
//         <FlatBox title={item.title}>
//           <Typography style={{ fontSize: '1.25rem', padding: '16px' }}>{item.value}</Typography>
//         </FlatBox>
//       </Grid>
//     );
//   });
//   return x;
// };

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

const ListContainer = ({ classes, type, list, onClickAction, current, itemName }) => {
  console.log('list', list);
  const getItemClass = (current, item, complete) => {
    if (current === item) {
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
              {list.map((item, i) => {
                const complete =
                  type === 'phase' ? every(item.tasks, { complete: true }) : item.complete;
                return (
                  <ListItem
                    key={`phase-${i}`}
                    button
                    className={getItemClass(current, item, complete)}
                    onClick={() => onClickAction(current, item, type)}
                  >
                    <ListItemIcon>
                      {complete ? (
                        <AiFillCheckCircle style={{ color: '#1be01e' }} size="1.75rem" />
                      ) : (
                        <AiOutlineCheckCircle style={{ color: 'grey' }} size="1.75rem" />
                      )}
                    </ListItemIcon>
                    <ListItemText size="small" primary={_.capitalize(item[itemName])} />
                    {(type === 'phase' || ![...taskTypes.userTask].includes(item.type)) &&
                      !item.type?.startsWith('admin') && (
                        <ListItemIcon className={classes.itemIcon}>
                          {current === item ? (
                            <IoIosArrowBack size="1.2rem" />
                          ) : (
                            <IoIosArrowForward size="1.2rem" />
                          )}
                        </ListItemIcon>
                      )}
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

  const [taskLoading, setTaskLoading] = useState(false);
  const [gettingTaskData, setGettingTaskData] = useState(false);
  const [snackbarData, setSnackbarData] = useState({});
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

  const handleCloseSnackbar = () => {
    setSnackbarData({});
  };

  const listItemClick = (current, item, type) => {
    if (type === 'phase') {
      setCurentPhase(current ? (item === current ? false : item) : item);
      if (currentTask) {
        setCurrentTask(false);
      }
    } else {
      if (item.type.startsWith('admin')) {
        setCurrentTask(false);
        return;
      }
      setCurrentTask(current ? (item === current ? false : item) : item);
    }
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
  console.log('current phase', currentPhase);
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
      {taskLoading && (
        <div className={classes.loaderContainer}>
          <AllocationsLoader fullHeight />
        </div>
      )}
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
        <ListContainer
          classes={classes}
          type="phase"
          list={deal.phases}
          onClickAction={listItemClick}
          current={currentPhase}
          itemName="name"
        />
        {currentPhase.name === 'build' && <Build phase={currentPhase.name} />}
        {currentPhase.name === 'post-build' && <PostBuild />}
        {currentPhase.name === 'entity' && <Entity />}
        {currentPhase.name === 'post-entity' && <PostEntity />}
        {currentPhase.name === 'pre-onboarding' && <PreOnboarding />}
        {currentPhase.name === 'onboarding' && <Onboarding />}
      </Grid>
    </>
  );
};

export default withStyles(styles)(withRouter(DealSetup));
