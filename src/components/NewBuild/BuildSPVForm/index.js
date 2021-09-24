import React, { useEffect, useState } from 'react';
import HelpIcon from '@material-ui/icons/Help';

import { Button, TextField, Paper, Grid, FormControl } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
import BasicInfo from './FormComponents/TypeSelector/index';
import ReviewTermsModal from './FormComponents/AgreementSigner/index';
import UploadDocsModal from './FormComponents/UploadDocs/index';
import useStyles from '../BuildStyles';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     '& > *': {
//       // margin: theme.spacing(1),
//       width: '267px',
//       height: '166px',
//       borderWidth: '1px',
//       borderStyle: 'solid',
//       borderColor: '#7070703B',
//     },
//   },
//   paper: {
//     marginBottom: '16px',
//     background: '#FFFFFF 0% 0% no-repeat padding-box',
//     boxShadow: '0px 3px 6px #00000029',
//     border: '1px solid #7070703B',
//     borderRadius: '15px',
//     width: '100%',
//     opacity: 1,
//   },
//   formHeaderContainer: {
//     marginBottom: '16px',
//     background: '#FFFFFF 0% 0% no-repeat padding-box',
//     boxShadow: '0px 3px 6px #00000029',
//     border: '1px solid #7070703B',
//     borderRadius: '15px',
//     width: '100%',
//     opacity: 1,
//     display: 'flex',
//     flexDirection: 'row',
//   },
//   formHeaderText: {
//     padding: '36px 0px 27px 8px',
//     color: '#2A2B54',
//     fontSize: '22px',
//   },
//   continueButton: {
//     font: 'normal normal bold 24px/28px Roboto',
//     marginTop: '44px',
//     width: '368px',
//     height: '68px',
//     background: '#186EFF 0% 0% no-repeat padding-box',
//     borderRadius: '10px',
//     opacity: '0.5',
//     color: '#FFFFFF',
//     textTransform: 'none',
//     outline: 'none',
//   },
//   input: {},
//   inputBox: {
//     background: '#FFFFFF 0% 0% no-repeat padding-box',
//     boxShadow: '0px 3px 6px #0000000A',
//     border: '1px solid #70707040',
//     borderRadius: '5px',
//     opacity: '0.3',
//     padding: '0',
//   },
// }));

export default function NewSpvForm() {
  const classes = useStyles();

  // Page
  const [page, setPage] = useState(2);

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
      <Paper className={classes.buildTabContainer}>
        <Typography
          className={classes.formHeaderText}
          variant="h6"
          gutterBottom
          style={{
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
            <form noValidate autoComplete="off">
              <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
                2. Deal Terms
              </Typography>
              <Grid container spacing={1} className={classes.inputGridContainer}>
                <Grid item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Choose your management fee <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <TextField
                      value={managementFee}
                      onChange={(e) => setManagementFee(e.target.value)}
                      className={classes.inputBox}
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Choose your carry fee <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <TextField
                      value={feeFrequency}
                      onChange={(e) => setFreeFrequency(e.target.value)}
                      className={classes.inputBox}
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Choose your fee frequency <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <TextField
                      value={carryFee}
                      onChange={(e) => setCarryFee(e.target.value)}
                      className={classes.inputBox}
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainer}
                  >
                    <Typography className={classes.formItemName}>
                      Will you charge the same fee for all investors?
                      <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Grid container className={classes.buttonContainer}>
                      <Grid>
                        <Button className={classes.inputButton}>Yes</Button>
                      </Grid>
                      <Grid>
                        <Button className={classes.inputButton}>No</Button>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </Paper>
          <Paper className={classes.paper}>
            <form noValidate autoComplete="off">
              <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
                3. Offering Terms
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Choose Allocations as the adviser? <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <TextField
                      value={allocationsAsAdviser}
                      onChange={(e) => setAllocationsAsAdviser(e.target.value)}
                      className={classes.inputBox}
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      What is your offering type? <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <TextField
                      value={offeringType}
                      onChange={(e) => setOfferingType(e.target.value)}
                      className={classes.inputBox}
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Who's fund template documents would you like to use?{' '}
                      <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <TextField
                      value={offeringType}
                      onChange={(e) => setOfferingType(e.target.value)}
                      className={classes.inputBox}
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </Paper>
          <Paper className={classes.paper}>
            <form noValidate autoComplete="off">
              <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
                4. Final
              </Typography>
              <FormControl required disabled variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Any notes we should know about? <HelpIcon className={classes.helpIcon} />
                </Typography>
                <TextField
                  multiline="true"
                  variant="outlined"
                  value={finalNotes}
                  onChange={(e) => setFinalNotes(e.target.value)}
                  inputProps={{
                    className: classes.finalInput,
                  }}
                  className={classes.finalInputBox}
                />
                <Button
                  className={classes.continueButton}
                  onClick={() => {
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
