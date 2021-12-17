import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import { useLocation, withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import AllocationsLoader from '../../../utils/AllocationsLoader';
import CurrentStep from './components/CurrentStep';
import NextStep from './components/NextStep';
import ProgressBar from './components/ProgressBar';
import backArrow from '../../../../assets/back-arrow.svg';
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

// const boxesHeaders = [
//   { value: 'title', label: 'Name', align: 'left', alignHeader: true },
//   { value: 'fundManager', label: 'Fund Manager', align: 'left', alignHeader: true },
//   { value: 'status', label: 'Status', align: 'left', alignHeader: true, type: 'tag' },
//   { value: 'type', label: 'Type', align: 'left', alignHeader: true },
//   { value: 'wireDeadline', label: 'Wire Deadline', align: 'left', alignHeader: true },
// ];

// const PhaseList = ({ classes, phases, currentPhase, handlePhaseClick }) => {
//   const getItemClass = (currentPhase, item, complete) => {
//     if (currentPhase === item) {
//       if (complete) {
//         return classes.listItemActiveComplete;
//       }
//       return classes.listItemActive;
//     }
//     if (complete) {
//       return classes.listItemComplete;
//     }
//     return classes.listItem;
//   };

//   return (
//     <>
//       <Grid item sm={12} lg={4}>
//         <Card className={classes.card}>
//           <CardContent className={classes.cardContent}>
//             <List component="div" disablePadding>
//               {phases.map((phase) => {
//                 const complete = every(phase.tasks, { complete: true });
//                 return (
//                   <ListItem
//                     key={phase._id}
//                     button
//                     className={getItemClass(currentPhase, phase, complete)}
//                     onClick={() => handlePhaseClick(currentPhase, phase)}
//                   >
//                     <ListItemIcon>
//                       {complete ? (
//                         <AiFillCheckCircle style={{ color: '#1be01e' }} size="1.75rem" />
//                       ) : (
//                         <AiOutlineCheckCircle style={{ color: 'grey' }} size="1.75rem" />
//                       )}
//                     </ListItemIcon>
//                     <ListItemText size="small" primary={_.capitalize(phase.name)} />
//                     <ListItemIcon className={classes.itemIcon}>
//                       {phase === currentPhase ? (
//                         <IoIosArrowBack size="1.2rem" />
//                       ) : (
//                         <IoIosArrowForward size="1.2rem" />
//                       )}
//                     </ListItemIcon>
//                   </ListItem>
//                 );
//               })}
//             </List>
//           </CardContent>
//         </Card>
//       </Grid>
//     </>
//   );
// };

const PostBuild = ({ classes }) => {
  const query = new URLSearchParams(useLocation().search);

  const { data } = useQuery(DEAL, {
    fetchPolicy: 'network-only',
    pollInterval: 1000,
    variables: { deal_id: query.get('id') },
  });

  // const [snackbarData, setSnackbarData] = useState({});
  // const [currentPhase, setCurrentPhase] = useState(false);
  // const [currentTask, setCurrentTask] = useState(false);

  // useEffect(() => {
  //   if (currentPhase && data?.getDealWithTasks) {
  //     const { getDealWithTasks: deal } = data;
  //     setCurrentPhase(deal?.phases?.find((p) => p.name === currentPhase.name));
  //     if (currentTask && deal.phases.tasks) {
  //       setCurrentTask(deal?.phases?.tasks.find((t) => t.title === currentTask.title));
  //     }
  //   }
  // }, [data]);

  // const handleCloseSnackbar = () => {
  //   setSnackbarData({});
  // };

  // const handlePhaseClick = (current, item) => {
  //   setCurrentPhase(current ? (item === current ? false : item) : item);
  //   if (currentTask) setCurrentTask(false);
  // };

  // const handleTaskClick = (currentTask, task) => {
  //   if (task.type.startsWith('admin')) {
  //     setCurrentTask(false);
  //     return;
  //   }
  //   setCurrentTask(currentTask ? (task === currentTask ? false : task) : task);
  // };

  // const getCellContent = (type, row, headerValue) => {
  //   switch (type) {
  //     case 'tag':
  //       return (
  //         <div
  //           style={{
  //             backgroundColor: 'rgb(213 251 212)',
  //             color: '#34AF1F',
  //             fontWeight: 'bold',
  //             padding: '0.3em 2em',
  //             borderRadius: '2em',
  //             width: 'auto',
  //             textAlign: 'center',
  //             transform: 'translateX(-39%)',
  //           }}
  //         >
  //           {row[headerValue]}
  //         </div>
  //       );
  //     default:
  //       return <div />;
  //   }
  // };

  if (!data)
    return (
      <div className={classes.loaderContainer}>
        <AllocationsLoader fullHeight />
      </div>
    );
  // const { getDealWithTasks: deal } = data;

  // const mainBoxes = [
  //   {
  //     title: deal.name,
  //     fundManager: deal?.manager_name || deal?.metadata?.manager?.name,
  //     status: deal.phase,
  //     timeline: 'On Time',
  //     type: 'International',
  //     wireDeadline: moment(deal.wire_deadline).format('MM/DD/YYYY'),
  //   },
  // ];

  const steps = ['Pre-Onboarding', 'Onboarding', 'Closing', 'Post-Closing'];
  const activeStep = steps.indexOf('Closing');

  return (
    <>
      <Grid container style={{ marginBottom: '15px' }}>
        <Button
          style={{ textTransform: 'capitalize', color: '#64748B', outline: 'none' }}
          startIcon={<img src={backArrow} alt="back arrow" />}
          onClick={() => {
            console.log('Click');
          }}
        >
          Back to SPVs
        </Button>
      </Grid>

      <Grid
        container
        sm={10}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
          margin: 'auto',
          paddingBottom: '16px',
        }}
      >
        <Typography style={{ fontSize: '30px', fontWeight: '800' }}>Name of SPV</Typography>
        <Grid item style={{ display: 'flex' }}>
          <Button
            variant="outlined"
            size="small"
            style={{
              backgroundColor: '#CBD5E1',
              color: '#64748B',
              border: 'none',
              textTransform: 'capitalize',
              height: '80%',
              margin: 'auto',
              outline: 'none',
            }}
          >
            Invite
          </Button>
        </Grid>
      </Grid>

      {/* Tabs/Buttons - this needs to be rethought once we have more information */}
      <Grid container sm={10} spacing={1} direction="row" className={classes.buttonGroup}>
        <Grid item>
          <Button variant="contained" color="primary" size="small" disableElevation>
            Deal Progress
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" size="small">
            Investors
          </Button>
        </Grid>
        <Grid item>
          <Button size="small" style={{ textTransform: 'capitalize', color: '#64748B' }}>
            Documents
          </Button>
        </Grid>
        <Grid item>
          <Button size="small" style={{ textTransform: 'capitalize', color: '#64748B' }}>
            Deal Page
          </Button>
        </Grid>
      </Grid>

      <ProgressBar steps={steps} activeStep={activeStep} />

      <Grid container sm={12} className={classes.bodyContainer}>
        <Grid item sm={10} className={classes.currentStepContainer}>
          <Typography className={classes.stepText}>Current Step</Typography>
          <CurrentStep />
        </Grid>
        <Grid item sm={10} className={classes.nextStepContainer}>
          <Typography className={classes.stepText}>Up Next</Typography>
          <NextStep />
        </Grid>
      </Grid>
    </>
  );
};

export default withStyles(styles)(withRouter(PostBuild));
