import React from 'react';
import { Grid, FormControl, Tooltip, Typography } from '@material-ui/core';
import questionMark from '../../../../assets/question-circle-fill.svg';

const DealPage = ({ classes }) => {
  return (
    <div>
      <h1>Deal page tab</h1>
      <div style={{ paddingLeft: '1.5rem' }}>
        <Grid container spacing={1} className={classes.inputGridContainer}>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Grid item xs={12} className={classes.titleWrapper}>
                <Typography
                  variant="subtitle2"
                  style={{ fontWeight: 'bold', color: 'black', paddingRight: '.5rem' }}
                >
                  How much are you investing into this SPV?
                </Typography>
                <Tooltip title="howmuch are you personally investing?" arrow>
                  <img src={questionMark} alt="question mark" />
                </Tooltip>
              </Grid>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default DealPage;
