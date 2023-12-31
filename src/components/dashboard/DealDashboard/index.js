import React, { useState, useEffect, Suspense } from 'react';
import { toast } from 'react-toastify';
import { gql, useQuery } from '@apollo/client';
import { Redirect, useParams, withRouter } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Typography, Typography as AllocationsTypography } from '@allocations/design-system';
import { Box, Divider } from '@material-ui/core';
import Setup from './sections/Setup';
import Highlights from './sections/Highlights';
import InvestorStatus from './sections/InvestorStatus';
import Crypto from './sections/Crypto';
import Investments from './sections/Investments';
import { useFetch, useViewport } from '../../../utils/hooks';
import { useAuth } from '../../../auth/useAuth';
import AllocationsLoader from '../../utils/AllocationsLoader';
import useStyles from './styles';
import DealTypeSelector from './DealType';
import DealPage from '../Common/DealPage';
import HighlightedTabs from '../../utils/HighlightedTabs';
import Loader from '../../utils/Loader';
import { phone } from '../../../utils/helpers';
import RemoteInvestorsDocuments from '../../RemoteInvestorDocuments';
import Investors from './sections/Investors';
import DocumentsTab from './sections/DocumentsTab';
import LegacyInvestors from './sections/Investors/LegacyInvestors';
import TransactionsList from '../../Banking/TransactionsList';

const RemoteOnboarding = React.lazy(() => import('invest/Onboarding'));
const ProgressBar = React.lazy(() => import('build/ProgressBar'));
const RemotePostBuild = React.lazy(() => import('build/PostBuild'));

const GET_DEAL = gql`
  query GetDeal($_id: String!) {
    deal(_id: $_id) {
      _id
      company_name
      company_description
      target
      raised
      slug
      date_closed
      investmentType
      status
      AUM
      organization {
        _id
        name
        high_volume_partner
      }
      banking {
        routing_number
        account_number
        balance
        transactions {
          _id
          amount
          date
          name
          type
          status
          category
          investment_id
        }
      }
      dealParams {
        signDeadline
        wireDeadline
        dealType
        dealMultiple
        totalCarry
        fundTotalCarry
        managementFees
        managementFeesDollar
        fundManagementFeesDollar
        fundManagementFees
        managementFeeType
        fundManagementFeeType
      }
      virtual_account_number
      viewedUsers {
        _id
        first_name
        last_name
        email
      }
      investments {
        _id
        amount
        capitalWiredAmount
        wired_at
        status
        submissionData {
          investor_type
          fullName
          legalName
        }
        investor {
          _id
          first_name
          last_name
          name
          email
          accredidation_status
        }
        documents {
          path
          link
        }
      }
    }
    user {
      _id
      admin
      documents
      created_at
    }
  }
`;

let fundTabs = [
  'Highlights',
  'Investments',
  'Investor Onboarding Status',
  'Investors',
  'Banking',
  'Documents',
  'Deal Page',
];

// Base here is OPS_ACCOUNTING
let BASE = 'app3m4OJvAWUg0hng';
const INVESTMENTS_TABLE = 'Investments';
const DEALS_TABLE = 'Deals';

let spvTabs = ['Investor Onboarding Status', 'Investors', 'Banking', 'Documents', 'Deal Page'];

