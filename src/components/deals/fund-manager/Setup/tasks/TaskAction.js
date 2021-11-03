import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DocumentUploadTask from './DocumentUploadTask';
import SignTask from './SignTask';
import TextTask from './TextTask';
import GenericTask from './GenericTask';
import ServiceTask from './ServiceTask';
import styles from '../styles';

const taskToComponent = {
  'fm-document-upload': DocumentUploadTask,
  'fm-info': TextTask,
  'admin-info': TextTask,
  'fm-document-signature': SignTask,
  service: ServiceTask,
  default: GenericTask,
};

const TaskAction = ({ task, deal, refetchDeal, phase, classes, setSnackbarData }) => {
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
};

export default withStyles(styles)(TaskAction);
