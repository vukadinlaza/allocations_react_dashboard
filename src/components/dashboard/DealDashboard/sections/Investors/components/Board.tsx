import React from 'react';
import moment from 'moment';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../../styles';
import { sortByStatus } from '../helpers';
import { titleCase } from '../../../../../../utils/helpers';
import { nWithCommas } from '../../../../../../utils/numbers';
import { Investment } from '../index';

interface Props extends WithStyles<typeof styles> {
  data: Investment[];
}

interface Column {
  [key: string]: Investment[];
}

const Board: React.FC<Props> = ({ classes, data }) => {
  const containerSpacing = 2;
  let columns: Column = {};
  data.forEach((investment: Investment) => {
    const status: string = investment.status !== 'complete' ? investment.status : 'wired';
    columns[status] ? columns[status].push(investment) : (columns[status] = [investment]);
  });

  return (
    <>
      <Grid container spacing={containerSpacing} wrap="nowrap" className={classes.boardContainer}>
        <Grid item xs={1} style={{ minWidth: '8.333333%' }} />
        {sortByStatus(Object.keys(columns), '', 'desc').map((column: string, index: number) => (
          <Grid item lg={3} style={{ minWidth: '25%' }} key={uuidv4()}>
            <Typography className={classes.headerLabel}>
              {column.toUpperCase()} ({columns[column].length})
            </Typography>
            {columns[column].map((investment: Investment, index: number) => {
              const { investor } = investment;
              const fullName = `${titleCase(investor.first_name)} ${titleCase(investor.last_name)}`;
              return (
                <Paper elevation={0} className={classes.boardBox} key={uuidv4()}>
                  <p className={classes.boardBoxTitle}>INVESTOR</p>
                  <p className={classes.boardBoxMainText}>
                    {fullName.trim() ? `${fullName}` : '---'}
                  </p>
                  <p className={classes.boardBoxText}>{investor.email}</p>
                  <p className={classes.boardBoxTitle} style={{ marginTop: '16px' }}>
                    INVESTMENT
                  </p>
                  <p className={classes.boardBoxMainText}>
                    {investment.amount ? `$${nWithCommas(investment.amount)}` : '---'}
                  </p>
                  <p className={classes.boardBoxText}>
                    {investment.updated_at
                      ? moment(investment.updated_at, 'x').format('MM/DD/YYYY')
                      : '---'}
                  </p>
                </Paper>
              );
            })}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default withStyles(styles)(Board);
