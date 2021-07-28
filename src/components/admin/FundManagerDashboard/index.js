import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { gql } from 'apollo-boost';
import moment from 'moment';
import { useLazyQuery, useSubscription } from '@apollo/react-hooks';
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
import { FlatBox } from './widgets';
import { phone, tablet } from '../../../utils/helpers';
import { useViewport, useFetch } from '../../../utils/hooks';
import { useAuth } from '../../../auth/useAuth';
import './FundManagerDashboard.scss';

import Loader from '../../utils/Loader';
import DealsTabs from './sections/DealsTabs';

const styles = (theme) => ({
  accredited: {
    borderRadius: '20px',
    background: '#39C522',
    marginLeft: '0.5em',
    display: 'flex',
    alignItems: 'center',
    padding: '2px 5px',
    minWidth: '50px',
    whiteSpace: 'nowrap',
    margin: '0 0.5em',
    '& svg': {
      fontSize: '10px',
    },
    [theme.breakpoints.down(phone)]: {
      margin: 0,
    },
  },
  avatar: {
    background: '#0461FF',
    fontSize: '14px',
    width: '30px',
    height: '30px',
    marginRight: '1em',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#39C522',
  },
  buttonContainer: {
    display: 'flex',
  },
  chartContainer: {
    width: '70%',
    width: '60%',
    padding: '5% 0',
    [theme.breakpoints.down(tablet)]: {
      padding: 0,
      width: '100%',
      marginBottom: '20px',
      height: '250px',
    },
  },
  createButton: {
    backgroundColor: '#39C522',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    textTransform: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#56db40',
    },
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.down(phone)]: {
      fontSize: '.5rem',
    },
  },
  createButtonLink: {
    zIndex: 1,
    '&:hover': {
      textDecoration: 'none',
    },
    [theme.breakpoints.down(phone)]: {
      marginBottom: '1em',
      '& *': {
        // marginLeft: "0 !important",
      },
    },
  },
  createButtonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '520px',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
      marginBottom: '2em',
      width: '100%',
    },
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    left: '0',
    top: '0',
    background: 'white',
  },
  footerData: {
    fontSize: '14px',
  },
  investorBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    marginBottom: '10px',
    borderRadius: '10px',
    padding: '10px',
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    '&:hover': {
      backgroundColor: '#edf1f4',
    },
  },
  investorBoxAmount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down(phone)]: {
      flexWrap: 'wrap',
      width: '100%',
    },
  },
  investorBoxName: {
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 80px)',
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      marginBottom: '1em',
    },
  },
  investorName: {
    fontSize: '14px',
    maxWidth: 'calc(100% - 108px)',
    overflow: 'hidden',
    whiteSpace: 'pre',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      marginBottom: '0.5em',
    },
  },
  loaderContainer: {
    top: '0',
    left: '0',
    width: '100%',
    height: '700px',
    display: 'flex',
    zIndex: 10,
    position: 'absolute',
    alignItems: 'flex-start',
    paddingTop: '180px',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255)',
  },
  logType: {
    width: 'fit-content',
    padding: '2px 12px',
    borderRadius: '20px',
  },
  modalBackground: {
    position: 'fixed',
    left: '0',
    top: '0',
    height: '100vh',
    width: '100vw',
    zIndex: '1099',
    backgroundColor: 'rgba(26, 26, 26, 0.30)',
  },
  noDataPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '600px',
    fontSize: '26px',
    fontWeight: 600,
    color: '#c3c3c3',
    [theme.breakpoints.down(phone)]: {
      width: '80vw',
      margin: 'auto',
      height: '350px',
    },
  },
  pageIcons: {
    width: '150px',
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '50px',
    [theme.breakpoints.down(phone)]: {
      width: '200px',
    },
  },
  pageIcon: {
    backgroundColor: '#0461FF',
    borderRadius: '100%',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '& *': {
      color: 'white',
      fontSize: '18px',
    },
    [theme.breakpoints.down(phone)]: {
      width: '40px',
      height: '40px',
      marginTop: '15px',
    },
  },
  progress: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  progressContainer: {
    height: 10,
    borderRadius: 5,
    width: '90%',
    marginRight: '1em',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '25px',
    background: 'white',
    padding: '15px 20px',
    border: 'solid 1px #dadada',
    boxShadow: '0px 3px 5px -5px',
    borderRadius: '3px',
  },
  section: {
    width: '100%',
    padding: '40px',
    margin: '0px',
    [theme.breakpoints.down(phone)]: {
      padding: '10px',
    },
  },
  selectedTab: {
    fontWeight: 'bold !important',
    '& $tabWrapper': {
      backgroundColor: 'rgb(32 93 245 / 16%)',
      borderRadius: '10px',
    },
  },
  setupStep: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 10px',
    cursor: 'pointer',
    '&:not(:first-child)': {
      borderTop: '1px solid #8493A640',
    },
    '&>*': {
      fontSize: '18px',
    },
    '&>p': {
      fontSize: '14px',
    },
    '&:hover': {
      backgroundColor: '#edf1fb',
    },
  },
  simpleBoxDataRow: {
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  sortField: {
    margin: '1rem 0 -1rem 52px',
    [theme.breakpoints.down(phone)]: {
      marginLeft: '22px',
      marginBottom: '5px',
    },
  },
  tab: {
    textTransform: 'none',
    minWidth: 0,
    fontWeight: '400',
    '&:focus': {
      outline: 'none',
    },
  },
  tableContainer: {
    maxHeight: '100%',
    width: '35%',
    minWidth: '175px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    '& table *': {},
    '& tr': {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      '& > *': {
        display: 'flex',
      },
      '& > *:first-child': {
        marginRight: '1em',
      },
    },
    [theme.breakpoints.down(tablet)]: {
      width: '100%',
    },
  },
  tabs: {
    width: '100%',
    border: 'none',
    height: '50px',
    padding: '0 28px',
    '& *': {
      height: '100%',
    },
    [theme.breakpoints.down(phone)]: {
      padding: '0 12px',
    },
  },
  tabsContainer: {
    [theme.breakpoints.down(phone)]: {
      overflowX: 'scroll',
      display: 'block',
    },
  },
  tabsIndicator: {
    display: 'none',
  },
  tabWrapper: {
    padding: '0 20px',
  },
  titleDataText: {
    margin: '0',
    fontSize: '14px',
    color: '#39C522',
    fontWeight: 'bold',
  },
});

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
        dealOnboarding {
          dealTasks {
            taskName
            taskStatus
            formFields
          }
        }
      }
    }
    investor {
      _id
      admin
      documents
    }
  }
