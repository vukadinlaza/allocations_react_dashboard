import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useLazyQuery, useQuery, gql } from '@apollo/client';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography, Button, Paper } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useFlags } from 'launchdarkly-react-client-sdk';
import Setup from './sections/Setup';
import Highlights from './sections/Highlights';
import InvestorStatus from './sections/InvestorStatus';
import Banking from './sections/Banking';
import Crypto from './sections/Crypto';
import Investments from './sections/Investments';
import Investors from './sections/Investors';
import InvestorsCapitalCalls from './sections/InvestorsCapitalCalls';
import Overview from './sections/Overview';
import { useViewport, useFetch } from '../../../utils/hooks';
import { useAuth } from '../../../auth/useAuth';
import AllocationsLoader from '../../utils/AllocationsLoader';
import DealsTabs from './sections/DealsTabs';
import styles from './styles';
import DocumentsTab from './sections/DocumentsTab';
import DealTypeSelector from '../../NewBuild/DealType';
import DealPage from '../Common/DealPage';

// const MFE1 = React.lazy(() => import('mfe1/mfe1'));
// const NewDirectionsAccountCreationForm = React.lazy(() =>
//   import('treasury/NewDirectionsAccountCreationForm'),
// );

const GET_INVESTMENTS = gql`
  query GetDeal($fund_slug: String!, $deal_slug: String!) {
    deal(fund_slug: $fund_slug, deal_slug: $deal_slug) {
      _id
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
  }
`;