const DealDashboard = () => {
  const { width } = useViewport();
  const params = useParams();
  const { deal_id } = params;
  const { organization: orgSlug } = params;
  const classes = useStyles();

  const typographyVariant = width > phone ? 'heading2' : 'heading4';

  if (orgSlug === 'demo-fund') {
    // BASE HERE IS Demo Fund
    BASE = 'app53fOK2CmyuzKXK';
    // INVESTMENTS_TABLE = 'Sales Demo';
  }

  const {
    capitalCallsDealSpecific,
    cryptoPaymentInBuild,
    dealProgress,
    investApiDocsAndInvestments,
    investorList,
    dealBanking,
  } = useFlags();
  const { userProfile } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [tabName, setTabName] = useState(fundTabs[0]);
  const [serviceDeal, setServiceDeal] = useState(null);
  const [dealName, setDealName] = useState('');
  const [dashboardTabs, setDashboardTabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [atDealData, setAtDealData] = useState({});
  const [openTooltip, setOpenTooltip] = useState('');

  const { data: dealData, refetch } = useQuery(GET_DEAL, {
    variables: { _id: deal_id },
  });
  const checkedDealName = encodeURIComponent(dealName);
  const checkedAtDealDataName = encodeURIComponent(atDealData?.name);

  if (userProfile.admin && cryptoPaymentInBuild) {
    // const cryptoTabName = 'Crypto';
    // // Only add crypto tab if user is admin
    // if (!fundTabs.includes(cryptoTabName)) fundTabs.push(cryptoTabName);
    // if (!spvTabs.includes(cryptoTabName)) spvTabs.push(cryptoTabName);
  }

  const { data: atDeal } = useFetch(
    BASE,
    dealName && DEALS_TABLE,
    dealName && `({Deal Name}="${checkedDealName}")`,
  );

  const { data: atFundData } = useFetch(
    BASE,
    INVESTMENTS_TABLE,
    `{Deals}="${checkedAtDealDataName}"`,
  );

  useEffect(() => {
    spvTabs = ['Investor Onboarding Status', 'Investors', 'Banking', 'Documents', 'Deal Page'];
    (async () => {
      try {
        if (dealProgress) {
          const res = await fetch(
            `${process.env.REACT_APP_BUILD_FRONTEND_URL}/api/deals/${deal_id}`,
          );
          const deal = await res.json();
          // if there are tasks in every phase
          if (deal?.phases?.every((phase) => phase.tasks.length > 0) && deal?.phases.length === 6) {
            spvTabs = [
              'Deal Progress',
              'Investor Onboarding Status',
              'Investors',
              'Banking',
              'Documents',
              'Deal Page',
            ];

            fundTabs = [
              'Deal Progress',
              'Highlights',
              'Investments',
              'Investor Onboarding Status',
              'Investors',
              'Banking',
              'Documents',
              'Deal Page',
            ];

            setTabIndex(0);
            setTabName('Deal Progress');
          }

          setServiceDeal(deal);
          setDealName(deal?.name);
        }
      } catch (e) {
        console.log('ERROR:', e);
      }
    })();
  }, [deal_id]);

  useEffect(() => {
    if (dealData?.deal?.company_name) {
      setDealName(dealData?.deal?.company_name);
    }
  }, [dealData]);

  useEffect(() => {
    if (dealData && Object.keys(dealData).length) {
      const newTabs = dealData?.deal?.investmentType === 'fund' ? fundTabs : spvTabs;

      const newTabIndex = newTabs.indexOf(tabName);
      const newIndex = newTabIndex < 0 ? 0 : newTabIndex;
      const newTabName = newTabs[newIndex];
      setTabIndex(newIndex);
      setTabName(newTabName);

      setDashboardTabs(newTabs);
    }
  }, [dealData, serviceDeal]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab')) {
      const tabIndex = dashboardTabs.findIndex((tab) => tab === params.get('tab'));
      setTabName(dashboardTabs[tabIndex === -1 ? 0 : tabIndex]);
      setTabIndex(tabIndex === -1 ? 0 : tabIndex);
    }
  }, [dashboardTabs]);

  useEffect(() => {
    if (atFundData) setLoading(false);
  }, [atFundData]);

  useEffect(() => {
    if (atDeal && atDeal.length) {
      const data = atDeal[0].fields;
      setAtDealData({ name: data['Deal Name'], id: atDeal[0].id });
    } else if (atDeal) {
      setAtDealData({ name: `Deal Name ${dealName} Not found in AirTable`, id: '' });
    }
  }, [atDeal]);

  const handleLinkCopy = () => {
    if (orgSlug && dealData?.deal?.slug) {
      navigator.clipboard.writeText(
        window.origin + (`/deals/${orgSlug}/${dealData.deal.slug}` || ''),
      );
      toast.info('Copied deal link to clipboard');
    }
  };

  const goToDeal = () => {
    if (orgSlug && dealData?.deal?.slug) {
      window.open(`/deals/${orgSlug}/${dealData.deal.slug}`);
    }
  };

  const goToEditDeal = () => {
    if (orgSlug && dealData?.deal?._id) {
      window.open(`/admin/${orgSlug}/deals/${dealData.deal._id}/edit`);
    }
  };

  const handleTabChange = (event, newValue) => {
    const tabName = dashboardTabs[newValue];
    setTabName(tabName);
    setTabIndex(newValue);
  };

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };

  const getTabContent = () => {
    let fundData = atFundData.map((d) => d.fields);
    if (orgSlug === 'browder-capital') {
      fundData = fundData.filter((i) => {
        return i['Fund Name'] === dealName;
      });
    }

    switch (tabName) {
      case 'Setup':
        return (
          <Setup
            classes={classes}
            data={dealData}
            openTooltip={openTooltip}
            handleTooltip={handleTooltip}
            subscriptionData={{}}
          />
        );

      case 'Highlights':
        return (
          <Highlights
            classes={classes}
            orgSlug={orgSlug}
            data={fundData}
            dealData={dealData}
            openTooltip={openTooltip}
            handleTooltip={handleTooltip}
          />
        );

      case 'Investments':
        return <Investments classes={classes} data={fundData} />;

      case 'Investor Onboarding Status':
        return (
          <InvestorStatus
            classes={classes}
            width={width}
            data={dealData}
            dealType={dealData?.deal?.dealParams?.dealType}
            superAdmin={dealData?.user?.admin}
            refetch={refetch}
          />
        );
      case 'Investors':
        return (capitalCallsDealSpecific || []).includes(dealData?.deal?._id) ? (
          <Suspense fallback={<AllocationsLoader />}>
            <RemoteOnboarding deal_id={dealData?.deal?._id} />
          </Suspense>
        ) : investorList ? (
          <Investors investments={dealData.deal.investments} />
        ) : (
          <LegacyInvestors
            classes={classes}
            data={dealData}
            orgSlug={orgSlug}
            userProfile={userProfile}
          />
        );

      case 'Documents':
        return investApiDocsAndInvestments ? (
          <RemoteInvestorsDocuments />
        ) : (
          <DocumentsTab classes={classes} data={dealData} refetch={refetch} />
        );

      case 'Deal Page':
        return (
          <DealPage
            classes={classes}
            orgSlug={orgSlug}
            dealData={dealData}
            goToDeal={goToDeal}
            goToEditDeal={goToEditDeal}
            handleLinkCopy={handleLinkCopy}
          />
        );
      case 'Crypto':
        return (
          <Crypto
            orgSlug={orgSlug}
            classes={classes}
            deal_id={dealData.deal._id}
            virtual_account_number={dealData.deal.virtual_account_number || null}
            openTooltip={openTooltip}
            handleTooltip={handleTooltip}
          />
        );
      case 'Deal Progress':
        return (
          <div style={{ marginTop: '20px' }}>
            <Suspense fallback={<Loader />}>
              <RemotePostBuild user={userProfile} deal_id={deal_id} progressBar={false} />
            </Suspense>
          </div>
        );

      case 'Banking':
        return (
          <>
            {dealBanking ? (
              <TransactionsList transactions={dealData.deal?.banking?.transactions ?? []} />
            ) : (
              <Box>
                <Divider className={classes.divider} />
                <Typography align="center" variant="subheading" content="Coming Soon" />
              </Box>
            )}
          </>
        );
      default:
        return <p>No Data</p>;
    }
  };

  const getTotalRaiseAmount = (total, progress) => {
    if (progress > total) return 100;
    if (progress === 0) return 0;
    return (progress / total) * 100;
  };

  const [openModal, setOpenModal] = useState(false);
  if (!dealData || !atFundData || loading)
    return (
      <div className={classes.loaderContainer}>
        <AllocationsLoader />
      </div>
    );

  if (dealData?.deal?.status === 'archived' || serviceDeal?.phase === 'archived')
    return <Redirect to="/404" />;
  return (
    <div className={`${classes.dashboardContainer} FundManagerDashboard`}>
      {dealProgress ? (
        <Suspense fallback={<Loader />}>
          <ProgressBar
            deal={serviceDeal || { name: '' }}
            progress={getTotalRaiseAmount(serviceDeal?.target_raise_goal || 0, dealData?.deal?.AUM)}
            currentAmount={dealData?.deal?.AUM}
            goalAmount={serviceDeal?.target_raise_goal || 0}
          />
        </Suspense>
      ) : (
        <div className={classes.titleContainer}>
          <AllocationsTypography
            component="div"
            content={dealName}
            fontWeight={700}
            variant={typographyVariant}
          />
        </div>
      )}
      <div style={{ margin: '1rem 0' }}>
        <div style={{ position: 'relative' }}>
          <HighlightedTabs
            tabs={dashboardTabs}
            tabIndex={tabIndex}
            handleTabChange={handleTabChange}
            rootStyle={{ padding: '0 8px' }}
          />
          {getTabContent()}
        </div>
      </div>
      <DealTypeSelector isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default withRouter(DealDashboard);
