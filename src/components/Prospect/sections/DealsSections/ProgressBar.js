import React from 'react';
import { LinearProgress, Typography, Box } from '@material-ui/core/';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Box
        sx={
          Math.round(props.value) < 95
            ? {
                minWidth: `${Math.round(props.value)}%`,
                maxWidth: '100%',
                alignSelf: 'flex-start',
                display: 'flex',
                justifyContent: 'flex-end',
              }
            : {
                minWidth: '100%',
                maxWidth: '100%',
                alignSelf: 'flex-start',
                display: 'flex',
                justifyContent: 'flex-end',
              }
        }
      >
        <Typography variant="caption" style={{ color: 'grey' }}>{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
      <Box style={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          style={
            Math.round(props.value) <= 100
              ? { background: 'lightgrey', height: '.5rem' }
              : { background: '#265DF5', height: '.5rem' }
          }
          {...props}
        />
      </Box>
    </Box>
  );
}

const ProgressBar = ({ deal }) => {
  const startingAllocation = 0;
  const maxAllocation = deal.deal_max_allocation;
  const raisedAllocation = deal.deal_raised_amount;
  const progress = Math.round(
    ((raisedAllocation - startingAllocation) / (maxAllocation - startingAllocation)) * 100,
  );

  const raisedAllocationThousand = raisedAllocation / 1000;
  const maxAllocationThousand = maxAllocation / 1000;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Box style={{ width: '90%' }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          paddingRight: '.7rem',
        }}
      >
        <Typography variant="caption" style={{ color: 'black' }}>
          raised ${raisedAllocationThousand}k
        </Typography>
        <Typography variant="caption" style={{ color: 'grey' }}>
          max allocation ${maxAllocationThousand}k
        </Typography>
      </div>
    </>
  );
};

export default ProgressBar;
