import { colors, Icon, Typography } from '@allocations/design-system';
import { Grid } from '@material-ui/core';
import React from 'react';
import useStyles from './styles';

const TextCheck = ({ text, style }) => {
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

export default function AllocationsBenefits() {
  const classes = useStyles();

  return (
    <Grid item xs={6} className={classes.leftSide}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            content="Welcome Assure Clients."
            variant="heading4"
            fontWeight={700}
            fontColor={colors.white[100]}
          />
          <Typography
            content="Migrate to Allocations in a few clicks 🚀"
            variant="heading4"
            fontWeight={700}
            fontColor={colors.white[100]}
          />
          <div style={{ marginTop: '8px' }}>
            <Typography
              content="Simple, fast and efficient process"
              variant="paragraph2"
              fontWeight={400}
              fontColor={colors.white[100]}
            />
          </div>
        </Grid>
        <TextCheck text="Free secure data storage" style={{ marginTop: '20px' }} />
        <TextCheck
          text="Technology platform with GP / LP dashboard"
          style={{ marginTop: '20px' }}
        />
        <TextCheck text="Professional services including" style={{ marginTop: '20px' }} />
        <Grid item xs={12} className={classes.subChecks}>
          <Grid container spacing={2}>
            <TextCheck text="Fund administration" />
            <TextCheck text="Tax returns" />
            <TextCheck text="Banking" />
            <TextCheck text="Change of manager" />
            <TextCheck text="Compliance services" />
            <TextCheck text="Transfer of master entity" />
            <TextCheck text="Post-closing activities" />
            <TextCheck text="Investment advisory services" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
