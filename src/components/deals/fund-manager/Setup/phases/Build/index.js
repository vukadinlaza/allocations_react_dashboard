import React from 'react';
import moment from 'moment';
import { Grid, List, ListItem, Card, CardContent } from '@material-ui/core';
import UploadCompanyDeck from './tasks/UploadCompanyDeck';

const Build = ({
  deal,
  phase,
  task,
  refetchDeal,
  setTaskLoading,
  gettingTaskData,
  setGettingTaskData,
  classes,
  setSnackbarData,
}) => {
  console.log('DEAL', deal);
  console.log('PHASE', phase);
  console.log('TASK', task);
  // console.log('refetchDeal', refetchDeal);
  // console.log('setTaskLoading', setTaskLoading);
  // console.log('gettingTaskData', gettingTaskData);
  // console.log('setGettingTaskData', setGettingTaskData);
  // console.log('setSnackbarData', setSnackbarData);

  return (
    <>
      <Grid item sm={12} lg={4}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <List component="div" disablePadding>
              <ListItem button>Initial Deal Info</ListItem>
              <ListItem button>
                Upload Company Deck
                {/* {' '}
            <UploadCompanyDeck /> */}
              </ListItem>
              <ListItem button>Upload Company Logo</ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Build;
