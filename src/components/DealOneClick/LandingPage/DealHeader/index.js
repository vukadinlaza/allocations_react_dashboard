import React from 'react';
import { Paper, Avatar, Button, Box } from '@material-ui/core';
import { useStyles } from './style';
import { HiOutlinePencil } from 'react-icons/hi';

function DealHeader({ deal }) {
  const { company_name } = deal;
  const classes = useStyles();

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
    </Paper>
  );
}

export default DealHeader;
