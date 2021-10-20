import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { gql, useMutation } from '@apollo/client';
import { ReviewTask, taskTypes, KYCServiceTask } from './Tasks';
import DocumentUploadTask from './tasks/DocumentUploadTask';
import SignTask, { usePrefetchSigningLinks } from './tasks/SignTask';
import TextTask from './tasks/TextTask';
import GenericTask from './tasks/GenericTask';
import styles from './styles';
import ServiceTask from './tasks/ServiceTask';

const taskToComponent = {
  'fm-document-upload': DocumentUploadTask,
  'fm-info': TextTask,
  'admin-info': TextTask,
  'fm-document-signature': SignTask,
  service: ServiceTask,
  default: GenericTask,
};

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

const TaskAction = ({ task, deal, refetchDeal, phase, classes, setSnackbarData }) => {
  usePrefetchSigningLinks(deal._id);
  const Component = taskToComponent[task.type] || taskToComponent.default;
  return (
    <Component
      deal={deal}
      phase={phase}
      task={task}
      classes={classes}
      setSnackbarData={setSnackbarData}
      refetchDeal={refetchDeal}
    />
  );

  // const { _id: deal_id } = deal;
  // const [updateDeal] = useMutation(UPDATE_DEAL_SERVICE, {
  //   onCompleted: () => {
  //     refetchDeal();
  //     setSnackbarData({
  //       type: 'success',
  //       message: 'Success! Task updated.',
  //     });
  //   },
  // });

  // const [updateReview] = useMutation(COMPLETE_REVIEW, {
  //   onCompleted: () => {
  //     setTaskLoading(false);
  //     setSnackbarData({
  //       type: 'success',
  //       message: 'Success! Phase reviewed.',
  //     });
  //     refetchDeal();
  //   },
  //   onError: (error) => {
  //     setTaskLoading(false);
  //     setSnackbarData({
  //       type: 'error',
  //       message: error.toString(),
  //     });
  //   },
  // });

  // const [taskData, setTaskData] = useState({ ...deal });

  // const handleChange = (prop) => (e) => {
  //   e.persist();
  //   return setTaskData((prev) => ({ ...prev, [prop]: e.target.value }));
  // };

  // const handleUploadDeal = () => {
  //   updateDeal({
  //     variables: {
  //       deal_id,
  //       phase: phase.name,
  //       task_id: task._id,
  //       payload: taskData,
  //     },
  //   });
  // };

  // let action = null;
  // console.log(
  //   { phase },
  //   phase.tasks.every((t) => t.complete),
  // );
  // if (taskTypes.text.includes(task.type)) {
  //   action = (
  //     <TextTask
  //       handleChange={handleChange}
  //       taskData={taskData}
  //       task={task}
  //       handleUploadDeal={handleUploadDeal}
  //     />
  //   );
  // }

  // if (taskTypes.review.includes(task.type)) {
  //   action = (
  //     <ReviewTask
  //       task={task}
  //       deal_id={deal_id}
  //       phase_name={phase.name}
  //       updateReview={updateReview}
  //       setTaskLoading={setTaskLoading}
  //       previousTasksCompleted={phase?.tasks
  //         ?.filter((t) => t.type !== 'admin-review')
  //         .every((t) => t.complete)}
  //     />
  //   );
  // }

  // if (taskTypes.automaticTasks.includes(task.type) && task.title.includes('KYC')) {
  //   action = <KYCServiceTask task={task} taskData={taskData} />;
  // }

  // return action;
};

export default withStyles(styles)(TaskAction);
