import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useFlags } from 'launchdarkly-react-client-sdk';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Button, Paper, Grid, FormControl } from '@material-ui/core';
import { useParams, useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import BasicInfo from './FormComponents/TypeSelector/index';
import UploadDocs from './FormComponents/UploadDocs/index';
import { useAuth } from '../../../auth/useAuth';
import { useCurrentOrganization } from '../../../state/current-organization';
import { useViewport } from '../../../utils/hooks';
import AgreementSigner from './FormComponents/AgreementSigner';
import NewBuildModal from '../NewBuildModal';
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
} from './FormFields';

const CREATE_NEW_DEAL = gql`
  mutation createNewDeal($payload: Object) {
    createNewDeal(payload: $payload) {
      deal {
        _id
      }
      phases {
        _id
        name
        tasks {
          _id
          title
          type
        }
      }
      documents {
        dataRequestId: id
        tokenId: token_id
        tokenSecret: token_secret
        task {
          _id
          title
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

const BuildDetails = ({ userProfile, auth, dealType, page, setPage, createNewDeal }) => {
  const classes = useStyles();
  const { width } = useViewport();
  const { cryptoPaymentInBuild, buildModals } = useFlags();

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
    reporting_adviser: undefined,
    deal_stage: '',
    fund_name: '',
    general_partner_representative: '',
    gp_entity_name: undefined,
    high_volume_partner: false,
    international_company_status: 'false',
    international_company_country: '',
    international_investors_status: 'false',
    international_investors_countries: [],
    manager_name:
      userProfile.first_name && userProfile.last_name
        ? `${userProfile.first_name} ${userProfile.last_name}`
        : undefined,
    management_fee_frequency: 'one time',
    management_fee_type: 'percent',
    management_fee_value: '2',
    memo: '',
    minimum_investment: 10000,
    name: '',
    need_gp_entity: 'true',
    number_of_investments: undefined,
    offering_type: '506b',
    portfolio_company_name: '',
    portfolio_company_securities: '',
    public_pitch_deck: false,
    representative: '',
    setup_cost: 20000,
    side_letters: 'false',
    sectors: [],
    target_raise_goal: 100000,
    type: dealType,
    type_of_investors: 'Accredited Investors (3(c)(1))',
  });

  const sectionOne = {
    spv: [
      'portfolio_company_name',
      'portfolio_company_securities',
      'name',
      'manager_name',
      'representative',
      'deal_stage',
      'sectors',
    ],
    fund: [
      'name',
      'number_of_investments',
      'manager_name',
      'representative',
      'need_gp_entity',
      'deal_stage',
      'sectors',
    ],
  };

  const sectionOneCheck = () => {
    let status = true;
    if (buildData.need_gp_entity === 'false' && !buildData.gp_entity_name) {
      status = false;
    }
    return status;
  };

  const sectionOneComplete =
    sectionOne[dealType]?.every((field) => buildData[field]) && sectionOneCheck();

  const sectionTwo = {
    spv: [
      'management_fee_value',
      'management_fee_frequency',
      'carry_fee_value',
      'side_letters',
      'target_raise_goal',
      'minimum_investment',
      'accept_crypto',
    ],
    fund: [
      'management_fee_value',
      'management_fee_frequency',
      'carry_fee_value',
      'side_letters',
      'type_of_investors',
    ],
  };

  const sectionTwoCheck = () => {
    let status = true;
    if (
      buildData.management_fee_value === 'Custom' &&
      (buildData.custom_management_fee === 'false' || buildData.custom_management_fee === '')
    ) {
      status = false;
    }
    if (
      buildData.carry_fee_value === 'Custom' &&
      (buildData.custom_carry_fee === 'false' || buildData.custom_carry_fee === '')
    ) {
      status = false;
    }
    return status;
  };

  const sectionTwoComplete =
    sectionTwo[dealType]?.every((field) => buildData[field]) && sectionTwoCheck();

  const sectionThree = [
    'allocations_reporting_adviser',
    'offering_type',
    'custom_investment_agreement',
  ];

  const sectionThreeCheck = () => {
    let status = true;
    if (buildData.allocations_reporting_adviser === 'false' && !buildData.reporting_adviser) {
      status = false;
    }
    return status;
  };

  const sectionThreeComplete =
    sectionThree.every((field) => buildData[field]) && sectionThreeCheck();

  const sectionFour = ['international_company_status', 'international_investors_status'];

  const sectionFourCheck = () => {
    let status = true;
    if (
      buildData.international_company_status === 'true' &&
      (!buildData.international_company_country || buildData.international_company_country === '')
    ) {
      status = false;
    }
    if (
      buildData.international_investors_status === 'true' &&
      !buildData.international_investors_countries.length
    ) {
      status = false;
    }
    return status;
  };

  const sectionFourComplete = sectionFour.every((field) => buildData[field]) && sectionFourCheck();

  const sectionSixComplete = !!buildData.memo;

  const [unfilledFields, setUnfilledFields] = useState([]);

  const formValidation = () => {
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
      if (!buildData.name) {
        unvalidatedFieldsToFill('name', 'Deal Name');
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
      if (!buildData.name) {
        unvalidatedFieldsToFill('name', 'Fund Name');
      }
      if (!buildData.manager_name) {
        unvalidatedFieldsToFill('manager_name', 'General Partner Name');
      }
      if (!buildData.representative) {
        unvalidatedFieldsToFill('representative', 'General Partner Representative and Title');
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
    if (!buildData.reporting_adviser && buildData.allocations_reporting_adviser === 'false') {
      unvalidatedFieldsToFill('reporting_adviser', 'Advisor Name');
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
    if (buildModals) {
      const localStorageBuild = localStorage.getItem('buildData');
      if (localStorageBuild && buildModals) {
        const parsedBuildData = JSON.parse(localStorageBuild);
        setBuildData(parsedBuildData);
      }
    } else {
      localStorage.removeItem('buildData');
    }
  }, []);

  const handleSubmit = ({ organization, isNewHVP = false }) => {
    createNewDeal({
      variables: {
        payload: {
          organization,
          isNewHVP,
          organization_id: organization?._id,
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
          deal_stage: buildData.deal,
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
          memo: buildData.memo,
          minimum_investment: Number(buildData.minimum_investment),
          name: buildData.name,
          need_gp_entity: buildData.need_gp_entity,
          number_of_investments: Number(buildData.number_of_investments),
          offering_type: buildData.offering_type,
          portfolio_company_name: buildData.portfolio_company_name,
          portfolio_company_securities: buildData.portfolio_company_securities,
          public_pitch_deck: buildData.public_pitch_deck,
          reporting_adviser: buildData.reporting_adviser,
          representative: buildData.representative,
          sectors: buildData.sectors,
          setup_cost: buildData.setup_cost,
          side_letters: buildData.side_letters,
          target_raise_goal: buildData.target_raise_goal,
          type: dealType,
          type_of_investors: buildData.type_of_investors,
        },
      },
    });

    setPage((page) => page + 1);
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
        reporting_adviser: isAllocationsTheAdvisor ? '' : prev.reporting_adviser,
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
    dealType,
    buildData,
    setBuildData,
    handleChange,
    handleTooltip,
    setUnfilledFields,
    unfilledFields,
    customInputStyles,
    classes,
    openTooltip,
    width,
  };

  const history = useHistory();

  const modalStartPage = () => {
    if (buildModals) {
      if (localStorage.getItem('buildData') || localStorage.getItem('buildDeal')) {
        return 'new_or_current';
      }
    }
    return 'deal_type_selector';
  };

  const [openModal, setOpenModal] = useState(!auth.isAuthenticated);
  const [newBuildModalPage, setNewBuildModalPage] = useState(modalStartPage());

  const closeModal = () => setOpenModal(false);
  const closeModalAndReset = (page = 'select_org') => {
    setNewBuildModalPage(page);
    closeModal();
  };
  const openModaltoPage = (page) => {
    setNewBuildModalPage(page);
    setOpenModal(true);
  };

  const sectionComplete = (section) => {
    return {
      borderLeft: width >= 675 ? (section ? 'solid 3px #ECF3FF' : 'solid 3px #EBEBEB') : 'none',
    };
  };

  return (
    <>
      <NewBuildModal
        dealType={dealType}
        isOpen={openModal}
        closeModal={closeModal}
        page={newBuildModalPage}
        setPage={setNewBuildModalPage}
        setBuildFormPage={setPage}
        refetchUserProfile={auth.refetchUserProfile}
        next={{
          deal_type_selector: {
            spv: () => {
              history.push('/public/new-build/spv');
              closeModal();
            },
            fund: () => {
              history.push('/public/new-build/fund');
              closeModal();
            },
          },
          select_org: ({ selectedOrg, setCurrentOrganization }) => {
            if (selectedOrg === 'Create New Organization') {
              setNewBuildModalPage('create_new_org');
              return;
            }
            setCurrentOrganization(selectedOrg);
            handleSubmit({ organization: selectedOrg });
            closeModal();
          },
          create_new_org: ({ estimatedSPVQuantity, createOrganization }) => {
            if (estimatedSPVQuantity >= 5) {
              setNewBuildModalPage('high_volume_partnerships');
            }
            // IF LESS THAN 5 ESTIMATED SPVS CREATE NEW ORG HERE RIGHT AWAY THEN PUSH TO SERVICE AGREEMENT //
            else {
              createOrganization().then(({ data }) => {
                handleSubmit({ organization: data?.createOrganization });
                closeModalAndReset();
              });
            }
          },
          high_volume_partnerships: ({ createOrganization }) => {
            createOrganization().then(({ data }) => {
              handleSubmit({ organization: data?.createOrganization, isNewHVP: true });
              closeModalAndReset();
            });
          },
        }}
        prev={{
          select_org: closeModal,
          create_new_org: () => setNewBuildModalPage('select_org'),
          high_volume_partnerships: () => setNewBuildModalPage('create_new_org'),
        }}
        onClose={{
          deal_type_selector: () => dealType && closeModalAndReset(),
          select_org: () => closeModalAndReset(),
          create_new_org: () => closeModalAndReset(),
          high_volume_partnerships: () => closeModalAndReset(),
        }}
      />
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
        sectionOneComplete={sectionOneComplete}
        sectionComplete={sectionComplete}
      />

      <Paper className={classes.paper}>
        <Grid container className={classes.sectionHeader}>
          <Grid
            item
            className={classes.sectionHeaderNumber}
            style={{ backgroundColor: sectionTwoComplete ? '#0461ff' : '#EBEBEB' }}
          >
            2
          </Grid>
          <Typography
            variant="h6"
            gutterBottom
            className={classes.sectionHeaderText}
            style={{ color: sectionTwoComplete ? '#2A2B54' : '#8E9394' }}
          >
            Deal Terms
          </Typography>
        </Grid>
        <Grid
          container
          className={classes.outerSection}
          style={sectionComplete(sectionTwoComplete)}
        >
          <form noValidate autoComplete="off">
            <Grid container spacing={2} className={classes.inputGridContainer}>
              <ManagementFee {...formFieldProps} />
              <ManagementFeeFrequency {...formFieldProps} />
              <CarryFee {...formFieldProps} />
              <SideLetters {...formFieldProps} />
              {dealType === 'spv' && <TargetRaiseGoal {...formFieldProps} />}
              {dealType === 'spv' && <MinimumInvestment {...formFieldProps} />}
              {dealType === 'fund' && <AcceptedInvestorTypes {...formFieldProps} />}
              {dealType === 'spv' && cryptoPaymentInBuild && <AcceptCrypto {...formFieldProps} />}
            </Grid>
          </form>
        </Grid>
      </Paper>

      <Paper className={classes.paper}>
        <Grid container className={classes.sectionHeader}>
          <Grid
            item
            className={classes.sectionHeaderNumber}
            style={{ backgroundColor: sectionThreeComplete ? '#0461ff' : '#EBEBEB' }}
          >
            3
          </Grid>
          <Typography
            variant="h6"
            gutterBottom
            className={classes.sectionHeaderText}
            style={{ color: sectionThreeComplete ? '#2A2B54' : '#8E9394' }}
          >
            Offering Terms
          </Typography>
        </Grid>
        <Grid
          container
          className={classes.outerSection}
          style={sectionComplete(sectionThreeComplete)}
        >
          <form noValidate autoComplete="off" style={{ width: '100%' }}>
            <Grid container spacing={1} className={classes.inputGridContainer}>
              <ReportingAdviser {...formFieldProps} />
              <OfferingType {...formFieldProps} />
              <CustomInvestmentAgreement {...formFieldProps} />
            </Grid>
          </form>
        </Grid>
      </Paper>

      <Paper className={classes.paper}>
        <Grid container className={classes.sectionHeader}>
          <Grid
            item
            className={classes.sectionHeaderNumber}
            style={{
              backgroundColor: sectionFourComplete ? '#0461ff' : '#EBEBEB',
              padding: '1px 1px 0px 0px',
            }}
          >
            4
          </Grid>
          <Typography
            variant="h6"
            gutterBottom
            className={classes.sectionHeaderText}
            style={{
              color: sectionFourComplete ? '#2A2B54' : '#8E9394',
            }}
          >
            Demographics
          </Typography>
        </Grid>
        <Grid
          container
          className={classes.outerSection}
          style={sectionComplete(sectionFourComplete)}
        >
          <form noValidate autoComplete="off">
            <Grid container spacing={1} className={classes.inputGridContainer}>
              <InternationalCompanyStatus {...formFieldProps} />
              <InternationalInvestorsStatus {...formFieldProps} />
            </Grid>
          </form>
        </Grid>
      </Paper>

      {/* Upload docs moved to post build */}
      {/* <Paper className={classes.paper}>
        <Grid container className={classes.sectionHeader}>
          <Grid
            item
            className={classes.sectionHeaderNumber}
            style={{ backgroundColor: '#EBEBEB', padding: '1px 1px 0px 0px' }}
          >
            5
          </Grid>
          <Typography
            variant="h6"
            gutterBottom
            className={classes.sectionHeaderText}
            style={{ color: '#8E9394' }}
          >
            Upload Your Documents
          </Typography>
        </Grid>
        <Grid
          container
          justifyContent="center"
          className={classes.outerSection}
          style={sectionComplete(false)}
        >
          <form noValidate autoComplete="off">
            {/* {dealType && <UploadDocs deal={initialDeal} {...formFieldProps} />} 
          </form>
        </Grid>
      </Paper> */}

      <Paper className={classes.paper}>
        <Grid container className={classes.sectionHeader}>
          <Grid
            item
            className={classes.sectionHeaderNumber}
            style={{
              backgroundColor: sectionSixComplete ? '#0461ff' : '#EBEBEB',
              padding: '1px 1px 0px 0px',
            }}
          >
            6
          </Grid>
          <Typography
            variant="h6"
            gutterBottom
            className={classes.sectionHeaderText}
            style={{ color: sectionSixComplete ? '#2A2B54' : '#8E9394' }}
          >
            Final
          </Typography>
        </Grid>
        <div className={classes.outerSection} style={sectionComplete(sectionSixComplete)}>
          <form noValidate autoComplete="off" style={{ width: '100%' }}>
            <FormControl required disabled variant="outlined" style={{ width: 'inherit' }}>
              <NotesMemo {...formFieldProps} />
              <Button
                className={classes.continueButton}
                onClick={async () => {
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
                  if (!auth.isAuthenticated) {
                    auth.login().then(() => {
                      openModaltoPage('select_org');
                    });
                  } else {
                    openModaltoPage('select_org');
                  }
                }}
              >
                Continue
              </Button>
            </FormControl>
          </form>
        </div>
      </Paper>
    </>
  );
};

export default function NewDealForm() {
  const { isAuthenticated, userProfile, loginWithPopup, refetch: refetchUserProfile } = useAuth();

  // Page
  const [page, setPage] = useState(0);

  const [createNewDeal, { data: dealData, loading: createDealLoading, error: createDealError }] =
    useMutation(CREATE_NEW_DEAL, {
      onCompleted: ({ createNewDeal }) => {
        if (createNewDeal?.deal) {
          localStorage.setItem('buildDeal', JSON.stringify({ _id: createNewDeal?.deal?._id }));
        }
      },
      onError: (err) => {
        console.log('err', err);
      },
    });

  const organization = useCurrentOrganization();

  const { type: dealType } = useParams();

  const titleMap = {
    spv: 'SPV',
    fund: 'Fund',
  };

  const pages = [
    {
      title: `Build your ${titleMap[dealType] || 'SPV'}`,
      Component: (
        <BuildDetails
          dealType={dealType}
          organization={organization}
          userProfile={userProfile}
          auth={{ isAuthenticated, login: loginWithPopup, refetchUserProfile }}
          page={page}
          setPage={setPage}
          createNewDeal={createNewDeal}
        />
      ),
    },
    {
      title: 'Sign Agreements',
      Component: (
        <AgreementSigner
          dealData={dealData?.createNewDeal}
          createDealLoading={createDealLoading}
          error={createDealError}
          page={page}
          setPage={setPage}
        />
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs titles={pages.map(({ title }) => title)} page={page} />
      {pages[page].Component}
    </>
  );
}
