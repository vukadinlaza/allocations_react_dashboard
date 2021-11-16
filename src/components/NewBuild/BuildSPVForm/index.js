import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import moment from 'moment';
import _ from 'lodash';
import countries from 'country-region-data';
import { toast } from 'react-toastify';
import HelpIcon from '@material-ui/icons/Help';
import { Button, TextField, Paper, Grid, FormControl, ButtonGroup } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import BasicInfo from './FormComponents/TypeSelector/index';
import UploadDocs from './FormComponents/UploadDocs/index';
import { useAuth } from '../../../auth/useAuth';
import { phone } from '../../../utils/helpers';
import { ModalTooltip } from '../../dashboard/FundManagerDashboard/widgets';
import { useCurrentOrganization } from '../../../state/current-organization';
import useStyles from '../BuildStyles';
import AgreementSigner from './FormComponents/AgreementSigner';
import { convertToPositiveIntOrNull } from '../../../utils/numbers';
import { useParams } from 'react-router';
import {
  CarryFee,
  CustomInvestmentAgreement,
  ManagementFee,
  ManagementFeeFrequency,
  MinimumInvestment,
  OfferingType,
  ReportingAdviser,
  SideLetters,
} from './FormFields';

const CREATE_BUILD = gql`
  mutation createBuild($payload: Object) {
    deal: createBuild(payload: $payload) {
      _id
      high_volume_partner
      master_series
      phases {
        _id
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
        <Breadcrumb
          title={title}
          key={title}
          active={page === i}
          withSeparator={i < titles.length - 1}
        />
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
  dealType,
  page,
  setPage,
  setBuildInfo,
  deal_id,
  waitingOnInitialDeal,
  initialDeal,
  organization,
}) => {
  const classes = useStyles();

  const [buildData, setBuildData] = useState({
    allocations_reporting_adviser: 'true',
    asset_type: 'startup',
    carry_fee_type: 'percent',
    carry_fee_value: '20',
    closing_date: moment(Date.now()).add(7, 'days').format('YYYY-MM-DD'),
    custom_carry_fee: 'false',
    custom_investment_agreement: 'false',
    custom_management_fee: 'false',
    deal_stage: '',
    estimated_spv_quantity: null,
    high_volume_partner: false,
    international_company_status: 'false',
    international_company_country: '',
    international_investors_status: 'false',
    international_investors_countries: [],
    custom_reporting_adviser: '',
    manager_name:
      userProfile.first_name && userProfile.last_name
        ? `${userProfile.first_name} ${userProfile.last_name}`
        : null,
    management_fee_frequency: 'one time',
    management_fee_type: 'percent',
    management_fee_value: '2',
    master_series: '',
    minimum_investment: 10000,
    offering_type: '506b',
    portfolio_company_name: '',
    portfolio_company_securities: '',
    portfolio_deal_name: '',
    representative: '',
    setup_cost: 20000,
    side_letters: 'false',
    sectors: [],
  });

  const defaultMasterSeries = 'Atomizer LLC';

  useEffect(() => {
    if (initialDeal?.high_volume_partner) {
      setBuildData((prev) => ({
        ...prev,
        master_series: initialDeal?.master_series,
        high_volume_partner: true,
      }));
    }
  }, [initialDeal]);

  const [unfilledFields, setUnfilledFields] = useState([]);

  const formValidation = () => {
    //* **** NEED TO VALIDATE CLOSING DATE STILL - NEED TO CHECK FOR PROPER DATE FORMAT *********

    const unvalidatedFields = [];
    const fieldsToFill = [];
    // fields always checked below
    if (!buildData.portfolio_company_name) {
      fieldsToFill.push('portfolio_company_name');
      unvalidatedFields.push('Portfolio Company Name');
    }
    if (!buildData.portfolio_company_securities) {
      fieldsToFill.push('portfolio_company_securities');
      unvalidatedFields.push('Portfolio Company Securities');
    }
    if (!buildData.portfolio_deal_name) {
      fieldsToFill.push('portfolio_deal_name');
      unvalidatedFields.push('Deal Name');
    }
    if (!buildData.manager_name) {
      fieldsToFill.push('manager_name');
      unvalidatedFields.push('Manager Name');
    }
    if (!buildData.representative) {
      fieldsToFill.push('representative');
      unvalidatedFields.push('Representative of Manager');
    }
    if (!buildData.estimated_spv_quantity && buildData.master_series === defaultMasterSeries) {
      fieldsToFill.push('estimated_spv_quantity');
      unvalidatedFields.push('Estimated Number of SPVs');
    }
    if (!buildData.minimum_investment) {
      fieldsToFill.push('minimum_investment');
      unvalidatedFields.push('Minimum Investment');
    }
    if (!buildData.sectors.length) {
      fieldsToFill.push('sectors');
      unvalidatedFields.push('Sectors');
    }
    if (!buildData.deal_stage.length) {
      fieldsToFill.push('deal_stage');
      unvalidatedFields.push('Deal Stage');
    }

    // conditionally checked fields below here
    if (buildData.master_series === defaultMasterSeries && buildData.estimated_spv_quantity >= 5) {
      fieldsToFill.push('master_series');
      unvalidatedFields.push('Master Series Name');
    }
    if (
      (!buildData.custom_management_fee || buildData.custom_management_fee === 'false') &&
      buildData.management_fee_value === 'Custom'
    ) {
      fieldsToFill.push('custom_management_fee');
      unvalidatedFields.push('Custom Management Fee');
    }
    if (
      (!buildData.custom_carry_fee || buildData.custom_carry_fee === 'false') &&
      buildData.carry_fee_value === 'Custom'
    ) {
      fieldsToFill.push('custom_carry_fee');
      unvalidatedFields.push('Custom Carry Fee');
    }
    if (
      !buildData.custom_reporting_adviser &&
      buildData.allocations_reporting_adviser === 'false'
    ) {
      fieldsToFill.push('custom_reporting_adviser');
      unvalidatedFields.push('Advisor Name');
    }
    if (
      !buildData.international_company_country &&
      buildData.international_company_status === 'true'
    ) {
      fieldsToFill.push('international_company_country');
      unvalidatedFields.push('Country of International Company');
    }
    if (
      !buildData.international_investors_countries.length &&
      buildData.international_investors_status === 'true'
    ) {
      fieldsToFill.push('international_investors_countries');
      unvalidatedFields.push('Countries of International Investors');
    }

    setUnfilledFields(fieldsToFill);

    return {
      isValidated: !unvalidatedFields.length,
      unvalidatedFields,
    };
  };

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
          organization_id: organization._id,
          allocations_reporting_adviser: buildData.allocations_reporting_adviser,
          asset_type: buildData.asset_type,
          carry_fee: {
            type: buildData.carry_fee_type,
            value: buildData.carry_fee_value,
            custom: buildData.custom_carry_fee,
          },
          closing_date: buildData.closing_date,
          custom_investment_agreement: buildData.custom_investment_agreement,
          deal_stage: buildData.deal,
          estimated_spv_quantity: Number(buildData.estimated_spv_quantity),
          high_volume_partner: buildData.estimated_spv_quantity >= 5,
          international_company: {
            status: buildData.international_company_status,
            country: buildData.international_company_country,
          },
          international_investors: {
            status: buildData.international_investors_status,
            countries: buildData.international_investors_countries,
          },
          custom_reporting_adviser: buildData.custom_reporting_adviser,
          management_fee: {
            type: buildData.management_fee_type,
            value: buildData.management_fee_value,
            custom: buildData.custom_management_fee,
          },
          management_fee_frequency: buildData.management_fee_frequency,
          manager_name: buildData.manager_name,
          master_series: buildData.master_series || defaultMasterSeries,
          minimum_subscription_amount: buildData.minimum_investment,
          offering_type: buildData.offering_type,
          portfolio_company_name: buildData.portfolio_company_name,
          portfolio_company_securities: buildData.portfolio_company_securities,
          portfolio_deal_name: buildData.portfolio_deal_name,
          representative: buildData.representative,
          sectors: buildData.sectors,
          setup_cost: buildData.setup_cost,
          side_letters: buildData.side_letters,
        },
      },
    });
  };

  const handleChange = ({ target }) => {
    const isNotInternational =
      target.name === 'international_company_status' && (target.value === 'false' || 'unknown');
    const isNotInternationalInvestors =
      target.name === 'international_investors_status' && (target.value === 'false' || 'unknown');
    const isNotMasterSeries = target.name === 'estimated_spv_quantity' && target.value < 5;
    const isAllocationsTheAdvisor = target.name === 'allocations_reporting_adviser' && target.value;
    const isNotCustomManagementFee =
      target.name === 'management_fee_value' && target.value !== 'Custom';
    const isNotCustomCarryFee = target.name === 'carry_fee_value' && target.value !== 'Custom';

    setBuildData((prev) => {
      const newBuildObject = {
        ...prev,
        // IS NULL CORRECT?
        master_series: isNotMasterSeries ? null : prev.master_series,
        custom_reporting_adviser: isAllocationsTheAdvisor ? '' : prev.custom_reporting_adviser,
        custom_management_fee: isNotCustomManagementFee ? 'false' : prev.custom_management_fee,
        custom_carry_fee: isNotCustomCarryFee ? 'false' : prev.custom_carry_fee,
        international_company_country: isNotInternational ? '' : prev.international_company_country,
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
        border: unfilledFields.includes('international_company_country')
          ? '2px solid red'
          : '1pm solid hsl(0, 0%, 80%)',
      }),
      placeholder: (styles, data) => ({
        ...styles,
        color: data.children === placeHolder ? '#999' : '#000',
      }),
    };

    return (
      <Select
        id="international_company_country"
        label="International Company by Country"
        menuPosition="fixed"
        styles={customStyles}
        value={buildData.international_company_country || ''}
        options={countryNames.map((country) => ({ value: country, label: country })) || ''}
        placeholder={buildData.international_company_country || placeHolder}
        onChange={(option) => {
          const newEvent = {
            target: {
              name: 'international_company_country',
              value: option.value,
            },
          };
          handleChange(newEvent);
          setUnfilledFields((prev) =>
            prev.filter((field) => field !== 'international_company_country'),
          );
        }}
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
        border: unfilledFields.includes('international_investors_countries')
          ? '2px solid red'
          : '1pm solid hsl(0, 0%, 80%)',
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
          setUnfilledFields((prev) =>
            prev.filter((field) => field !== 'international_investors_countries'),
          );
        }}
        isMulti
      />
    );
  }

  const formFieldProps = {
    buildData,
    setBuildData,
    handleChange,
    handleTooltip,
    setUnfilledFields,
    unfilledFields,
    customInputStyles,
    classes,
    openTooltip,
  };

  return (
    <>
      <BasicInfo
        dealType={dealType}
        buildData={buildData}
        setBuildData={setBuildData}
        handleChange={handleChange}
        parentClasses={classes}
        handleTooltip={handleTooltip}
        openTooltip={openTooltip}
        unfilledFields={unfilledFields}
        setUnfilledFields={setUnfilledFields}
      />
      <Paper className={classes.paper}>
        <form noValidate autoComplete="off">
          <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
            2. Deal Terms
          </Typography>
          <Grid container spacing={2} className={classes.inputGridContainer}>
            <ManagementFee {...formFieldProps} />

            <ManagementFeeFrequency {...formFieldProps} />

            <CarryFee {...formFieldProps} />

            <SideLetters {...formFieldProps} />

            <MinimumInvestment {...formFieldProps} />
          </Grid>
        </form>
      </Paper>
      <Paper className={classes.paper}>
        <form noValidate autoComplete="off">
          <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
            3. Offering Terms
          </Typography>
          <Grid container spacing={1} className={classes.inputGridContainer}>
            <ReportingAdviser {...formFieldProps} />

            <OfferingType {...formFieldProps} />

            <CustomInvestmentAgreement {...formFieldProps} />
          </Grid>
        </form>
      </Paper>
      <Paper className={classes.paper}>
        <form noValidate autoComplete="off">
          <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
            4. Demographics
          </Typography>
          <Grid container spacing={1} className={classes.inputGridContainer}>
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
            5. Upload Your Documents
          </Typography>
          <UploadDocs deal={initialDeal} />
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
                const { isValidated, unvalidatedFields } = formValidation();
                if (!isValidated) {
                  toast.error(
                    <div>
                      Please fill in the following fields:{' '}
                      {unvalidatedFields.map((field) => (
                        <div>• {field}</div>
                      ))}
                    </div>,
                    { autoClose: 10000 },
                  );
                  return;
                }
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

export default function NewDealForm() {
  const { userProfile, loading: authLoading } = useAuth();
  const [createBuild, { data: initialDeal, loading }] = useMutation(CREATE_BUILD);
  const [setBuildInfo, { data: updatedDeal, loading: updatedDealLoading }] =
    useMutation(SET_BUILD_INFO);

  const organization = useCurrentOrganization();

  const { type: dealType } = useParams();

  // Page
  const [page, setPage] = useState(0);

  useEffect(() => {
    // if there is no build data/deal_id, we create a new build (default info pulled from the backend)
    if (organization) {
      if (!localStorage.getItem('buildData') && !localStorage.getItem('buildDeal')) {
        createBuild({ variables: { payload: { organization_id: organization._id } } });
      }
    }
  }, [organization]);

  useEffect(() => {
    // if we finished creating the build, set the deal info in local storage
    if (initialDeal) {
      localStorage.setItem('buildDeal', JSON.stringify(initialDeal.deal));
    }
  }, [loading, initialDeal?.deal]);

  const titleMap = {
    spv: 'SPV',
    fund: 'Fund',
  };

  const pages = [
    {
      title: `Build your ${titleMap[dealType]}`,
      Component: (
        <BuildDetails
          dealType={dealType}
          organization={organization}
          userProfile={userProfile}
          page={page}
          setPage={setPage}
          setBuildInfo={setBuildInfo}
          deal_id={initialDeal?.deal?._id}
          waitingOnInitialDeal={loading}
          initialDeal={
            initialDeal?.deal ? initialDeal?.deal : JSON.parse(localStorage.getItem('buildDeal'))
          }
        />
      ),
    },
    {
      title: 'Review and sign terms',
      Component: (
        <AgreementSigner
          deal={
            initialDeal?.deal ? initialDeal?.deal : JSON.parse(localStorage.getItem('buildDeal'))
          }
          page={page}
          setPage={setPage}
          updatedDeal={updatedDeal}
          updatedDealLoading={updatedDealLoading}
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
