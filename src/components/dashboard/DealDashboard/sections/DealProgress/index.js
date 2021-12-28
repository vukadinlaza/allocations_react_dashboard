import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import { useLocation, withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import CurrentStep from './components/CurrentStep';
import NextStep from './components/NextStep';
import ProgressBar from './components/ProgressBar';
import LoadingPlaceholder from '../../LoadingPlaceholder';
import styles from '../../styles.ts';

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

const defaultDesc =
  'An Allocations representative will be reaching out shortly to assist you in completing this step. If you have any questions, do not hesitate to contact support@allocations.com.';
// May need to reshape based on what we are actually using
const demoData = [
  {
    step: 'Pre-Onboarding',
    title: 'Pre-Onboarding',
    description: defaultDesc,
  },
  {
    step: 'Onboarding',
    title: 'Onboarding: Confirm Deal Details',
    description: defaultDesc,
  },
  {
    step: 'Onboarding',
    title: 'Onboarding: Invite Investors',
    tag: 'For You',
    description:
      'You can now invite investors to your deal. Please have their email addresses ready.',
    // invite link
  },
  {
    step: 'Onboarding',
    title: 'Onboarding: 506c Review',
    tag: 'For Allocations',
    description:
      'Please wait for an Allocations representative to complete this step. If you have any questions, do not hesitate to contact support@allocations.com',
  },
  {
    step: 'Onboarding',
    title: 'Onboarding: Fund Manager KYC Review',
    tag: 'For You',
    description:
      'Please log in to Parallel Markets and complete hte KYC Review before moving onto the next Step.',
    // PM Login link
  },
  {
    step: 'Closing',
    title: 'Closing',
    description: defaultDesc,
  },
  {
    step: 'Post-Closing',
    title: 'Post-Closing',
    description: defaultDesc,
  },
];

const DealProgress = ({ classes }) => {
  const query = new URLSearchParams(useLocation().search);

  const { data } = useQuery(DEAL, {
    fetchPolicy: 'network-only',
    pollInterval: 1000,
    variables: { deal_id: query.get('id') },
  });

  const [currentStep, setCurrentStep] = useState(demoData[2]);
  const [nextStep, setNextStep] = useState(demoData[3]);

  const steps = ['Pre-Onboarding', 'Onboarding', 'Closing', 'Post-Closing'];
  // This finds the matching step and dynamically updates progress bar
  const activeStep = steps.indexOf(steps.find((step) => currentStep.title.includes(step)));

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

  // need some styling
  if (!data) return <LoadingPlaceholder />;
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
  return (
    <>
      <ProgressBar steps={steps} activeStep={activeStep} />

      <Grid container className={classes.bodyContainer}>
        <Grid item xs={10} lg={10} className={classes.currentStepContainer}>
          <Typography className={classes.stepText}>Current Step</Typography>
          <CurrentStep data={currentStep} />
        </Grid>
        <Grid item xs={10} lg={10} className={classes.nextStepContainer}>
          <Typography className={classes.stepText}>Up Next</Typography>
          <NextStep data={nextStep} />
        </Grid>
      </Grid>
    </>
  );
};

export default withStyles(styles)(withRouter(DealProgress));
