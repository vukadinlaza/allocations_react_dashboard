import React, { useState, useEffect } from 'react';
import { Paper, Avatar, Button, Box, CardMedia, Grid, LinearProgress } from '@material-ui/core';
import { HiOutlinePencil } from 'react-icons/hi';
import { useStyles } from './style';

function DealHeader({ deal }) {
  const { company_name, dealCoverImageKey, slug } = deal;
  const classes = useStyles();

  const key = dealCoverImageKey?.includes('https')
    ? dealCoverImageKey
    : `https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`;

  const [img, setImg] = useState(key);

  useEffect(() => {
    setImg(key);
  }, [dealCoverImageKey, slug, key]);

  return (
    <Paper className={classes.dealHeader}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex">
          <Avatar />
          <h1>{company_name}</h1>
        </Box>
        <Button color="primary" variant="outlined" endIcon={<HiOutlinePencil />}>
          Edit
        </Button>
      </Box>

      <Grid container>
        <Grid item xs={6}>
          <CardMedia
            component="img"
            height="140"
            width="140"
            alt="SPV Header Image"
            src={img}
            onError={() =>
              setImg('https://allocations-public.s3.us-east-2.amazonaws.com/deals/default.png')
            }
          />
        </Grid>
        <Grid item xs={6}>
          <h3>Investment Progress</h3>
          <h6 style={{ color: '#0561ff' }}>$320,000</h6>
          <LinearProgress variant="determinate" value="10" />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default DealHeader;
