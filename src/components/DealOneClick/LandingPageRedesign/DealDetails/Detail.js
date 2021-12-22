import React from 'react';
import { Typography, Box, makeStyles, createStyles } from '@material-ui/core';
import { phone } from '../../../../utils/helpers';

const useStyles = makeStyles((theme) =>
  createStyles({
    headerIndicator: {
      width: '5px',
      backgroundColor: theme.palette.primary.main,
      marginRight: '4px',
    },
    titleText: {
      fontWeight: 'bold',
      fontSize: '20px',
      [theme.breakpoints.down(phone)]: {
        fontSize: '16px',
      },
    },
    descriptionText: {
      color: '#CBD5E1',
      fontSize: '14px',
      [theme.breakpoints.down(phone)]: {
        width: '98%',
        fontSize: '14px',
      },
    },
  }),
);

export default function Detail({ title, description }) {
  const classes = useStyles();

  return (
    <Box my="56px">
      <Box display="flex" mb="24px">
        <span className={classes.headerIndicator} />
        <Typography variant="h5" component="h5" className={classes.titleText}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body1" component="p" className={classes.descriptionText}>
        {description}
      </Typography>
    </Box>
  );
}