export const ORG_OVERVIEW = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      name
      slug
      high_volume_partner
      deals(limit: 500) {
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

const AUM_DATA = gql`
  query OrganizationAUM($slug: String!) {
    aum: organization(slug: $slug) {
      total: totalAUM
    }
  }
`;

const TOTAL_SPVS_DATA = gql`
  query OrganizationSPVs($slug: String!) {
    spvs: organization(slug: $slug) {
      total: totalSPVs
    }
  }
`;

const TOTAL_FUNDS_DATA = gql`
  query OrganizationFunds($slug: String!) {
    funds: organization(slug: $slug) {
      total: totalFunds
    }
  }
`;

const TOTAL_INVESTMENTS_DATA = gql`
  query OrganizationFunds($slug: String!) {
    investments: organization(slug: $slug) {
      total: totalInvestments
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
let INVESTMENTS_TABLE = 'Investments';
const DEALS_TABLE = 'Deals';

const FundManagerDashboard = ({ classes, history }) => {
  const { width } = useViewport();
  const params = useParams();
  const { deal: dealSlug } = params;
  const { organization: orgSlug } = params;

  if (orgSlug === 'demo-fund') {
    // BASE HERE IS Demo Fund
    BASE = 'app53fOK2CmyuzKXK';
    INVESTMENTS_TABLE = 'Sales Demo';
  }

  const { fundManagerBankingTab, capitalCallsDealSpecific, cryptoPaymentInBuild } = useFlags();

  const { userProfile } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [tabName, setTabName] = useState(fundTabs[0]);
  const [dealTab, setDealTab] = useState(0);
  const [dealData, setDealData] = useState({});
  const [dealName, setDealName] = useState('');
  const [dashboardTabs, setDashboardTabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [atDealData, setAtDealData] = useState({});
  const [openTooltip, setOpenTooltip] = useState('');
  const [orgDeals, setOrgDeals] = useState(null);

  const { data: aumData } = useQuery(AUM_DATA, { variables: { slug: orgSlug } });
  const { data: totalSpvData } = useQuery(TOTAL_SPVS_DATA, { variables: { slug: orgSlug } });
  const { data: totalFundsData } = useQuery(TOTAL_FUNDS_DATA, { variables: { slug: orgSlug } });
  const { data: totalInvestmentsData } = useQuery(TOTAL_INVESTMENTS_DATA, {
    variables: { slug: orgSlug },
  });

  const [getInvestments, { data: dealInvestments, refetch }] = useLazyQuery(GET_INVESTMENTS);
  const [getOrgDeals, { data: orgDealsData }] = useLazyQuery(ORG_OVERVIEW);
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
    // Only add crypto tab if user is admin
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

  const handleDealData = (index) => {
    if (orgDeals) {
      const currentDeal =
        orgDeals.organization?.deals?.length && orgDeals.organization.deals[index];
      const dealName = currentDeal.company_name;

      setDealData(currentDeal);
      setDealName(dealName);
    }
  };

  const getDealDate = (deal) => {
    const dealTS = deal._id.toString().substring(0, 8);
    const dealDate = moment.unix(new Date(parseInt(dealTS, 16) * 1000));
    return dealDate;
  };

  useEffect(() => {
    if (dealData && Object.keys(dealData).length) {
      const newTabs = dealData.investmentType === 'fund' ? fundTabs : spvTabs;
      const newTabIndex = newTabs.indexOf(tabName);
      const newIndex = newTabIndex < 0 ? 0 : newTabIndex;
      const newTabName = newTabs[newIndex];
      setTabIndex(newIndex);
      setDashboardTabs(newTabs);
      setTabName(newTabName);
      getInvestments({ variables: { deal_slug: dealData.slug, fund_slug: orgSlug } });
    }
  }, [dealData]);

  useEffect(() => {
    if (atFundData) setLoading(false);
  }, [atFundData]);

  useEffect(() => {
    getOrgDeals({
      variables: { slug: orgSlug },
      fetchPolicy: 'network-only',
    });
  }, [orgSlug]);

  useEffect(() => {
    if (orgDealsData) {
      const orgDealsDataCopy = JSON.parse(JSON.stringify(orgDealsData));
      const funds = orgDealsDataCopy.organization.deals
        .filter((d) => d.investmentType === 'fund')
        .sort((a, b) => (b.status > a.status ? 1 : -1));
      const spvs = orgDealsDataCopy.organization.deals
        .filter((d) => d.investmentType === 'spv' || d.investmentType === null)
        .sort((a, b) => (b.status > a.status ? 1 : -1));
      const closedSpvs = spvs
        .filter((d) => d.status === 'closed')
        .sort((a, b) => getDealDate(b) - getDealDate(a));
      const openSpvs = spvs
        .filter((d) => d.status !== 'closed')
        .sort((a, b) => getDealDate(b) - getDealDate(a));

      const overviewTab = { company_name: 'All' };
      const merged = [...funds, ...[...openSpvs, ...closedSpvs]];
      if (orgDealsDataCopy.organization?.deals.length) merged.unshift(overviewTab);
      orgDealsDataCopy.organization.deals = merged;

      setOrgDeals(orgDealsDataCopy);
    }
  }, [orgDealsData]);

  useEffect(() => {
    if (dealTab !== 0) handleDealData(dealTab);
  }, [dealTab]);

  useEffect(() => {
    if (atDeal && atDeal.length) {
      const data = atDeal[0].fields;
      setAtDealData({ name: data['Deal Name'], id: atDeal[0].id });
    } else if (atDeal) {
      setAtDealData({ name: `Deal Name ${dealName} Not found in AirTable`, id: '' });
    }
  }, [atDeal]);

  const handleLinkCopy = () => {
    if (orgSlug && dealData?.slug) {
      navigator.clipboard.writeText(window.origin + (`/deals/${orgSlug}/${dealData.slug}` || ''));
      toast.info('Copied deal link to clipboard');
    }
  };

  const goToDeal = () => {
    if (orgSlug && dealData?.slug) {
      window.open(`/deals/${orgSlug}/${dealData.slug}`);
    }
  };

  const goToEditDeal = () => {
    if (orgSlug && dealData?._id) {
      window.open(`/admin/${orgSlug}/deals/${dealData._id}/edit`);
    }
  };

  const handleDealsTabChange = (newValue) => {
    if (newValue !== dealTab) {
      const currentDeal =
        orgDeals.organization?.deals?.length && orgDeals.organization.deals[newValue];
      const currentDealName = currentDeal.company_name;
      const isDealLoaded = currentDealName === dealName;
      if (newValue !== 0 && !isDealLoaded) setLoading(true);
      setDealTab(newValue);
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
    if (dealTab === 0) {
      return (
        <Overview
          classes={classes}
          aum={aumData?.aum?.total || 0}
          spvs={totalSpvData?.spvs?.total || 0}
          funds={totalFundsData?.funds?.total || 0}
          investors={totalInvestmentsData?.investments?.total || 0}
        />
      );
    }

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
            dealSlug={dealSlug}
            data={fundData}
            dealData={dealData}
            openTooltip={openTooltip}
            handleTooltip={handleTooltip}
            dealInvestments={dealInvestments}
          />
        );

      case 'Investments':
        return <Investments classes={classes} width={width} data={fundData} />;

      case 'Investor Onboarding Status':
        return (
          <InvestorStatus
            classes={classes}
            width={width}
            data={dealInvestments}
            dealType={dealData?.dealParams?.dealType}
            superAdmin={orgDeals?.investor?.admin}
            refetch={refetch}
            deal={dealData}
          />
        );
      case 'Investors':
        return (capitalCallsDealSpecific || []).includes(dealData?._id) ? (
          <InvestorsCapitalCalls
            classes={classes}
            width={width}
            data={dealInvestments}
            orgSlug={orgSlug}
            userProfile={userProfile}
            dealName={checkedDealName}
          />
        ) : (
          <Investors
            classes={classes}
            width={width}
            data={dealInvestments}
            orgSlug={orgSlug}
            userProfile={userProfile}
          />
        );

      case 'Documents':
        return (
          <DocumentsTab classes={classes} width={width} data={dealInvestments} refetch={refetch} />
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
      case 'Banking':
        return (
          <Banking
            organizationData={orgDealsData}
            dealData={dealData}
            deal_id={dealData._id}
            virtual_account_number={dealData.virtual_account_number || null}
          />
        );
      case 'Crypto':
        return (
          <Crypto
            orgSlug={orgSlug}
            classes={classes}
            deal_id={dealData._id}
            virtual_account_number={dealData.virtual_account_number || null}
            openTooltip={openTooltip}
            handleTooltip={handleTooltip}
          />
        );
      default:
        return <p>No Data</p>;
    }
  };

  const [openModal, setOpenModal] = useState(false);

  const isOverview = dealTab === 0;

  return (
    <div className={`${classes.dashboardContainer} FundManagerDashboard`}>
      {/* <React.Suspense fallback="Loading Button">
        <MFE1 />
      </React.Suspense> */}
      {/* <React.Suspense fallback="Loading Button">
        <NewDirectionsAccountCreationForm />
      </React.Suspense> */}
      <Paper style={{ padding: '.5rem' }}>
        <div className={classes.mainTitleContainer} id="main-title-container">
          <Typography className={classes.mainTitle}>
            {userProfile?.first_name
              ? `Hello ${userProfile?.first_name}, here are your Funds.`
              : orgDealsData?.organization?.name}
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.5rem' }}>
            {userProfile?.admin && (
              <span className={classes.createButtonLink}>
                <Button
                  className={classes.createButton}
                  style={{ marginLeft: '1rem' }}
                  onClick={() => history.push(`/admin/${orgSlug}/deal/new`)}
                >
                  <AddCircleIcon style={{ marginRight: '5px', fontSize: '20px' }} />
                  Create New Deal Page
                </Button>
              </span>
            )}
            {userProfile?.admin && (
              <span className={classes.createButtonLink}>
                <Button
                  className={classes.createButton}
                  color="secondary"
                  style={{ marginLeft: '1rem', backgroundColor: 'blue' }}
                  onClick={() => history.push(`/admin/${orgSlug}/manager`)}
                >
                  <AddCircleIcon style={{ marginRight: '5px', fontSize: '20px' }} />
                  Add Org Admin
                </Button>
              </span>
            )}
          </div>
        </div>
      </Paper>

      {orgDeals && !orgDeals.organization?.deals?.length ? (
        <div className={classes.noDataPlaceholder}>
          <div>This fund has no deals.</div>
          <div>Click on the 'Create New' button to create a deal.</div>
        </div>
      ) : (
        <Paper style={{ margin: '1rem 0' }}>
          <div>
            <DealsTabs
              dealSlug={dealSlug}
              orgSlug={orgSlug}
              data={orgDeals}
              width={width}
              tabIndex={dealTab}
              setTabIndex={handleDealsTabChange}
            />
            <div style={{ position: 'relative' }}>
              {!isOverview && (
                <Tabs
                  value={tabIndex}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={handleTabChange}
                  classes={{
                    root: classes.tabs,
                    indicator: classes.tabsIndicator,
                    flexContainer: classes.tabsContainer,
                  }}
                >
                  {dashboardTabs.map((tab) => (
                    <Tab
                      label={tab}
                      className={classes.tab}
                      key={tab}
                      classes={{
                        root: classes.tab,
                        selected: classes.selectedTab,
                        wrapper: classes.tabWrapper,
                      }}
                      disableRipple
                    />
                  ))}
                </Tabs>
              )}
              {(!isOverview && (!dealData || !atFundData || !dealInvestments)) ||
              status === 'fetching' ||
              loading ? (
                <div className={classes.loaderContainer}>
                  <AllocationsLoader />
                </div>
              ) : (
                getTabContent()
              )}
            </div>
          </div>
        </Paper>
      )}
      <DealTypeSelector isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default withStyles(styles)(withRouter(FundManagerDashboard));
