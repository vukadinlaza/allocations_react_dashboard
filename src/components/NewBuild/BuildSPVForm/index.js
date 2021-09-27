import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
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

const CREATE_BUILD = gql`
  mutation createBuild($payload: Object) {
    createBuild(payload: $payload) {
      _id
      metadata
      phases {
        name
        tasks {
          _id
          title
          complete
        }
      }
    }
  }
`;

export default function NewSpvForm() {
  const classes = useStyles();
  const [createBuild, { data, loading }] = useMutation(CREATE_BUILD);
  // Page
  const [page, setPage] = useState(0);
  const [buildData, setBuildData] = useState({
    // -------------------------- in the form
    asset_type: 'startup',
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
    fund_template_documents: 'Allocations',
    management_fee_frequency: 'one-time',
    setup_cost: 20000,
    offering_type: '506c',
    allocations_investment_advisor: true,
    custom_investment_agreement: false,
    side_letters: false,
    closing_date: moment(Date.now()).format('YYYY-MM-DD'),
    // -------------------------- not in the form
    name: 'Test',
    slug: 'test',
  });

  const handleSubmit = () => {
    createBuild({
      variables: {
        payload: {
          ...buildData,
        },
      },
    });
  };

  const handleChange = ({ target }) => {
    console.log(target.name, target.value);
    if (
      !target?.name?.includes('offering') &&
      !target?.name?.includes('asset') &&
      (target?.name?.includes('_type') || target?.name?.includes('_value'))
    ) {
      const splitKeyName = target.name.split('_');
      const keyName = `${splitKeyName[0]}_${splitKeyName[1]}`;
      setBuildData((prev) => ({
        ...prev,
        [keyName]: {
          ...prev[keyName],
          [splitKeyName[2] === 'type' ? 'type' : 'value']: target.value,
        },
      }));
      return;
    }
    setBuildData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

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
          <BasicInfo buildData={buildData} handleChange={handleChange} parentClasses={classes} />
          <Paper className={classes.paper}>
            <form noValidate autoComplete="off">
              <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
                2. Deal Terms
              </Typography>
              <Grid container spacing={1} className={classes.inputGridContainer}>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl required variant="outlined" className={classes.formContainers}>
                    <Typography className={classes.formItemName}>
                      Choose your management fee <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Grid className={classes.inputBox}>
                      <Select
                        style={{ width: '10%' }}
                        variant="outlined"
                        name="carry_fee_type"
                        value={buildData.carry_fee.type}
                        onChange={handleChange}
                      >
                        <MenuItem value="percent">%</MenuItem>
                        <MenuItem value="fixed">$</MenuItem>
                        <MenuItem value="custom">X</MenuItem>
                      </Select>
                      <TextField
                        value={buildData.carry_fee.value}
                        name="carry_fee_value"
                        onChange={handleChange}
                        style={{ width: '90%' }}
                        variant="outlined"
                      />
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl
                    required
                    // disabled
                    variant="outlined"
                    className={classes.formContainers}
                  >
                    <Typography className={classes.formItemName}>
                      Choose your management fee <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Grid className={classes.inputBox}>
                      <Select
                        style={{ width: '10%' }}
                        variant="outlined"
                        name="management_fee_type"
                        value={buildData.management_fee.type}
                        onChange={handleChange}
                      >
                        <MenuItem value="percent">%</MenuItem>
                        <MenuItem value="fixed">$</MenuItem>
                        <MenuItem value="custom">X</MenuItem>
                      </Select>
                      <TextField
                        value={buildData.management_fee.value}
                        name="management_fee_value"
                        onChange={handleChange}
                        style={{ width: '90%' }}
                        variant="outlined"
                      />
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl required variant="outlined" className={classes.formContainers}>
                    <Typography className={classes.formItemName}>
                      Choose your fee frequency <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Grid container className={classes.buttonContainer}>
                      <Grid>
                        <Button
                          name="management_fee_frequency"
                          value="one-time"
                          className={
                            buildData.management_fee_frequency === 'one-time'
                              ? classes.selectedInputButton
                              : classes.inputButton
                          }
                          onClick={(e) => {
                            const target = {
                              name: e.currentTarget.name,
                              value: e.currentTarget.value,
                            };
                            e.target = target;
                            handleChange(e);
                          }}
                        >
                          One-Time
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          value="annual"
                          name="management_fee_frequency"
                          className={
                            buildData.management_fee_frequency === 'annual'
                              ? classes.selectedInputButton
                              : classes.inputButton
                          }
                          onClick={(e) => {
                            const target = {
                              name: e.currentTarget.name,
                              value: e.currentTarget.value,
                            };
                            e.target = target;
                            handleChange(e);
                          }}
                        >
                          Annual
                        </Button>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl required variant="outlined" className={classes.formContainers}>
                    <Typography className={classes.formItemName}>
                      Will you charge the same fee for all investors?{' '}
                      <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Grid container className={classes.buttonContainer}>
                      <Grid>
                        <Button
                          name="side_letters"
                          value={buildData.side_letters}
                          className={
                            buildData.side_letters
                              ? classes.selectedInputButton
                              : classes.inputButton
                          }
                          onClick={(e) => {
                            const target = {
                              name: e.currentTarget.name,
                              value: true,
                            };
                            e.target = target;
                            handleChange(e);
                          }}
                        >
                          Yes
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          value={buildData.side_letters}
                          name="side_letters"
                          className={
                            !buildData.side_letters
                              ? classes.selectedInputButton
                              : classes.inputButton
                          }
                          onClick={(e) => {
                            const target = {
                              name: e.currentTarget.name,
                              value: false,
                            };
                            e.target = target;
                            handleChange(e);
                          }}
                        >
                          No
                        </Button>
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
                  <FormControl required variant="outlined" className={classes.formContainers}>
                    <Typography className={classes.formItemName}>
                      Choose Allocations as the adviser? <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Grid container className={classes.buttonContainer}>
                      <Grid>
                        <Button
                          name="allocations_investment_advisor"
                          value={buildData.allocations_investment_advisor}
                          className={
                            buildData.allocations_investment_advisor
                              ? classes.selectedInputButton
                              : classes.inputButton
                          }
                          onClick={(e) => {
                            const target = {
                              name: e.currentTarget.name,
                              value: true,
                            };
                            e.target = target;
                            handleChange(e);
                          }}
                        >
                          Yes
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          value={!buildData.allocations_investment_advisor}
                          name="allocations_investment_advisor"
                          className={
                            !buildData.allocations_investment_advisor
                              ? classes.selectedInputButton
                              : classes.inputButton
                          }
                          onClick={(e) => {
                            const target = {
                              name: e.currentTarget.name,
                              value: false,
                            };
                            e.target = target;
                            handleChange(e);
                          }}
                          // onClick={(e) => console.log(e.currentTarget.name, e.currentTarget.value)}
                        >
                          No
                        </Button>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl required variant="outlined" className={classes.formContainers}>
                    <Typography className={classes.formItemName}>
                      What is your offering type? <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Select
                      variant="outlined"
                      name="offering_type"
                      value={buildData.offering_type}
                      onChange={handleChange}
                    >
                      {' '}
                      <MenuItem value="506b">506b</MenuItem>
                      <MenuItem value="506c">506c</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid className={classes.inputGridItem} item xs={6}>
                  <FormControl required variant="outlined" className={classes.formContainers}>
                    <Typography className={classes.formItemName}>
                      Who's fund template documents would you like to use?
                      <HelpIcon className={classes.helpIcon} />
                    </Typography>
                    <Select
                      variant="outlined"
                      name="fund_template_documents"
                      value={buildData.fund_template_documents}
                      onChange={handleChange}
                    >
                      <MenuItem value="Allocations">Allocations</MenuItem>
                      <MenuItem value="Not Allocations">Not Allocations</MenuItem>
                    </Select>
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
                  name="memo"
                  value={buildData.memo}
                  onChange={handleChange}
                  inputProps={{
                    className: classes.finalInput,
                  }}
                  className={classes.finalInputBox}
                />
                <Button
                  className={classes.continueButton}
                  onClick={() => {
                    setPage(page + 1);
                    handleSubmit();
                    console.log(buildData);
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
          <UploadDocsModal page={page} setPage={setPage} deal={data?.createBuild} />
        </>
      )}
    </>
  );
}
