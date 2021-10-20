import React from 'react';
import moment from 'moment';
import {
  FormControl,
  Grid,
  TextField,
  Typography,
  Button,
  CardContent,
  Card,
} from '@material-ui/core';

const UploadCompanyDeck = ({ classes }) => {
  return (
    <Grid item sm={12} lg={4}>
      <Card className={classes.card}>
        <CardContent style={{ padding: '0 16px' }}>
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            justify="center"
            className={classes.taskContainer}
          >
            <Grid item sm={12} lg={12} style={{ minWidth: '90%', width: '100%' }}>
              <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
                <Typography className={classes.subTaskTitle}>Upload COmpany Deck</Typography>
                <TextField
                  // value={taskData[field.key] || ''}
                  value="Hello"
                  // onChange={handleChange(field.key)}
                  fullWidth
                  className={classes.textField}
                />
              </FormControl>
            </Grid>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              // onClick={handleUploadDeal}
              style={{ margin: '0 0 10px 0' }}
            >
              Save
            </Button>
            <Typography className={classes.taskLastUpdated}>
              Last updated on
              {/* {` ${moment(task.updated_at).format('MM/DD/YY')}`} */}
            </Typography>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UploadCompanyDeck;
