import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DocumentUploadTask from './tasks/DocumentUploadTask';
import SignTask, { usePrefetchSigningLinks } from './tasks/SignTask';
import TextTask from './tasks/TextTask';
import GenericTask from './tasks/GenericTask';
import ServiceTask from './tasks/ServiceTask';
import styles from './styles';

const taskToComponent = {
  'fm-document-upload': DocumentUploadTask,
  'fm-info': TextTask,
  'admin-info': TextTask,
  'fm-document-signature': SignTask,
  service: ServiceTask,
  default: GenericTask,
};

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
};

export default withStyles(styles)(TaskAction);
