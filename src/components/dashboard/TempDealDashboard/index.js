import React, { useState, useEffect, Suspense } from 'react';
import { toast } from 'react-toastify';
import { gql, useQuery } from '@apollo/client';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Typography as AllocationsTypography } from '@allocations/design-system';
import Setup from './sections/Setup';
import Highlights from './sections/Highlights';
import InvestorStatus from './sections/InvestorStatus';
import Banking from './sections/Banking';
import Crypto from './sections/Crypto';
import Investments from './sections/Investments';
import Investors from './sections/Investors';
import { useFetch, useViewport } from '../../../utils/hooks';
import { useAuth } from '../../../auth/useAuth';
import AllocationsLoader from '../../utils/AllocationsLoader';
import styles from './styles';
import DocumentsTab from './sections/DocumentsTab';
import DealTypeSelector from './DealType';
import DealPage from '../Common/DealPage';
import HighlightedTabs from '../../utils/HighlightedTabs';
import { phone } from '../../../utils/helpers';

const RemoteInvestors = React.lazy(() => import('invest/Investors'));

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
        status
        submissionData {
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
    investor {
      _id
      admin
      documents
      created_at
    }
  }
`;

const fundTabs = [
  'Highlights',
  'Investments',
  'Investor Onboarding Status',
  'Investors',
  'Documents',
  'Deal Page',
];

const spvTabs = ['Investor Onboarding Status', 'Investors', 'Documents', 'Deal Page'];

// Base here is OPS_ACCOUNTING
let BASE = 'app3m4OJvAWUg0hng';
const INVESTMENTS_TABLE = 'Investments';
const DEALS_TABLE = 'Deals';

const TempDealDashboard = ({ classes }) => {
  const { width } = useViewport();
  const params = useParams();
  const { deal_id } = params;
  const { organization: orgSlug } = params;

  if (orgSlug === 'demo-fund') {
    // BASE HERE IS Demo Fund
    BASE = 'app53fOK2CmyuzKXK';
    // INVESTMENTS_TABLE = 'Sales Demo';
  }

  const { fundManagerBankingTab, capitalCallsDealSpecific, cryptoPaymentInBuild } = useFlags();
  const { userProfile } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [tabName, setTabName] = useState(fundTabs[0]);
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

  if (userProfile.admin) {
    const bankingTabName = 'Banking';
    // Only add banking tab if user is admin and FF fundManagerBankingTab is true
    if (fundManagerBankingTab) {
      if (!fundTabs.includes(bankingTabName)) fundTabs.push(bankingTabName);
      if (!spvTabs.includes(bankingTabName)) spvTabs.push(bankingTabName);
    }
  }

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

  const { data: atFundData, status } = useFetch(
    BASE,
    atDealData?.name && INVESTMENTS_TABLE,
    atDealData?.name && `(FIND("${checkedAtDealDataName}", {Deals}))`,
  );

  useEffect(() => {
    setDealName(dealData?.deal?.company_name);
  }, [dealData]);

  useEffect(() => {
    if (dealData && Object.keys(dealData).length) {
      const newTabs = dealData.deal.investmentType === 'fund' ? fundTabs : spvTabs;
      const newTabIndex = newTabs.indexOf(tabName);
      const newIndex = newTabIndex < 0 ? 0 : newTabIndex;
      const newTabName = newTabs[newIndex];
      setTabIndex(newIndex);
      setDashboardTabs(newTabs);
      setTabName(newTabName);
    }
  }, [dealData]);

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
            superAdmin={dealData?.investor?.admin}
            refetch={refetch}
          />
        );
      case 'Investors':
        return (capitalCallsDealSpecific || []).includes(dealData?.deal._id) ? (
          <Suspense fallback={<AllocationsLoader />}>
            <RemoteInvestors deal_id={dealData?.deal?._id} />
          </Suspense>
        ) : (
          <Investors
            classes={classes}
            data={dealData}
            orgSlug={orgSlug}
            userProfile={userProfile}
          />
        );

      case 'Documents':
        return <DocumentsTab classes={classes} data={dealData} refetch={refetch} />;

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
      case 'Banking':
        return (
          <Banking
            organizationData={dealData}
            dealData={dealData}
            deal_id={dealData.deal._id}
            virtual_account_number={dealData.deal.virtual_account_number || null}
            classes={classes}
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
      default:
        return <p>No Data</p>;
    }
  };

  const [openModal, setOpenModal] = useState(false);

  const typographyVariant = width > phone ? 'heading2' : 'heading4';

  return (
    <div className={`${classes.dashboardContainer} FundManagerDashboard`}>
      <div style={{ margin: '1rem 0' }}>
        <div style={{ position: 'relative' }}>
          <div className={classes.titleContainer}>
            <AllocationsTypography
              component="div"
              content={dealName}
              fontWeight={700}
              variant={typographyVariant}
            />
          </div>
          <HighlightedTabs
            tabs={dashboardTabs}
            tabIndex={tabIndex}
            handleTabChange={handleTabChange}
            rootStyle={{ padding: '0 8px' }}
          />
          {!dealData || !dealData || !atFundData || status === 'fetching' || loading ? (
            <div className={classes.loaderContainer}>
              <AllocationsLoader />
            </div>
          ) : (
            getTabContent()
          )}
        </div>
      </div>
      <DealTypeSelector isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default withStyles(styles)(withRouter(TempDealDashboard));