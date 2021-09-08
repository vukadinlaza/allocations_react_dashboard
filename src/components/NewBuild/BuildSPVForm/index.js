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
import { SimpleBox } from '../../admin/FundManagerDashboard/widgets';
import Loader from '../../utils/Loader';
import { useAuth } from '../../../auth/useAuth';
import BasicInfo from '../FormComponents/TypeSelector/index';

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

export default function InvestorEditForm() {
  const classes = useStyles();
  // Basic Info
  const [assetType, setAssetType] = useState('');
  const [portCompName, setPortCompName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [closingDate, setClosingDate] = useState('');

  // Deal Terms
  const [managementFee, setManagementFee] = useState('');
  const [carryFee, setCarryFee] = useState('');
  const [feeFrequency, setFreeFrequency] = useState('');
  const [sameForAllInv, setSameForAllInv] = useState('');
  // Offering Terms
  const [allocationsAsAdviser, setAllocationsAsAdviser] = useState('');
  const [fundTemplateDocument, setFundTemplateDocument] = useState('');
  const [offeringType, setOfferingType] = useState('');
  // Final
  const [finalNotes, setFinalNotes] = useState('');
  return (
    <>
      <Paper className={classes.paper}>
        <Typography
          variant="h6"
          gutterBottom
          style={{
            padding: '36px 0px 27px 42px',
            // paddingLeft: '42px',
            // paddingDown: '27px',
            // paddingUp: '36px',
            color: '#2A2B54',
            fontSize: '22px',
          }}
        >
          Build your SPV / Review and sign terms / Upload docs
        </Typography>
      </Paper>
      <BasicInfo
        parentClasses={classes}
        assetType={assetType}
        setAssetType={setAssetType}
        portCompName={portCompName}
        setPortCompName={setPortCompName}
        managerName={managerName}
        setManagerName={setManagerName}
        closingDate={closingDate}
        setClosingDate={setClosingDate}
      />
      <Paper className={classes.paper}>
        <form noValidate autoComplete="off" style={{ padding: '42px' }}>
          <Typography variant="h6" gutterBottom style={{ fontSize: '34px' }}>
            2. Deal Terms
          </Typography>
          <Grid container spacing={1} style={{ marginTop: '16px' }}>
            <Grid item>
              <Grid item xs={6} style={{ marginRight: '54px' }}>
                <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
                  <Typography
                    style={{
                      color: '#2A2B54',
                      font: 'normal normal bold 17px/20px Roboto',
                      marginBottom: '20px',
                    }}
                  >
                    Choose your management fee{' '}
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
                    value={managementFee}
                    onChange={(e) => setManagementFee(e.target.value)}
                    style={{ width: '568px', marginBottom: '37px' }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
                  <Typography
                    style={{
                      color: '#2A2B54',
                      font: 'normal normal bold 17px/20px Roboto',
                      marginBottom: '20px',
                    }}
                  >
                    Choose your fee frequency{' '}
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
                    value={feeFrequency}
                    onChange={(e) => setFreeFrequency(e.target.value)}
                    style={{ width: '568px', marginBottom: '37px' }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item xs={6} style={{ marginRight: '54px' }}>
                <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
                  <Typography
                    style={{
                      color: '#2A2B54',
                      font: 'normal normal bold 17px/20px Roboto',
                      marginBottom: '20px',
                    }}
                  >
                    Choose your carry fee{' '}
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
                    value={carryFee}
                    onChange={(e) => setCarryFee(e.target.value)}
                    style={{ width: '568px', marginBottom: '37px' }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl required disabled variant="outlined" style={{ width: '400px' }}>
                  <Typography
                    style={{
                      color: '#2A2B54',
                      font: 'normal normal bold 17px/20px Roboto',
                      marginBottom: '20px',
                    }}
                  >
                    Will you charge the same fee for all investors?{' '}
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
                    value={sameForAllInv}
                    onChange={(e) => setSameForAllInv(e.target.value)}
                    style={{ width: '568px' }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper className={classes.paper}>
        <form noValidate autoComplete="off" style={{ padding: '42px' }}>
          <Typography variant="h6" gutterBottom style={{ fontSize: '34px' }}>
            3. Offering Terms
          </Typography>
          <Grid container spacing={1} style={{ marginTop: '16px' }} wrap="nowrap">
            <Grid item>
              <Grid item xs={6} style={{ marginRight: '54px' }}>
                <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
                  <Typography
                    style={{
                      color: '#2A2B54',
                      font: 'normal normal bold 17px/20px Roboto',
                      marginBottom: '20px',
                    }}
                  >
                    Choose Allocations as the adviser?{' '}
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
                    value={allocationsAsAdviser}
                    onChange={(e) => setAllocationsAsAdviser(e.target.value)}
                    style={{ width: '568px', marginBottom: '37px' }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
                  <Typography
                    style={{
                      color: '#2A2B54',
                      font: 'normal normal bold 17px/20px Roboto',
                      marginBottom: '20px',
                    }}
                  >
                    What is your offering type?{' '}
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
                    value={offeringType}
                    onChange={(e) => setOfferingType(e.target.value)}
                    style={{ width: '568px', marginBottom: '37px' }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item xs={6} style={{ marginRight: '54px' }}>
                <FormControl required disabled variant="outlined" style={{ width: '600px' }}>
                  <Typography
                    style={{
                      color: '#2A2B54',
                      font: 'normal normal bold 17px/20px Roboto',
                      marginBottom: '20px',
                    }}
                  >
                    Who's fund template documents would you like to use?{' '}
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
                    value={fundTemplateDocument}
                    onChange={(e) => setFundTemplateDocument(e.target.value)}
                    style={{ width: '568px', marginBottom: '37px' }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper className={classes.paper}>
        <form noValidate autoComplete="off" style={{ padding: '42px' }}>
          <Typography variant="h6" gutterBottom style={{ fontSize: '34px' }}>
            4. Final
          </Typography>
          <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
            <Typography style={{ color: '#2A2B54', fontWeight: 'bold', marginBottom: '9px' }}>
              Any notes we should know about?{' '}
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
              variant="outlined"
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              inputProps={{
                style: {
                  height: '167px',
                  background: '#FFFFFF 0% 0% no-repeat padding-box',
                  boxShadow: '0px 3px 6px #0000000A',
                  border: '1px solid #70707040',
                  borderRadius: '5px',
                  opacity: 1,
                },
              }}
            />
          </FormControl>
        </form>
      </Paper>
      <Button
        onClick={() => {
          console.log('basic info');
          console.log(assetType);
          console.log(portCompName);
          console.log(managerName);
          console.log(closingDate);
          console.log('deal terms');
          console.log(managementFee);
          console.log(carryFee);
          console.log(feeFrequency);
          console.log(sameForAllInv);
          console.log('offering terms');
          console.log(allocationsAsAdviser);
          console.log(fundTemplateDocument);
          console.log(offeringType);
          console.log('final terms');
          console.log(finalNotes);
        }}
      >
        Test
      </Button>
    </>
  );
}
