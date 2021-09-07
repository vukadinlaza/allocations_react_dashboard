import React, { useEffect, useState } from 'react';
import { get, pick } from 'lodash';
import { toast } from 'react-toastify';
import { useMutation, gql } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CloudDone } from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';

import {
  Button,
  TextField,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import countries from 'country-region-data';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import TypeItem from './TypeItem/index';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
// }));

export default function TypeSelector({ parentClasses }) {
  // const classes = useStyles();
  function FormRow() {
    return (
      <>
        <Grid item style={{ paddingBottom: '16px', paddingRight: '24px' }}>
          <TypeItem />
        </Grid>
        <Grid item style={{ paddingBottom: '16px', paddingRight: '24px' }}>
          <TypeItem />
        </Grid>
        <Grid item style={{ paddingBottom: '16px', paddingRight: '24px' }}>
          <TypeItem />
        </Grid>
        <Grid item style={{ paddingBottom: '16px', paddingRight: '24px' }}>
          <TypeItem />
        </Grid>
      </>
    );
  }
  return (
    <Paper className={parentClasses.paper}>
      <form noValidate autoComplete="off" style={{ padding: '42px' }}>
        <Typography variant="h6" gutterBottom style={{ fontSize: '34px' }}>
          1. Basic Information
        </Typography>
        <Typography
          style={{ color: '#2A2B54', fontWeight: 'bold', fontSize: '18px', marginBottom: '28px' }}
        >
          Choose your asset type{' '}
          <HelpIcon
            style={{
              marginLeft: '0.2em',
              cursor: 'pointer',
              color: '#205DF5',
              fontSize: '12px',
              width: '12px',
              height: '12px',
            }}
          />
        </Typography>
        <Grid container spacing={1}>
          <FormRow />
        </Grid>
        <Grid container spacing={1}>
          <FormRow />
        </Grid>
        <FormControl
          required
          disabled
          variant="outlined"
          style={{ paddingTop: '32px', width: '100%' }}
        >
          <Typography style={{ color: '#2A2B54', font: 'normal normal bold 18px/21px Roboto' }}>
            Portfolio Company Name{' '}
            <HelpIcon
              style={{
                marginLeft: '0.2em',
                cursor: 'pointer',
                color: '#205DF5',
                fontSize: '15px',
              }}
            />
          </Typography>
          <TextField style={{ width: '1148px', paddingTop: '16px' }} variant="outlined" />
        </FormControl>
        <Grid container style={{ paddingTop: '32px' }}>
          <Grid item>
            <FormControl required disabled variant="outlined" style={{ width: '568px' }}>
              <Typography style={{ color: '#2A2B54', font: 'normal normal bold 18px/21px Roboto' }}>
                Manager Name{' '}
                <HelpIcon
                  style={{
                    marginLeft: '0.2em',
                    cursor: 'pointer',
                    color: '#205DF5',
                    fontSize: '15px',
                  }}
                />
              </Typography>
              <TextField style={{ width: '568px', paddingTop: '16px' }} variant="outlined" />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl required disabled variant="outlined" style={{ paddingLeft: '14px' }}>
              <Typography style={{ color: '#2A2B54', font: 'normal normal bold 18px/21px Roboto' }}>
                Closing Date{' '}
                <HelpIcon
                  style={{
                    marginLeft: '0.2em',
                    cursor: 'pointer',
                    color: '#205DF5',
                    fontSize: '15px',
                  }}
                />
              </Typography>
              <TextField
                style={{ width: '568px', paddingTop: '16px' }}
                variant="outlined"
                type="date"
              />
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
