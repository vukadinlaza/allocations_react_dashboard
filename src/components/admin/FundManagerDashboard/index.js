import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useLazyQuery, useSubscription, useQuery, gql } from '@apollo/client';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography, Button, Grid } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
import Setup from './sections/Setup';
import Highlights from './sections/Highlights';
import InvestorStatus from './sections/InvestorStatus';
import Investments from './sections/Investments';
import Investors from './sections/Investors';
import Overview from './sections/Overview';
import { FlatBox } from './widgets';
import { phone, tablet } from '../../../utils/helpers';
import { useViewport, useFetch } from '../../../utils/hooks';
import { useAuth } from '../../../auth/useAuth';
import AllocationsLoader from '../../utils/AllocationsLoader';
import Loader from '../../utils/Loader';
import DealsTabs from './sections/DealsTabs';
import styles from './styles.js';

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
      deals {
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

export const GET_OVERVIEW_DATA = gql`
  query OverviewData($slug: String!) {
    overviewData(slug: $slug)
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
const OPS_ACCOUNTING = 'app3m4OJvAWUg0hng';
const INVESTMENTS_TABLE = 'Investments';
const DEALS_TABLE = 'Deals';

const FundManagerDashboard = ({ classes, history }) => {
  const { width } = useViewport();
  let { organization: orgSlug, deal: dealSlug } = useParams();
  if (orgSlug === 'demo-fund') {
    orgSlug = '305-ventures';
  }
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
  const { data: overview } = useQuery(GET_OVERVIEW_DATA, { variables: { slug: orgSlug } });
  const [getInvestments, { data: dealInvestments, refetch }] = useLazyQuery(GET_INVESTMENTS);
  const [getOrgDeals, { data: orgDealsData }] = useLazyQuery(ORG_OVERVIEW);
  const checkedDealName = encodeURIComponent(dealName);
  const checkedAtDealDataName = encodeURIComponent(atDealData?.name);
  const { data: atDeal } = useFetch(
    OPS_ACCOUNTING,
    dealName && DEALS_TABLE,
    dealName && `({Deal Name}="${checkedDealName}")`,
  );

  const { data: atFundData, status } = useFetch(
    OPS_ACCOUNTING,
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

  const getDealDate = (deal) => {
    const dealTS = deal._id.toString().substring(0, 8);
    const dealDate = moment.unix(new Date(parseInt(dealTS, 16) * 1000));
    return dealDate;
  };

  const handleLinkCopy = () => {
    if (orgSlug && dealData?.slug) {
      navigator.clipboard.writeText(window.origin + (`/deals/${orgSlug}/${dealData.slug}` || ''));
      toast.info('Copied deal link to clipboard');
    }
  };

  const goToDeal = () => {
    if (orgSlug && dealData?.slug) {
      history.push(`/deals/${orgSlug}/${dealData.slug}`);
    }
  };

  const goToEditDeal = () => {
    if (orgSlug && dealData?._id) {
      history.push(`/admin/${orgSlug}/deals/${dealData._id}/edit`);
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
      return <Overview classes={classes} data={overview.overviewData} />;
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
          />
        );
      case 'Investors':
        return (
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
          <div className={classes.section}>
            <FlatBox title="SHARE">
              <Typography>
                dashboard.allocations.com
                {orgSlug && dealData?.slug ? `/deals/${orgSlug}/${dealData.slug}` : ''}
              </Typography>
              <div className={classes.pageIcons}>
                <div className={classes.pageIcon} onClick={goToEditDeal}>
                  <Tooltip title="Edit">
                    <EditIcon />
                  </Tooltip>
                </div>
                <div className={classes.pageIcon} onClick={goToDeal}>
                  <Tooltip title="Go">
                    <ChevronRightIcon />
                  </Tooltip>
                </div>
                <div className={classes.pageIcon} onClick={handleLinkCopy}>
                  <Tooltip title="Copy">
                    <FileCopyOutlinedIcon />
                  </Tooltip>
                </div>
              </div>
            </FlatBox>
          </div>
        );

      default:
        return <p>No Data</p>;
    }
  };

  if (!orgDeals || !overview?.overviewData) return <AllocationsLoader fullHeight />;

  const isOverview = dealTab === 0;

  return (
    <div className={`${classes.dashboardContainer} FundManagerDashboard`}>
      {openTooltip && (
        <div className={classes.modalBackground} onClick={(e) => handleTooltip('')} />
      )}
      <div className={classes.mainTitleContainer} id="main-title-container">
        <Typography className={classes.mainTitle}>
          {userProfile?.first_name
            ? `Hello ${userProfile?.first_name}, here are your Funds.`
            : orgDealsData?.organization?.name}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.5rem' }}>
          <a
            href="//build.allocations.com"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.createButtonLink}
          >
            <Button className={classes.createButton}>
              <AddCircleIcon style={{ marginRight: '5px', fontSize: '20px' }} />
              Create New {userProfile?.admin && 'Build'}
            </Button>
          </a>
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
      {orgDeals && !orgDeals.organization?.deals?.length ? (
        <div className={classes.noDataPlaceholder}>
          <div>This fund has no deals.</div>
          <div>Click on the 'Create New' button to create a deal.</div>
        </div>
      ) : (
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
                {dashboardTabs.map((tab, index) => (
                  <Tab
                    label={tab}
                    className={classes.tab}
                    key={`tab-${index}`}
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
      )}
    </div>
  );
};

export default withStyles(styles)(withRouter(FundManagerDashboard));
