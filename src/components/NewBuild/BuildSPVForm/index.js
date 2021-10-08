import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import moment from 'moment';
import _ from 'lodash';
import HelpIcon from '@material-ui/icons/Help';
import { Button, TextField, Paper, Grid, FormControl, ButtonGroup } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import BasicInfo from './FormComponents/TypeSelector/index';
import UploadDocsModal from './FormComponents/UploadDocs/index';
import useStyles from '../BuildStyles';
import { useAuth } from '../../../auth/useAuth';
import { phone } from '../../../utils/helpers';

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

const ButtonSelector = ({ currentValue, name, values, onChange }) => {
  const classes = useStyles();
  const phoneSize = window.innerWidth < phone;
  return (
    <ButtonGroup
      color="primary"
      aria-label="outlined primary button group"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${values.length}, 1fr)`,
        width: phoneSize ? '325px' : '450px',
        gridGap: phoneSize ? '6px' : '10px',
      }}
    >
      {values.map(({ label, value }, i) => (
        <Button
          key={i}
          name={name}
          value={value}
          className={`${currentValue === value ? classes.selected : null} ${
            classes.selectorButton
          }`}
          onClick={(e) => {
            const target = {
              name: e.currentTarget.name,
              value: e.currentTarget.value,
            };
            e.target = target;
            onChange(e);
          }}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

const BuildDetails = ({
  userProfile,
  page,
  setPage,
  setBuildInfo,
  deal_id,
  waitingOnInitialDeal,
}) => {
  const classes = useStyles();

  const [buildData, setBuildData] = useState({
    // -------------------------- in the form
    asset_type: 'startup',
    portfolio_company_name: '',
    manager_name:
      userProfile.first_name && userProfile.last_name
        ? `${userProfile.first_name} ${userProfile.last_name}`
        : null,
    carry_fee: {
      type: 'percent',
      value: '10',
    },
    management_fee: {
      type: 'percent',
      value: '2',
    },
    custom_investment_agreement: 'false',
    management_fee_frequency: 'one-time',
    setup_cost: 20000,
    offering_type: '506b',
    allocations_investment_advisor: 'true',
    side_letters: 'false',
    closing_date: moment(Date.now()).format('YYYY-MM-DD'),
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
              <FormControl
                required
                // disabled
                variant="outlined"
                className={classes.formContainers}
              >
                <Typography className={classes.formItemName}>
                  Choose your management fee <HelpIcon className={classes.helpIcon} />
                </Typography>
                <ButtonSelector
                  name="management_fee_value"
                  onChange={handleChange}
                  currentValue={buildData.management_fee.value}
                  values={[
                    { label: '0%', value: '0' },
                    { label: '1%', value: '1' },
                    { label: '2%', value: '2' },
                    { label: '3%', value: '3' },
                    { label: 'Custom', value: 'Custom' },
                  ]}
                />
              </FormControl>
            </Grid>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Choose your fee frequency <HelpIcon className={classes.helpIcon} />
                </Typography>
                <ButtonSelector
                  name="management_fee_frequency"
                  onChange={handleChange}
                  currentValue={buildData.management_fee_frequency}
                  values={[
                    { label: 'One-Time', value: 'one-time' },
                    { label: 'Annual', value: 'annual' },
                  ]}
                />
              </FormControl>
            </Grid>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Choose your carry fee <HelpIcon className={classes.helpIcon} />
                </Typography>
                <ButtonSelector
                  name="carry_fee_value"
                  onChange={handleChange}
                  currentValue={buildData.carry_fee.value}
                  values={[
                    { label: '0%', value: '0' },
                    { label: '10%', value: '10' },
                    { label: '20%', value: '20' },
                    { label: '30%', value: '30' },
                    { label: 'Custom', value: 'Custom' },
                  ]}
                />
              </FormControl>
            </Grid>

            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Will you charge the same fee for all investors?{' '}
                  <HelpIcon className={classes.helpIcon} />
                </Typography>
                <ButtonSelector
                  name="side_letters"
                  onChange={handleChange}
                  currentValue={buildData.side_letters}
                  values={[
                    { label: 'Yes (Standard)', value: 'false' },
                    { label: 'No', value: 'true' },
                  ]}
                />
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
                <ButtonSelector
                  name="allocations_investment_advisor"
                  onChange={handleChange}
                  currentValue={buildData.allocations_investment_advisor}
                  values={[
                    { label: 'Yes (Recommended)', value: 'true' },
                    { label: 'No', value: 'false' },
                  ]}
                />
              </FormControl>
            </Grid>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  What is your offering type? <HelpIcon className={classes.helpIcon} />
                </Typography>
                <ButtonSelector
                  name="offering_type"
                  onChange={handleChange}
                  currentValue={buildData.offering_type}
                  values={[
                    { label: 'Private (506b)', value: '506b' },
                    { label: 'Public (506c)', value: '506c' },
                  ]}
                />
              </FormControl>
            </Grid>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Whose fund template documents would you like to use?
                  <HelpIcon className={classes.helpIcon} />
                </Typography>
                <ButtonSelector
                  name="custom_investment_agreement"
                  onChange={handleChange}
                  currentValue={buildData.custom_investment_agreement}
                  values={[
                    { label: 'Allocations', value: 'false' },
                    { label: 'Custom', value: 'true' },
                  ]}
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
  const { userProfile, loading: authLoading } = useAuth();
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
          userProfile={userProfile}
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

  if (authLoading) return null;

  return (
    <>
      <Breadcrumbs titles={pages.map(({ title }) => title)} page={page} />
      {pages[page].Component}
    </>
  );
}
