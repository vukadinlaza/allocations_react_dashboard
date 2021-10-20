import React from 'react';
import { FormControl, Grid, Typography, Button } from '@material-ui/core';
import pmButton from '../../../../../assets/parallel-button.svg';
import { useAuth } from '../../../../../auth/useAuth';
import Loader from '../../../../utils/Loader';

export const KYCServiceTask = ({ task, classes }) => {
  const { userProfile, loading } = useAuth();
  if (loading) return <Loader />;

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      justify="center"
      className={classes.taskContainer}
    >
      <Grid item sm={12} lg={12}>
        <FormControl required disabled variant="outlined">
          <Typography>{task.title}</Typography>
          <a
            href={`${process.env.REACT_APP_KYC_LAMBDA_URL}/get-login-url?host=${encodeURIComponent(
              window.location.href,
            )}&userId=${userProfile._id}`}
            target="'_blank'"
          >
            <Button>
              <img src={pmButton} alt="Parallel Markets Login Button" />
            </Button>
          </a>
        </FormControl>
      </Grid>
    </Grid>
  );
};

const serviceTaskMap = {
  kyc: KYCServiceTask,
  default: () => null,
};

export default function ServiceTask({ deal, phase, task, classes }) {
  const Component = serviceTaskMap[task.metadata?.key] || serviceTaskMap.default;

  return <Component deal={deal} phase={phase} task={task} clases={classes} />;
}
