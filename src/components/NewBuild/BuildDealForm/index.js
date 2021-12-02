import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Button, Paper, Grid, FormControl } from '@material-ui/core';
import { useParams } from 'react-router';
import Typography from '@material-ui/core/Typography';
import BasicInfo from './FormComponents/TypeSelector/index';
import UploadDocs from './FormComponents/UploadDocs/index';
import { useAuth } from '../../../auth/useAuth';
import { useCurrentOrganization } from '../../../state/current-organization';
import AgreementSigner from './FormComponents/AgreementSigner';
import useStyles from '../BuildStyles';
import {
  AcceptCrypto,
  CarryFee,
  CustomInvestmentAgreement,
  InternationalCompanyStatus,
  InternationalInvestorsStatus,
  ManagementFee,
  ManagementFeeFrequency,
  MinimumInvestment,
  NotesMemo,
  OfferingType,
  ReportingAdviser,
  SideLetters,
  AcceptedInvestorTypes,
  TargetRaiseGoal,
  PitchDeckCheckBox,
} from './FormFields';

const CREATE_BUILD = gql`
  mutation createBuild($payload: Object) {
    deal: createBuild(payload: $payload) {
      _id
      type
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
    accept_crypto: 'false',
    allocations_reporting_adviser: 'true',
    asset_type: 'Startup',
    carry_fee_type: 'percent',
    carry_fee_value: '20',
    closing_date: moment(Date.now()).add(7, 'days').format('YYYY-MM-DD'),
    custom_carry_fee: 'false',
    custom_investment_agreement: 'false',
    custom_management_fee: 'false',
    custom_reporting_adviser: undefined,
    deal_stage: '',
    fund_name: '',
    general_partner_representative: '',
    gp_entity_name: null,
    high_volume_partner: false,
    international_company_status: 'false',
    international_company_country: '',
    international_investors_status: 'false',
    international_investors_countries: [],
    manager_name:
      userProfile.first_name && userProfile.last_name
        ? `${userProfile.first_name} ${userProfile.last_name}`
        : null,
    management_fee_frequency: 'one time',
    management_fee_type: 'percent',
    management_fee_value: '2',
    minimum_investment: 10000,
    need_gp_entity: 'true',
    number_of_investments: null,
    offering_type: '506b',
    portfolio_company_name: '',
    portfolio_company_securities: '',
    portfolio_deal_name: '',
    public_pitch_deck: false,
    representative: '',
    setup_cost: 20000,
    side_letters: 'false',
    sectors: [],
    target_raise_goal: 100000,
    term_of_fund: '10 years',
    type: dealType,
    type_of_investors: 'Accredited Investors (3(c)(1))',
  });

  const [unfilledFields, setUnfilledFields] = useState([]);

  const formValidation = () => {
    //* **** NEED TO VALIDATE CLOSING DATE STILL - NEED TO CHECK FOR PROPER DATE FORMAT *********

    const unvalidatedFields = [];
    const fieldsToFill = [];

    const unvalidatedFieldsToFill = (fieldToFill, unvalidatedField) => {
      fieldsToFill.push(fieldToFill);
      unvalidatedFields.push(unvalidatedField);
    };
    // fields always checked below
    if (dealType === 'spv') {
      if (!buildData.portfolio_company_name) {
        unvalidatedFieldsToFill('portfolio_company_name', 'Portfolio Company Name');
      }
      if (!buildData.portfolio_company_securities) {
        unvalidatedFieldsToFill('portfolio_company_securities', 'Portfolio Company Securities');
      }
      if (!buildData.portfolio_deal_name) {
        unvalidatedFieldsToFill('portfolio_deal_name', 'Deal Name');
      }
      if (!buildData.manager_name) {
        unvalidatedFieldsToFill('manager_name', 'Manager Name');
      }
      if (!buildData.representative) {
        unvalidatedFieldsToFill('representative', 'Representative of Manager');
      }
      if (!buildData.accept_crypto) {
        unvalidatedFieldsToFill('accept_crypto', 'Accept Crypto');
      }
      if (!buildData.target_raise_goal) {
        unvalidatedFieldsToFill('target_raise_goal', 'Target Raise Goal');
      }
    }
    if (dealType === 'fund') {
      if (!buildData.fund_name) {
        unvalidatedFieldsToFill('fund_name', 'Fund Name');
      }
      if (!buildData.manager_name) {
        unvalidatedFieldsToFill('manager_name', 'General Partner Name');
      }
      if (!buildData.general_partner_representative) {
        unvalidatedFieldsToFill(
          'general_partner_representative',
          'General Partner Representative and Title',
        );
      }
      if (!buildData.number_of_investments) {
        unvalidatedFieldsToFill('number_of_investments', 'Number of Investments');
      }
      if (!buildData.type_of_investors) {
        unvalidatedFieldsToFill('type_of_investors', 'Type of Investors');
      }
      if (buildData.need_gp_entity === 'false' && !buildData.gp_entity_name) {
        unvalidatedFieldsToFill('gp_entity_name', 'GP Entity Name');
      }
      if (!buildData.need_gp_entity) {
        unvalidatedFieldsToFill('need_gp_entity', 'Need GP Entity');
      }
    }

    if (!buildData.minimum_investment) {
      unvalidatedFieldsToFill('minimum_investment', 'Minimum Investment');
    }
    if (!buildData.sectors.length) {
      unvalidatedFieldsToFill('sectors', 'Sectors');
    }
    if (!buildData.deal_stage.length) {
      unvalidatedFieldsToFill('deal_stage', 'Deal Stage');
    }

    // conditionally checked fields below here
    if (
      (!buildData.custom_management_fee || buildData.custom_management_fee === 'false') &&
      buildData.management_fee_value === 'Custom'
    ) {
      unvalidatedFieldsToFill('custom_management_fee', 'Custom Management Fee');
    }
    if (
      (!buildData.custom_carry_fee || buildData.custom_carry_fee === 'false') &&
      buildData.carry_fee_value === 'Custom'
    ) {
      unvalidatedFieldsToFill('custom_carry_fee', 'Custom Carry Fee');
    }
    if (
      !buildData.custom_reporting_adviser &&
      buildData.allocations_reporting_adviser === 'false'
    ) {
      unvalidatedFieldsToFill('custom_reporting_adviser', 'Advisor Name');
    }
    if (
      !buildData.international_company_country &&
      buildData.international_company_status === 'true'
    ) {
      unvalidatedFieldsToFill('international_company_country', 'Country of International Company');
    }
    if (
      !buildData.international_investors_countries.length &&
      buildData.international_investors_status === 'true'
    ) {
      unvalidatedFieldsToFill(
        'international_investors_countries',
        'Countries of International Investors',
      );
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
          accept_crypto: buildData.accept_crypto === 'true',
          allocations_reporting_adviser: buildData.allocations_reporting_adviser,
          asset_type: buildData.asset_type,
          carry_fee: {
            type: buildData.carry_fee_type,
            value: buildData.carry_fee_value,
            custom: buildData.custom_carry_fee,
          },
          closing_date: buildData.closing_date,
          custom_investment_agreement: buildData.custom_investment_agreement,
          custom_reporting_adviser: buildData.custom_reporting_adviser,
          deal_stage: buildData.deal,
          fund_name: buildData.fund_name,
          general_partner_representative: buildData.general_partner_representative,
          gp_entity_name: buildData.gp_entity_name,
          international_company: {
            status: buildData.international_company_status,
            country: buildData.international_company_country,
          },
          international_investors: {
            status: buildData.international_investors_status,
            countries: buildData.international_investors_countries,
          },
          management_fee: {
            type: buildData.management_fee_type,
            value: buildData.management_fee_value,
            custom: buildData.custom_management_fee,
          },
          management_fee_frequency: buildData.management_fee_frequency,
          manager_name: buildData.manager_name,
          minimum_subscription_amount: Number(buildData.minimum_investment),
          need_gp_entity: buildData.need_gp_entity,
          number_of_investments: Number(buildData.number_of_investments),
          offering_type: buildData.offering_type,
          portfolio_company_name: buildData.portfolio_company_name,
          portfolio_company_securities: buildData.portfolio_company_securities,
          portfolio_deal_name: buildData.portfolio_deal_name,
          public_pitch_deck: buildData.public_pitch_deck,
          representative: buildData.representative,
          sectors: buildData.sectors,
          setup_cost: buildData.setup_cost,
          side_letters: buildData.side_letters,
          target_raise_goal: buildData.target_raise_goal,
          type: buildData.type,
          type_of_investors: buildData.type_of_investors,
        },
      },
    });
  };

  const handleChange = ({ target }) => {
    const isNotInternational =
      target.name === 'international_company_status' && (target.value === 'false' || 'unknown');
    const isNotInternationalInvestors =
      target.name === 'international_investors_status' && (target.value === 'false' || 'unknown');
    const isAllocationsTheAdvisor = target.name === 'allocations_reporting_adviser' && target.value;
    const isNotCustomManagementFee =
      target.name === 'management_fee_value' && target.value !== 'Custom';
    const isNotCustomCarryFee = target.name === 'carry_fee_value' && target.value !== 'Custom';
    const isGPEntityNeeded = target.name === 'need_gp_entity' && target.value === 'true';
    setBuildData((prev) => {
      const newBuildObject = {
        ...prev,
        custom_reporting_adviser: isAllocationsTheAdvisor ? '' : prev.custom_reporting_adviser,
        custom_management_fee: isNotCustomManagementFee ? 'false' : prev.custom_management_fee,
        custom_carry_fee: isNotCustomCarryFee ? 'false' : prev.custom_carry_fee,
        international_company_country: isNotInternational ? '' : prev.international_company_country,
        international_investors_countries: isNotInternationalInvestors
          ? []
          : prev.international_investors_countries,
        gp_entity_name: isGPEntityNeeded ? null : prev.gp_entity_name,
        [target.name]: target.value,
      };

      localStorage.setItem('buildData', JSON.stringify(newBuildObject));
      return newBuildObject;
    });
  };

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
            {dealType === 'spv' && <TargetRaiseGoal {...formFieldProps} />}
            {dealType === 'spv' && <MinimumInvestment {...formFieldProps} />}
            {dealType === 'fund' && <AcceptedInvestorTypes {...formFieldProps} />}
            {dealType === 'spv' && <AcceptCrypto {...formFieldProps} />}
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
            <InternationalCompanyStatus {...formFieldProps} />
            <InternationalInvestorsStatus {...formFieldProps} />
          </Grid>
        </form>
      </Paper>

      <Paper className={classes.paper}>
        <form noValidate autoComplete="off">
          <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
            5. Upload Your Documents
          </Typography>
          <UploadDocs deal={initialDeal} />
          <PitchDeckCheckBox {...formFieldProps} />
        </form>
      </Paper>

      <Paper className={classes.paper}>
        <form noValidate autoComplete="off">
          <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
            6. Final
          </Typography>
          <FormControl required disabled variant="outlined" className={classes.formContainers}>
            <NotesMemo {...formFieldProps} />
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
  const [setBuildInfo, { data: updatedDeal, loading: updatedDealLoading }] = useMutation(
    SET_BUILD_INFO,
    {
      onError: (err) => {
        console.log('err', err);
      },
    },
  );

  const organization = useCurrentOrganization();

  const { type: dealType } = useParams();

  // Page
  const [page, setPage] = useState(0);

  useEffect(() => {
    // if there is no build data/deal_id, we create a new build (default info pulled from the backend)
    if (!localStorage.getItem('buildData') && !localStorage.getItem('buildDeal')) {
      createBuild({
        variables: { payload: { type: dealType } },
      });
    }
  }, []);

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
