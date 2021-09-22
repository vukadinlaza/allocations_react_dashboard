import React, { useEffect, useState } from 'react';
import HelpIcon from '@material-ui/icons/Help';

import { Button, TextField, Paper, Grid, FormControl } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BasicInfo from './FormComponents/TypeSelector/index';
import ReviewTermsModal from './FormComponents/AgreementSigner/index';
import UploadDocsModal from './FormComponents/UploadDocs/index';

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
    width: '100%',
    opacity: 1,
  },
  formHeaderContainer: {
    marginBottom: '16px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    borderRadius: '15px',
    width: '100%',
    opacity: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  formHeaderText: {
    padding: '36px 0px 27px 8px',
    color: '#2A2B54',
    fontSize: '22px',
  },
  continueButton: {
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
  },
  input: {},
  inputBox: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    border: '1px solid #70707040',
    borderRadius: '5px',
    opacity: '0.3',
    padding: '0',
  },
}));

export default function NewSpvForm() {
  const classes = useStyles();

  // Page
  const [page, setPage] = useState(0);

  // Basic Info
  const [assetType, setAssetType] = useState('realEstate');
  const [portCompName, setPortCompName] = useState('Tundra Real Estate Fund');
  const [managerName, setManagerName] = useState('Kingsley Advani');
  const [closingDate, setClosingDate] = useState('');

  // Deal Terms
  const [managementFee, setManagementFee] = useState('2%');
  const [carryFee, setCarryFee] = useState('Annual');
  const [feeFrequency, setFreeFrequency] = useState('20%');
  const [sameForAllInv, setSameForAllInv] = useState('Yes');

  // Offering Terms
  const [allocationsAsAdviser, setAllocationsAsAdviser] = useState('Yes');
  const [fundTemplateDocument, setFundTemplateDocument] = useState('Allocation Documents');
  const [offeringType, setOfferingType] = useState('506C');

  // Final
  const [finalNotes, setFinalNotes] = useState(
    'Allocations is the fastest end to end fund management platform in existence.',
  );
  return (
    <>
      <Paper className={classes.formHeaderContainer}>
        <Typography
          className={classes.formHeaderText}
          variant="h6"
          gutterBottom
          style={{
            paddingLeft: '42px',
            opacity: page === 0 ? '1' : '0.5',
          }}
        >
          Build your SPV
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.formHeaderText}>
          /
        </Typography>
        <Typography
          className={classes.formHeaderText}
          variant="h6"
          gutterBottom
          style={{
            opacity: page === 1 ? '1' : '0.5',
          }}
        >
          Review and sign terms
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.formHeaderText}>
          /
        </Typography>
        <Typography
          className={classes.formHeaderText}
          variant="h6"
          gutterBottom
          style={{
            opacity: page === 2 ? '1' : '0.5',
          }}
        >
          Upload docs
        </Typography>
      </Paper>
      {page === 0 && (
        <>
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
                        className={classes.inputBox}
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
                        value={feeFrequency}
                        onChange={(e) => setFreeFrequency(e.target.value)}
                        style={{ width: '568px', marginBottom: '37px' }}
                        className={classes.inputBox}
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
                        value={carryFee}
                        onChange={(e) => setCarryFee(e.target.value)}
                        style={{ width: '568px', marginBottom: '37px' }}
                        className={classes.inputBox}
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
                        className={classes.inputBox}
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
                        className={classes.inputBox}
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
                        className={classes.inputBox}
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
                        className={classes.inputBox}
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
                  multiline="true"
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
                    },
                  }}
                  className={classes.inputBox}
                />
                <Button
                  className={classes.continueButton}
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
                    setPage(page + 1);
                  }}
                >
                  Continue
                </Button>
              </FormControl>
            </form>
          </Paper>
        </>
      )}
      {page === 1 && (
        <>
          <ReviewTermsModal page={page} setPage={setPage} />
        </>
      )}
      {page === 2 && (
        <>
          <UploadDocsModal page={page} setPage={setPage} />
        </>
      )}
    </>
  );
}
