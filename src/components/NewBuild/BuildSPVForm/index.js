import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import moment from 'moment';
import HelpIcon from '@material-ui/icons/Help';
import { Button, TextField, Paper, Grid, FormControl, Select, MenuItem } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import BasicInfo from './FormComponents/TypeSelector/index';
import UploadDocsModal from './FormComponents/UploadDocs/index';
import useStyles from '../BuildStyles';

const CREATE_BUILD = gql`
  mutation createBuild {
    deal: createBuild {
      _id
      phases {
        name
        tasks {
          _id
          title
          type
        }
      }
    }
  }
`;

const SET_BUILD_INFO = gql`
  mutation setBuildInfo($deal_id: String, $payload: Object) {
    setBuildInfo(deal_id: $deal_id, payload: $payload) {
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

const Breadcrumb = ({ title, active, withSeparator = false }) => {
  const classes = useStyles();

  return (
    <>
      <Typography
        className={classes.formHeaderText}
        variant="h6"
        gutterBottom
        style={{
          opacity: active ? '1' : '0.5',
        }}
      >
        {title}
      </Typography>
      {withSeparator && (
        <Typography variant="h6" gutterBottom className={classes.formHeaderText}>
          /
        </Typography>
      )}
    </>
  );
};

const Breadcrumbs = ({ titles, page }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.buildTabContainer}>
      {titles.map((title, i) => (
        <>
          <Breadcrumb title={title} active={page === i} withSeparator={i < titles.length - 1} />
        </>
      ))}
    </Paper>
  );
};

const BuildDetails = ({ page, setPage, setBuildInfo, deal_id, waitingOnInitialDeal }) => {
  const classes = useStyles();

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
    setBuildInfo({
      variables: {
        deal_id,
        payload: {
          ...buildData,
        },
      },
    });
  };

  const handleChange = ({ target }) => {
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
                  Choose your carry fee <HelpIcon className={classes.helpIcon} />
                </Typography>
                <Grid className={classes.inputBox}>
                  <TextField
                    style={{ width: '70%', marginRight: '12px' }}
                    value={buildData.carry_fee.value}
                    name="carry_fee_value"
                    onChange={handleChange}
                    variant="outlined"
                  />
                  <Select
                    style={{
                      width: '25%',
                      textAlign: 'center',
                    }}
                    variant="outlined"
                    name="carry_fee_type"
                    value={buildData.carry_fee.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="percent">%</MenuItem>
                    <MenuItem value="fixed">$</MenuItem>
                    <MenuItem value="custom">X</MenuItem>
                  </Select>
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
                  <TextField
                    style={{ width: '70%', marginRight: '12px' }}
                    value={buildData.management_fee.value}
                    name="management_fee_value"
                    onChange={handleChange}
                    variant="outlined"
                  />
                  <Select
                    style={{ width: '25%', textAlign: 'center' }}
                    variant="outlined"
                    name="management_fee_type"
                    value={buildData.management_fee.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="percent">%</MenuItem>
                    <MenuItem value="fixed">$</MenuItem>
                    <MenuItem value="custom">X</MenuItem>
                  </Select>
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
                          ? `${classes.selectedInputButton} ${classes.selected}`
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
                          ? `${classes.selectedInputButton} ${classes.selected}`
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
                          ? `${classes.selectedInputButton} ${classes.selected}`
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
                      Yes (Standard)
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      value={buildData.side_letters}
                      name="side_letters"
                      className={
                        !buildData.side_letters
                          ? `${classes.selectedInputButton} ${classes.selected}`
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
                          ? `${classes.selectedInputButton} ${classes.selected}`
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
                          ? `${classes.selectedInputButton} ${classes.selected}`
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
                  <MenuItem value="506b">506b (no advertising)</MenuItem>
                  <MenuItem value="506c">506c</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Whose fund template documents would you like to use?
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
              disabled={waitingOnInitialDeal}
              onClick={() => {
                setPage(page + 1);
                handleSubmit();
              }}
            >
              Continue
            </Button>
          </FormControl>
        </form>
      </Paper>
    </>
  );
};

export default function NewSpvForm() {
  const [createBuild, { data: initialDeal, loading }] = useMutation(CREATE_BUILD);
  const [setBuildInfo] = useMutation(SET_BUILD_INFO);
  // Page
  const [page, setPage] = useState(0);

  useEffect(() => {
    createBuild();
  }, []);

  const pages = [
    {
      title: 'Build your SPV',
      Component: (
        <BuildDetails
          page={page}
          setPage={setPage}
          setBuildInfo={setBuildInfo}
          deal_id={initialDeal?.deal?._id}
          waitingOnInitialDeal={loading}
        />
      ),
    },
    {
      title: 'Upload docs',
      Component: <UploadDocsModal page={page} setPage={setPage} deal={initialDeal?.deal} />,
    },
  ];

  return (
    <>
      <Breadcrumbs titles={pages.map(({ title }) => title)} page={page} />
      {pages[page].Component}
    </>
  );
}
