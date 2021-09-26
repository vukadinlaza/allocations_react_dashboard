import React, { useEffect, useState } from 'react';
import moment from 'moment';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import HelpIcon from '@material-ui/icons/Help';
import { Button, TextField, Paper, Grid, FormControl, Select, MenuItem } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
import BasicInfo from './FormComponents/TypeSelector/index';
import ReviewTermsModal from './FormComponents/AgreementSigner/index';
import UploadDocsModal from './FormComponents/UploadDocs/index';
import useStyles from '../BuildStyles';

export default function NewSpvForm() {
  const classes = useStyles();
  const [buildData, setBuildData] = useState({
    // -------------------------- in the form
    asset_type: '',
    portfolio_company_name: 'test',
    manager_name: 'John Smith',
    carry_fee: {
      type: 'percent',
      value: '20',
    },
    management_fee: {
      type: 'percent',
      value: '10',
    },
    management_fee_frequency: 'one-time',
    setup_cost: 20000,
    offering_type: '506c',
    allocations_investment_advisor: true,
    custom_investment_agreement: false,
    closing_date: moment(Date.now()).format('YYYY-MM-DD'),
    // -------------------------- not in the form
    name: 'Test',
    slug: 'test',

    // organization_id: ObjectId("5fa4547e0cbec80023baa4b7"),
    // legal_spv_name: "Atomizer 38",
    // master_series: "Atomizers",

    // wire_deadline: Date.now(),
    // sign_deadline: Date.now(),

    // side letters is the 'same for all invs'
    side_letters: false,
    // allocations_investment_advisor: true,

    industry: 'Space',
    angels_deal: true,
    deal_multiple: false,
    description: 'some description',
    memo: 'some memo',
    // ...payload,
  });
  const handleChange = ({ target }) => {
    if (target.name === 'closing_date') {
      const closingTimeStamp = new Date();
    }
    setBuildData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };
  // Page
  const [page, setPage] = useState(0);

  // Basic Info
  const [assetType, setAssetType] = useState('');
  const [portCompName, setPortCompName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [closingDate, setClosingDate] = useState('');

  // Deal Terms
  const [managementFee, setManagementFee] = useState(10);
  const [carryFee, setCarryFee] = useState(10);
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
            buildData={buildData}
            handleChange={handleChange}
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
                <Grid
                  className={classes.inputGridItem}
                  style={{ display: 'flex', flexDirection: 'row' }}
                  item
                  xs={6}
                >
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Choose your management fee <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Grid className={classes.inputBox}>
                      <Select
                        // value={managementFee}
                        // onChange={(e) => setManagementFee(e.target.value)}
                        // className={classes.inputBox}
                        style={{ width: '25%' }}
                        variant="outlined"
                      >
                        {/* <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem> */}
                      </Select>
                      <TextField
                        value={managementFee}
                        onChange={(e) => setManagementFee(e.target.value)}
                        // className={classes.inputBox}
                        style={{ width: '75%' }}
                        variant="outlined"
                      />
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Choose your carry fee <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    {/* <TextField
                      value={feeFrequency}
                      onChange={(e) => setFreeFrequency(e.target.value)}
                      className={classes.inputBox}
                      variant="outlined"
                    /> */}
                    <Select
                      // value={managementFee}
                      // onChange={(e) => setManagementFee(e.target.value)}
                      // className={classes.inputBox}
                      style={{ width: '25%' }}
                      variant="outlined"
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    <TextField
                      value={managementFee}
                      onChange={(e) => setManagementFee(e.target.value)}
                      // className={classes.inputBox}
                      style={{ width: '75%' }}
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Choose your fee frequency <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Grid container className={classes.buttonContainer}>
                      <Grid>
                        <Button className={classes.inputButton}>One-Time</Button>
                      </Grid>
                      <Grid>
                        <Button className={classes.inputButton}>Annual</Button>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Will you charge the same fee for all investors?{' '}
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
              <Grid container spacing={1} className={classes.inputGridContainer}>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl
                    required
                    disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Choose Allocations as the adviser? <HelpIcon className={classes.helpIcon} />
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
                <Grid className={classes.inputGridItem} item xs={6}>
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
                <Grid className={classes.inputGridItem} item xs={6}>
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
                  multiline
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
