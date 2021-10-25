import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import moment from 'moment';
import _ from 'lodash';
import countries from 'country-region-data';
import HelpIcon from '@material-ui/icons/Help';
import {
  Button,
  TextField,
  Paper,
  Grid,
  FormControl,
  ButtonGroup,
  MenuItem,
  Select as Select2,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import BasicInfo from './FormComponents/TypeSelector/index';
import UploadDocsModal from './FormComponents/UploadDocs/index';
import { useAuth } from '../../../auth/useAuth';
import { phone } from '../../../utils/helpers';
import { ModalTooltip } from '../../dashboard/FundManagerDashboard/widgets';
import { useCurrentOrganization } from '../../../state/current-organization';
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
const phoneSize = window.innerWidth < phone;

const ButtonSelector = ({ currentValue, name, values, onChange, gridCol = '1fr 1fr' }) => {
  const classes = useStyles();

  return (
    <ButtonGroup
      color="primary"
      aria-label="outlined primary button group"
      style={{
        display: 'grid',
        gridTemplateColumns: gridCol,
        width: phoneSize ? '325px' : '90%',
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
  const organization = useCurrentOrganization();
  const classes = useStyles();

  const [buildData, setBuildData] = useState({
    organization_id: organization._id,
    asset_type: 'startup',
    portfolio_company_name: '',
    portfolio_company_securities: '',
    estimated_spv_quantity: '', //* add to db
    master_series: '',
    minimum_investment: '',
    international_companies_status: 'false', //* add to db
    international_companies_countries: [], //* add to db
    international_investors_status: 'false', //* investor_type
    international_investors_countries: [], //* add to db
    manager_name:
      userProfile.first_name && userProfile.last_name
        ? `${userProfile.first_name} ${userProfile.last_name}`
        : null,
    carry_fee_type: 'percent',
    carry_fee_value: '10',
    custom_carry_fee: '', //* add to db
    management_fee_type: 'percent',
    management_fee_value: '2',
    custom_management_fee: '', //* add to db
    custom_investment_agreement: 'false',
    management_fee_frequency: 'one-time',
    setup_cost: 20000,
    offering_type: '506b',
    allocations_investment_advisor: 'true', //* conditional front or back?
    investment_advisor: '',
    side_letters: 'false',
    closing_date: moment(Date.now()).format('YYYY-MM-DD'),
    sectors: [],
    representative: '',
  });
  console.log(buildData);
  const [openTooltip, setOpenTooltip] = useState('');
  const customInputStyles = { style: { height: '23px' } };

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };
  useEffect(() => {
    const localStorageBuild = localStorage.getItem('buildData');
    if (localStorageBuild) {
      const parsedBuildData = JSON.parse(localStorageBuild);
      setBuildData(parsedBuildData);
    }
  }, []);

  const handleSubmit = () => {
    setBuildInfo({
      variables: {
        deal_id,
        payload: {
          organization_id: buildData.organization_id,
          asset_type: buildData.asset_type,
          portfolio_company_name: buildData.portfolio_company_name,
          portfolio_company_securities: buildData.portfolio_company_securities,
          estimated_spv_quantity: buildData.estimated_spv_quantity,
          master_series: buildData.master_series,
          minimum_investment: buildData.minimum_investment,
          international_companies: {
            status: buildData.international_companies_status,
            countries: buildData.international_companies_countries,
          },
          international_investors: {
            status: buildData.international_investors_status,
            countries: buildData.international_investors_countries,
          },
          manager_name: buildData.manager_name,
          carry_fee: {
            type: buildData.carry_fee_type,
            value: buildData.carry_fee_value,
            custom: buildData.custom_carry_fee,
          },
          management_fee: {
            type: buildData.management_fee_type,
            value: buildData.management_fee_value,
            custom: buildData.custom_management_fee,
          },
          custom_investment_agreement: buildData.custom_investment_agreement,
          management_fee_frequency: buildData.management_fee_frequency,
          setup_cost: buildData.setup_cost,
          offering_type: buildData.offering_type,
          allocations_investment_advisor: buildData.allocations_investment_advisor,
          investment_advisor: buildData.investment_advisor,
          side_letters: buildData.side_letters,
          closing_date: buildData.closing_date,
          sectors: buildData.sectors,
          representative: buildData.representative,
        },
      },
    });
  };

  const handleChange = ({ target }) => {
    const isNotInternational =
      target.name === 'international_companies_status' && (target.value === 'false' || 'unknown');
    const isNotInternationalInvestors =
      target.name === 'international_investors_status' && (target.value === 'false' || 'unknown');

    setBuildData((prev) => {
      const newBuildObject = {
        ...prev,
        international_companies_countries: isNotInternational
          ? []
          : prev.international_companies_countries,
        international_investors_countries: isNotInternationalInvestors
          ? []
          : prev.international_investors_countries,
        [target.name]: target.value,
      };

      localStorage.setItem('buildData', JSON.stringify(newBuildObject));
      return newBuildObject;
    });
  };

  function InternationalCountrySelector() {
    const countryNames = countries.map((c) => c.countryName);
    const placeHolder = 'Please select which countries';
    const customStyles = {
      multiValue: (styles) => ({
        ...styles,
        backgroundColor: '#DAE8FF',
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: '#0461FF',
        height: 37,
        display: 'flex',
        alignItems: 'center',
        fontSize: '96%',
      }),
      multiValueRemove: (styles) => ({
        ...styles,
        color: '#0461FF',
      }),
      control: (styles) => ({
        ...styles,
        marginTop: 50,
        minHeight: 60,
        width: phoneSize ? '325px' : '90%',
        maxWidth: 568,
        cursor: 'pointer',
      }),
      placeholder: (styles, data) => ({
        ...styles,
        color: data.children === placeHolder ? '#999' : '#000',
      }),
    };

    return (
      <Select
        id="international_companies_countries"
        label="International Companies by Country"
        menuPosition="fixed"
        styles={customStyles}
        value={
          buildData.international_companies_countries.map((country) => ({
            value: country,
            label: country,
          })) || ''
        }
        options={countryNames.map((country) => ({ value: country, label: country })) || ''}
        placeholder={placeHolder || buildData.international_companies_countries}
        onChange={(option) => {
          const newEvent = {
            target: {
              name: 'international_companies_countries',
              value: option.map((country) => country.value),
            },
          };
          handleChange(newEvent);
        }}
        isMulti
      />
    );
  }

  function InternationalInvestorsCountriesSelector() {
    const countryNames = countries.map((c) => c.countryName);
    const placeHolder = 'Please select which countries';
    const customStyles = {
      multiValue: (styles) => ({
        ...styles,
        backgroundColor: '#DAE8FF',
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: '#0461FF',
        height: 37,
        display: 'flex',
        alignItems: 'center',
        fontSize: '96%',
      }),
      multiValueRemove: (styles) => ({
        ...styles,
        color: '#0461FF',
      }),
      control: (styles) => ({
        ...styles,
        marginTop: 50,
        minHeight: 60,
        width: phoneSize ? '325px' : '90%',
        maxWidth: 568,
        cursor: 'pointer',
      }),
      placeholder: (styles, data) => ({
        ...styles,
        color: data.children === placeHolder ? '#999' : '#000',
      }),
    };

    return (
      <Select
        id="international_investors_countries"
        label="International Companies by Country"
        menuPosition="fixed"
        styles={customStyles}
        value={
          buildData.international_investors_countries.map((country) => ({
            value: country,
            label: country,
          })) || ''
        }
        options={countryNames.map((country) => ({ value: country, label: country })) || ''}
        placeholder={placeHolder || buildData.international_investors_countries}
        onChange={(option) => {
          const newEvent = {
            target: {
              name: 'international_investors_countries',
              value: option.map((country) => country.value),
            },
          };
          handleChange(newEvent);
        }}
        isMulti
      />
    );
  }

  return (
    <>
      <BasicInfo
        buildData={buildData}
        setBuildData={setBuildData}
        handleChange={handleChange}
        parentClasses={classes}
        handleTooltip={handleTooltip}
        openTooltip={openTooltip}
      />
      <Paper className={classes.paper}>
        <form noValidate autoComplete="off">
          <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
            2. Deal Terms
          </Typography>
          <Grid container spacing={2} className={classes.inputGridContainer}>
            <Grid className={classes.customInputGridItem} item xs={6}>
              <FormControl
                required
                // disabled
                variant="outlined"
                className={classes.formContainers}
              >
                <Typography className={classes.formItemName}>
                  Choose your management fee
                  <ModalTooltip
                    title="Management Fee"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        A fee which will be charged by the Manager for covering Manager's expenses
                        preparing the deal
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="management_fee_value"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('management_fee_value')}
                    />
                  </ModalTooltip>
                </Typography>
                <ButtonSelector
                  name="management_fee_value"
                  onChange={handleChange}
                  currentValue={buildData.management_fee_value}
                  gridCol={phoneSize ? 'repeat(3, 1fr)' : 'repeat(4, 1fr) 1.5fr'}
                  values={[
                    { label: '0%', value: '0' },
                    { label: '1%', value: '1' },
                    { label: '2%', value: '2' },
                    { label: '3%', value: '3' },
                    { label: 'Custom', value: 'Custom' },
                  ]}
                />
              </FormControl>
              {buildData.management_fee_value === 'Custom' && (
                <FormControl
                  required
                  disabled
                  variant="outlined"
                  className={classes.formContainers}
                  style={{ marginTop: '40px' }}
                >
                  <Typography className={classes.formItemName}>
                    Enter your custom management fee
                    <ModalTooltip
                      title="Custom Management Fee"
                      handleTooltip={handleTooltip}
                      tooltipContent={
                        <Typography color="inherit">
                          Please enter your custom management fees according to your deal. i.e "20%
                          for the first year, 10% for any years after"
                        </Typography>
                      }
                      openTooltip={openTooltip}
                      id="custom_management_fee"
                    >
                      <HelpIcon
                        className={classes.helpIcon}
                        onClick={(e) => handleTooltip('custom_management_fee')}
                      />
                    </ModalTooltip>
                  </Typography>
                  <TextField
                    value={buildData.custom_management_fee}
                    placeholder="Custom Management Fee"
                    name="custom_management_fee"
                    onChange={handleChange}
                    className={classes.inputBox}
                    variant="outlined"
                    inputProps={customInputStyles}
                    classes={{ root: classes.selectInputBox }}
                  />
                </FormControl>
              )}
            </Grid>

            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Choose your fee frequency
                  <ModalTooltip
                    title="Fee Frequency"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        Period for which the Management Fee will be charged (one-time or annually)
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="fee_frequency"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('fee_frequency')}
                    />
                  </ModalTooltip>
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

            <Grid className={classes.customInputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Choose your carry fee
                  <ModalTooltip
                    title="Carry Fee"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        A fee which the Manager will be entitled to in case the SPV's investment is
                        successful/profitable; note that carry fee is charged only from the profit
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="carry_fee_value"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('carry_fee_value')}
                    />
                  </ModalTooltip>
                </Typography>
                <ButtonSelector
                  name="carry_fee_value"
                  onChange={handleChange}
                  currentValue={buildData.carry_fee_value}
                  gridCol={phoneSize ? 'repeat(3, 1fr)' : 'repeat(4, 1fr) 1.5fr'}
                  values={[
                    { label: '0%', value: '0' },
                    { label: '10%', value: '10' },
                    { label: '20%', value: '20' },
                    { label: '30%', value: '30' },
                    { label: 'Custom', value: 'Custom' },
                  ]}
                />
              </FormControl>
              {buildData.carry_fee_value === 'Custom' && (
                <FormControl
                  required
                  disabled
                  variant="outlined"
                  className={classes.formContainers}
                  style={{ marginTop: '40px' }}
                >
                  <Typography className={classes.formItemName}>
                    Enter your custom carry fee
                    <ModalTooltip
                      title="Custom Carry Fee"
                      handleTooltip={handleTooltip}
                      tooltipContent={
                        <Typography color="inherit">
                          Please enter your custom carry fees according to your deal
                        </Typography>
                      }
                      openTooltip={openTooltip}
                      id="custom_carry_fee"
                    >
                      <HelpIcon
                        className={classes.helpIcon}
                        onClick={(e) => handleTooltip('custom_carry_fee')}
                      />
                    </ModalTooltip>
                  </Typography>
                  <TextField
                    value={buildData.custom_carry_fee}
                    placeholder="Custom Carry Fee"
                    name="custom_carry_fee"
                    onChange={handleChange}
                    className={classes.inputBox}
                    variant="outlined"
                    inputProps={customInputStyles}
                    classes={{ root: classes.selectInputBox }}
                  />
                </FormControl>
              )}
            </Grid>

            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Will you charge the same fee for all investors?{' '}
                  <ModalTooltip
                    title="Charge the same fee for all investors?"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        For some investors you might want to provide different fee structure, this
                        is possible by concluding side letters
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="same_investor_fee"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('same_investor_fee')}
                    />
                  </ModalTooltip>
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
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required disabled variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  What is the minimum investment?
                  <ModalTooltip
                    title="What is the minimum investment?"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        Please indicate what is the minimum investment for investors to invest into
                        SPV (e.g., $10,000)
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="minimum_investment"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('minimum_investment')}
                    />
                  </ModalTooltip>
                </Typography>
                <TextField
                  value={buildData.minimum_investment}
                  name="minimum_investment"
                  onChange={handleChange}
                  className={classes.inputBox}
                  variant="outlined"
                  inputProps={customInputStyles}
                  classes={{ root: classes.selectInputBox }}
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
            <Grid className={classes.customInputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Choose Allocations as the reporting adviser?
                  <ModalTooltip
                    title="Reporting Adviser"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        An investment adviser can or will be a regulatory requirement for private
                        funds raising capital for a fee. Please consult your legal counsel on
                        whether your deal needs an adviser{' '}
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="reporting_advisor"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('reporting_advisor')}
                    />
                  </ModalTooltip>
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
              {buildData.allocations_investment_advisor === 'false' && (
                <FormControl
                  required
                  disabled
                  variant="outlined"
                  className={classes.formContainers}
                  style={{ marginTop: '40px' }}
                >
                  <Typography className={classes.formItemName}>
                    Please enter your advisor name
                    <ModalTooltip
                      title="Advisor Name"
                      handleTooltip={handleTooltip}
                      tooltipContent={
                        <Typography color="inherit">Please indicate your ERA/RIA name</Typography>
                      }
                      openTooltip={openTooltip}
                      id="investment_advisor"
                    >
                      <HelpIcon
                        className={classes.helpIcon}
                        onClick={(e) => handleTooltip('investment_advisor')}
                      />
                    </ModalTooltip>
                  </Typography>
                  <TextField
                    value={buildData.investment_advisor}
                    placeholder="Advisor Name"
                    name="investment_advisor"
                    onChange={handleChange}
                    className={classes.inputBox}
                    variant="outlined"
                    inputProps={customInputStyles}
                    classes={{ root: classes.selectInputBox }}
                  />
                </FormControl>
              )}
            </Grid>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  What is your offering type?
                  <ModalTooltip
                    title="Offering Type"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        Depending on the offering type you might be able to ensure
                        self-accreditation for investors or even advertise your deal publicly;
                        please consult your legal counsel
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="offering_type"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('offering_type')}
                    />
                  </ModalTooltip>
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
                  <ModalTooltip
                    title="Fund Template Documents"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        As you might have your own SPV documents, you can use them with us as well,
                        this would limit the period of time in which the SPV could be closed
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="fund_template_docs"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('fund_template_docs')}
                    />
                  </ModalTooltip>
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
            4. Demographics
          </Typography>
          <Grid container spacing={1} className={classes.inputGridContainer}>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={`${classes.formItemName} ${classes.customFormItemName}`}>
                  Will you be investing into any international (Non US) companies?
                  <ModalTooltip
                    title="International Companies"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        If this SPV/Fund will invest into companies located outside the United
                        States, please select Yes to this question followed by the applicable
                        country. If you are unsure at the moment, please select Unknown.
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="international_companies_status"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('international_companies_status')}
                    />
                  </ModalTooltip>
                </Typography>
                <ButtonSelector
                  name="international_companies_status"
                  gridCol="1fr 1fr 1fr"
                  onChange={handleChange}
                  currentValue={buildData.international_companies_status}
                  values={[
                    { label: 'Yes', value: 'true' },
                    { label: 'No', value: 'false' },
                    { label: 'Unknown', value: 'unknown' },
                  ]}
                />
              </FormControl>
              {buildData.international_companies_status === 'true' && (
                <FormControl required variant="outlined" className={classes.formContainers}>
                  <InternationalCountrySelector />
                </FormControl>
              )}
            </Grid>
            <Grid className={classes.inputGridItem} item xs={6} spacing={2}>
              <FormControl required variant="outlined" className={classes.formContainers}>
                <Typography className={`${classes.formItemName} ${classes.customFormItemName}`}>
                  Will you have any international (Non US) investors?
                  <ModalTooltip
                    title="International Investors"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        If this SPV/Fund will have investors located outside the United States,
                        please select Yes to this question followed by the applicable country. If
                        you are unsure at the moment, please select Unknown.
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="international_investors_status"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('international_investors_status')}
                    />
                  </ModalTooltip>
                </Typography>
                <ButtonSelector
                  name="international_investors_status"
                  gridCol="1fr 1fr 1fr"
                  onChange={handleChange}
                  currentValue={buildData.international_investors_status}
                  values={[
                    { label: 'Yes', value: 'true' },
                    { label: 'No', value: 'false' },
                    { label: 'Unknown', value: 'unknown' },
                  ]}
                />
              </FormControl>
              {buildData.international_investors_status === 'true' && (
                <FormControl required variant="outlined" className={classes.formContainers}>
                  <InternationalInvestorsCountriesSelector />
                </FormControl>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper className={classes.paper}>
        <form noValidate autoComplete="off">
          <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
            6. Final
          </Typography>
          <FormControl required disabled variant="outlined" className={classes.formContainers}>
            <Typography className={classes.formItemName}>
              Any notes we should know about?
              <ModalTooltip
                title="Extra Notes"
                handleTooltip={handleTooltip}
                tooltipContent={
                  <Typography color="inherit">
                    Indicate any special provisions which you would like to capture in the deal
                  </Typography>
                }
                openTooltip={openTooltip}
                id="extra_notes"
              >
                <HelpIcon
                  className={classes.helpIcon}
                  onClick={(e) => handleTooltip('extra_notes')}
                />
              </ModalTooltip>
            </Typography>
            <TextField
              multiline
              variant="outlined"
              name="memo"
              value={buildData.memo}
              onChange={handleChange}
              className={classes.finalInputBox}
              inputProps={{
                className: classes.finalInput,
              }}
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
    // if there is no build data/deal_id, we create a new build (default info pulled from the backend)
    if (!localStorage.getItem('buildData') && !localStorage.getItem('buildDeal')) {
      createBuild();
    }
  }, []);

  useEffect(() => {
    // if we finished creating the build, set the deal info in local storage
    if (initialDeal) {
      localStorage.setItem('buildDeal', JSON.stringify(initialDeal.deal));
    }
  }, [loading]);

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
      Component: (
        <UploadDocsModal
          page={page}
          setPage={setPage}
          deal={
            initialDeal?.deal ? initialDeal?.deal : JSON.parse(localStorage.getItem('buildDeal'))
          }
        />
      ),
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
