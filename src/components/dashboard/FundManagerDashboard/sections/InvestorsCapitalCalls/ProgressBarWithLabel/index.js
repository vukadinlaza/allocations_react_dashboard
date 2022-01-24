import React from 'react';
import { Box, Typography, LinearProgress, withStyles } from '@material-ui/core';

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 6,
    borderRadius: 10,
  },
  colorPrimary: {
    backgroundColor: '#E8E8E8',
  },
  bar: {
    borderRadius: 5,
  },
}))(LinearProgress);

export default function ProgressBarWithLabel({ value }) {
  return (
    <Box>
      <Typography variant="body2" color="primary">
        {`${value}%`}
      </Typography>
      <BorderLinearProgress variant="determinate" value={value} />
    </Box>
  );
}
