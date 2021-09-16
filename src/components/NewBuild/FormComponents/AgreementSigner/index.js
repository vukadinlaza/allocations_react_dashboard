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
import buildDoc from '../../../../assets/buildDoc.svg';

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
  uploadContainer: {
    marginBottom: '16px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    borderRadius: '15px',
    width: '1352px',
    height: '544px',
    padding: '42px',
  },
  title: { fontSize: '34px' },
  subtitle: {
    textAlign: 'left',
    font: 'normal normal normal 16px/19px Roboto',
    letterSpacing: '0px',
    color: '#186EFF',
    opacity: '1',
    marginBottom: '41px',
  },
  item: {
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
    marginBottom: '8px',
  },
  itemText: {
    font: 'normal normal normal 18px/21px Roboto',
    color: '#2A2B54',
    letterSpacing: '0px',
    marginLeft: '17px',
    opacity: '1',
  },
  documentIcon: { marginLeft: '20px' },
  checkCircle: {
    opacity: '0.3',
    transparentheight: '35px',
    width: '38px',
    marginLeft: 'auto',
    marginRight: '37px',
  },

  uploadIcon: {
    opacity: '0.3',
    width: '30px',
    marginLeft: 'auto',
    marginRight: '37px',
  },
  inputs: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    border: '1px solid #70707040',
    borderRadius: '5px',
    opacity: 1,
  },
}));

export default function SignDocsForm() {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.uploadContainer}>
        <Typography variant="h6" gutterBottom style={{ fontSize: '34px' }}>
          Sign your agreements
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.subtitle}>
          Please sign the appropriate agreements to consent to us to start creating your deals on
          your behalf
        </Typography>
        <Paper className={classes.item}>
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Service Agreement</Typography>
          <img
            src={CheckCircle}
            classes={classes.checkCircle}
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
          // display="flex"
          // justifyContent="flex-end"
          // alignItems="stretch"
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
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography
            style={{
              font: 'normal normal normal 18px/21px Roboto',
              color: '#2A2B54',
              letterSpacing: '0px',
              marginLeft: '17px',
            }}
          >
            Memorandum of Understanding
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
