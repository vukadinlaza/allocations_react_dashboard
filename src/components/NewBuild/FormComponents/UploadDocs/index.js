import React, { useEffect, useState } from 'react';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
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
import CheckCircle from '../../../../assets/check_circle_black_24dp.svg';
import Loader from '../../../utils/Loader';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      // margin: theme.spacing(1),
      width: '267px',
      height: '166px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#7070703B',
    },
  },
  paper: {
    marginBottom: '16px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    borderRadius: '15px',
    width: '1352px',
    opacity: 1,
  },
  inputs: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    border: '1px solid #70707040',
    borderRadius: '5px',
    opacity: 1,
  },
}));

export default function UploadDocs() {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.paper} style={{ padding: '42px', height: '758px' }}>
        <Typography variant="h6" gutterBottom style={{ fontSize: '34px' }}>
          Upload your documents{' '}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          style={{
            textAlign: 'left',
            font: 'normal normal normal 16px/19px Roboto',
            letterSpacing: '0px',
            color: '#186EFF',
            opacity: 1,
          }}
        >
          Please upload the appropriate documents so we have them on file for you. When uploading
          multiple files, please compress them into one zip folder.
        </Typography>
        <Paper
          display="flex"
          justifyContent="flex-end"
          alignItems="stretch"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: '#FFFFFF 0% 0% no-repeat padding-box',
            boxShadow: '0px 3px 6px #0000000D',
            border: '2px solid #2A2B5480',
            borderRadius: '10px',
            opacity: 1,
            width: '1249px',
            height: '91px',
            marginTop: '41px',
          }}
        >
          <DescriptionOutlinedIcon fontSize="large" style={{ marginLeft: '20px' }} />
          <Typography
            style={{
              font: 'normal normal normal 18px/21px Roboto',
              color: '#2A2B54',
              letterSpacing: '0px',
              marginLeft: '17px',
            }}
          >
            Portfolio Company Term Sheet
          </Typography>
          <img
            src={CheckCircle}
            style={{
              opacity: '0.3',
              transparentheight: '35px',
              width: '38px',
              marginLeft: 'auto',
              marginRight: '37px',
            }}
            alt="checkbox"
          />
        </Paper>
        <Paper
          display="flex"
          justifyContent="flex-end"
          alignItems="stretch"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: '#FFFFFF 0% 0% no-repeat padding-box',
            boxShadow: '0px 3px 6px #0000000D',
            border: '2px solid #2A2B5480',
            borderRadius: '10px',
            opacity: 1,
            width: '1249px',
            height: '91px',
            marginTop: '8px',
          }}
        >
          <DescriptionOutlinedIcon fontSize="large" style={{ marginLeft: '20px' }} />
          <Typography
            style={{
              font: 'normal normal normal 18px/21px Roboto',
              color: '#2A2B54',
              letterSpacing: '0px',
              marginLeft: '17px',
            }}
          >
            Pitch Deck
          </Typography>
          <img
            src={CheckCircle}
            style={{
              opacity: '0.3',
              transparentheight: '35px',
              width: '38px',
              marginLeft: 'auto',
              marginRight: '37px',
            }}
            alt="checkbox"
          />
        </Paper>
        <Paper
          display="flex"
          justifyContent="flex-end"
          alignItems="stretch"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: '#FFFFFF 0% 0% no-repeat padding-box',
            boxShadow: '0px 3px 6px #0000000D',
            border: '2px solid #2A2B5480',
            borderRadius: '10px',
            opacity: 1,
            width: '1249px',
            height: '91px',
            marginTop: '8px',
          }}
        >
          <DescriptionOutlinedIcon fontSize="large" style={{ marginLeft: '20px' }} />
          <Typography
            style={{
              font: 'normal normal normal 18px/21px Roboto',
              color: '#2A2B54',
              letterSpacing: '0px',
              marginLeft: '17px',
            }}
          >
            Driver's License/Passport
          </Typography>
          <img
            src={CheckCircle}
            style={{
              opacity: '0.3',
              transparentheight: '35px',
              width: '38px',
              marginLeft: 'auto',
              marginRight: '37px',
            }}
            alt="checkbox"
          />
        </Paper>
        <Paper
          display="flex"
          justifyContent="flex-end"
          alignItems="stretch"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: '#FFFFFF 0% 0% no-repeat padding-box',
            boxShadow: '0px 3px 6px #0000000D',
            border: '2px solid #2A2B5480',
            borderRadius: '10px',
            opacity: 1,
            width: '1249px',
            height: '91px',
            marginTop: '8px',
          }}
        >
          <DescriptionOutlinedIcon fontSize="large" style={{ marginLeft: '20px' }} />
          <Typography
            style={{
              font: 'normal normal normal 18px/21px Roboto',
              color: '#2A2B54',
              letterSpacing: '0px',
              marginLeft: '17px',
            }}
          >
            Portfolio Company Logo
          </Typography>
          <img
            src={CheckCircle}
            style={{
              opacity: '0.3',
              transparentheight: '35px',
              width: '38px',
              marginLeft: 'auto',
              marginRight: '37px',
            }}
            alt="checkbox"
          />
        </Paper>
        <Button
          style={{
            font: 'normal normal bold 24px/28px Roboto',
            marginTop: '44px',
            width: '368px',
            height: '68px',
            background: '#186EFF 0% 0% no-repeat padding-box',
            borderRadius: '10px',
            opacity: '0.5',
            color: '#FFFFFF',
            textTransform: 'none',
            outline: 'none',
          }}
        >
          Continue
        </Button>
        <Typography
          style={{
            font: 'normal normal normal 24px/28px Roboto',
            marginTop: '11px',
            marginLeft: '135px',
          }}
        >
          Previous
        </Typography>
      </Paper>
    </>
  );
}
