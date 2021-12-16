import React from 'react';
import { Typography, Box, makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    headerIndicator: {
      width: '5px',
      backgroundColor: theme.palette.primary.main,
      marginRight: '4px',
    },
  }),
);

export default function Detail({ title, description }) {
  const classes = useStyles();

  return (
    <Box my="56px">
      <Box display="flex" mb="24px">
        <span className={classes.headerIndicator} />
        <Typography variant="h5" component="h5" style={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body1" component="p" style={{ color: '#CBD5E1' }}>
        {description}
      </Typography>
    </Box>
  );
}
