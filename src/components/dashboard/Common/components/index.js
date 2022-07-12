import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { Button, Icon } from '@allocations/design-system';
import useStyles from './styles';

export const Box = ({ box, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid {...rest} item lg={2} md={5} xs={10}>
      <Paper elevation={0} className={classes.smallBox}>
        <Typography className={classes.boxTitle}>{box.title}</Typography>
        <Typography className={classes.boxValue}>{box.value}</Typography>
      </Paper>
    </Grid>
  );
};

export const BigBox = ({ content, button: { action, text }, icon }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper elevation={0} className={classes.bigBox}>
        {icon ? <Icon iconColor="#0040FE" iconName={icon} /> : null}
        <Typography className={classes.bigBoxTitle}>{content}</Typography>
        {text ? <Button onClick={action} size="small" text={text} /> : null}
      </Paper>
    </Grid>
  );
};