`;

export const ONBOARDING = gql`
  subscription dealOnboarding($data: String) {
    dealOnboarding(data: $data)
  }
`;

const fundTabs = [
  'Highlights',
  'Investments',
  'Investor Onboarding Status',
  'Investors',
  'Deal Page',
];
const spvTabs = ['Investor Onboarding Status', 'Investors', 'Deal Page'];
const OPS_ACCOUNTING = 'app3m4OJvAWUg0hng';
const INVESTMENTS_TABLE = 'Investments';
const DEALS_TABLE = 'Deals';

const FundManagerDashboard = ({ classes, history }) => {
  const { width } = useViewport();
  const { organization: orgSlug, deal: dealSlug } = useParams();
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
  const [getInvestments, { data: dealInvestments, refetch }] = useLazyQuery(GET_INVESTMENTS);
  const [getOrgDeals, { data: orgDealsData }] = useLazyQuery(ORG_OVERVIEW);
  const { data: subsData } = useSubscription(ONBOARDING);
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

      const merged = [...funds, ...[...openSpvs, ...closedSpvs]];
      orgDealsDataCopy.organization.deals = merged;
      setOrgDeals(orgDealsDataCopy);
    }
  }, [orgDealsData]);

  useEffect(() => {
    handleDealData(0);
  }, [orgDeals]);

  useEffect(() => {
    handleDealData(dealTab);
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
      toast.success('Copied deal link to clipboard.');
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
      setLoading(true);
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
            subscriptionData={subsData}
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

  if (!orgDeals) return <Loader />;
  return (
    <div className={`${classes.dashboardContainer} FundManagerDashboard`}>
      {openTooltip && (
        <div className={classes.modalBackground} onClick={(e) => handleTooltip('')} />
      )}
      <div className="mainTitleContainer" id="main-title-container">
        <Typography className="mainTitle">
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
            {!dealData || !atFundData || !dealInvestments || status === 'fetching' || loading ? (
              <div className={classes.loaderContainer}>
                <Loader />
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
