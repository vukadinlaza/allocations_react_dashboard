import React from 'react';
import { Grid } from '@material-ui/core';
import { colors, Icon, Typography } from '@allocations/design-system';
import useStyles from './styles';

export const TextCheck = ({ text, style }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} className={classes.checkTextContainer} style={style}>
      <Icon iconColor="#B5CEF9" iconName="check_circle" />
      <span className={classes.checkText}>
        <Typography
          content={text}
          variant="paragraph2"
          fontWeight={400}
          fontColor={colors.white[100]}
        />
      </span>
    </Grid>
  );
};

export const SubscriptionTextCheck = ({ text, style, description }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} className={classes.checkTextContainer} style={style}>
      <Icon iconColor="#B5CEF9" iconName="check_circle" />
      <span className={classes.checkText}>
        <Typography
          content={text}
          variant="paragraph2"
          fontWeight={700}
          fontColor={colors.white[100]}
        />
        {!!description && (
          <div className={classes.checkTextDescription}>
            <Typography
              content={description}
              variant="paragraph3"
              fontWeight={400}
              fontColor={colors.white[100]}
            />
          </div>
        )}
      </span>
    </Grid>
  );
};
