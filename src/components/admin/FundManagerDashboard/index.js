import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import _, { toLower } from 'lodash';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import EditIcon from '@material-ui/icons/Edit';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Setup from './sections/Setup';
import Highlights from './sections/Highlights';
import InvestorStatus from './sections/InvestorStatus';
// import ActivityLog from './sections/ActivityLog';
import Investments from './sections/Investments';
import { FlatBox } from './widgets';
import { phone, tablet } from '../../../utils/helpers';
import { useViewport } from '../../../utils/hooks';
import { useFetch } from '../../../utils/hooks';
import Loader from '../../utils/Loader';
import DealsTabs from './sections/DealsTabs'


const styles = theme => ({
  accredited: {
    borderRadius: "20px",
    background: "#39C522",
    marginLeft: "0.5em",
    display: "flex",
    alignItems: "center",
    padding: "2px 5px",
    minWidth: "50px",
    whiteSpace: 'nowrap',
    margin: "0 0.5em",
    "& svg": {
      fontSize: "10px",
    },
    [theme.breakpoints.down(phone)]: {
      margin: 0
    }
  },
  avatar: {
    background: "#0461FF",
    fontSize: "14px",
    width: "30px",
    height: "30px",
    marginRight: "1em"
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#39C522',
  },
  boxEditButton: {
    backgroundColor: "#0461FF",
    borderRadius: '100%',
    padding: "8px",
    "& *": {
      color: "white"
    }
  },
  chartContainer: {
    width: '70%',
    width: '60%',
    padding: '5% 0',
    [theme.breakpoints.down(tablet)]: {
      padding: 0,
      width: "100%",
      marginBottom: "20px",
      height: "250px"
    },
  },
  dashboardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    position: "absolute",
    width: "100%",
    left: "0",
    top: "0",
    background: "white"
  },
  footerData: {
    fontSize: "14px"
  },
  investorBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "white",
    borderRadius: "5px",
    background: "#ffffff",
    marginBottom: "10px",
    borderRadius: "10px",
    padding: "10px",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden"
  },
  investorBoxAmount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down(phone)]: {
      flexWrap: "wrap",
      width: "100%"
    },
  },
  investorBoxName: {
    display: "flex",
    alignItems: "center",
    width: "calc(100% - 80px)",
    [theme.breakpoints.down(phone)]: {
      width: "100%",
      marginBottom: "1em"
    },
  },
  investorName: {
    fontSize: "14px",
    width: "calc(100% - 108px)",
    maxWidth: "calc(100% - 108px)",
    overflow: "hidden",
    whiteSpace: "pre",
    textOverflow: "ellipsis",
    [theme.breakpoints.down(phone)]: {
      width: "100%",
      marginBottom: "0.5em"
    },
  },
  loaderContainer: {
    position:"absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "250px",
    zIndex: "10"
  },
  logType: {
    width: "fit-content",
    padding: "2px 12px",
    borderRadius: "20px"
  },
  mainTitle: {
    fontSize: "28px",
    fontWeight: "700",
    padding: "20px 40px"
  },
  pageIcons: {
    width: "125px",
    display: "flex",
    justifyContent: "space-between",
    paddingRight: "50px",
    [theme.breakpoints.down(phone)]: {
      width: "200px"
    },
  },
  pageIcon: {
    backgroundColor: "#0461FF",
    borderRadius: '100%',
    width: "30px",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "& *": {
      color: "white",
      fontSize: "18px"
    },
    [theme.breakpoints.down(phone)]: {
      width: "40px",
      height: "40px",
      marginTop: "15px"
    },
  },
  progress: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  progressContainer: {
    height: 10,
    borderRadius: 5,
    width: "90%"
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "25px",
    background: "white",
    padding: "15px 20px",
    border: "solid 1px #dadada",
    boxShadow: "0px 3px 5px -5px",
    borderRadius: "3px"
  },
  section: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: "40px",
    [theme.breakpoints.down(phone)]: {
      padding: "4vw"
    },
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "35px"
  },
  selectedTab: {
    fontWeight: "bold !important",
    "& $tabWrapper":{
        backgroundColor: "rgb(32 93 245 / 16%)",
        borderRadius: "10px",
      }
  },
  setupStep: {
    display: "flex",
    alignItems: "center",
    padding: "8px 10px",
    "&:not(:first-child)": {
      borderTop: '1px solid #8493A640'
    },
    "&>*": {
      fontSize: "18px"
    },
    "&>p": {
      fontSize: "14px"
    }
  },
  simpleBoxDataRow: {
    marginBottom: "15px",
    display: 'flex',
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  subSection: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  tab: {
    textTransform: "none",
    minWidth: 0,
    fontWeight: "400",
    "&:focus": {
      outline: "none"
    }
  },
  tableContainer: {
    maxHeight: '100%',
    width: '35%',
    minWidth: "175px",
    display:'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    '& table *': {
    },
    '& tr':{
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      "& > *": {
        display: "flex"
      },
      "& > *:first-child": {
        marginRight: "1em"
      }
    },
    [theme.breakpoints.down(tablet)]: {
      width: "100%"
    }
  },
  tabs: {
    // position: "absolute",
    // top: "0",
    // left: "0",
    width: "100%",
    border: "none",
    height: "50px",
    padding: "0 28px",
    "& *": {
      height: "100%"
    }
  },
  tabsContainer: {
    [theme.breakpoints.down(phone)]: {
      overflowX: 'scroll',
      display: "block"
    },
  },
  tabsIndicator: {
    display: "none"
  },
  tabWrapper: {
    padding: "0 20px",
  },
  titleDataText: {
    margin: "0",
    fontSize: "14px",
    color: "#39C522",
    fontWeight: "bold"
  }
});


export const ORG_OVERVIEW = gql`
  query GetOrg($slug: String!, $status: String) {
    organization(slug: $slug) {
      _id
      name
      slug
      deals(status: $status) {
        _id
        company_name
        company_description
        target
        raised
        slug
        date_closed
        investmentType
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
          totalManagementFee
          managementFeesDollar
          fundManagementFeesDollar
          fundManagementFees
          managementFeeType
          fundManagementFeeType
        }
      }
    }
  }
`;


const dashboardTabs = [
  "Setup",
  "Highlights",
  "Investments",
  "Investor Onboarding Status",
  // "Activity Log",
  "Deal Page"
]



const OPS_ACCOUNTING = 'app3m4OJvAWUg0hng';
const INVESTMENTS_TABLE = 'Investments';
const DEALS_TABLE = 'Deals';


const FundManagerDashboard = ({ classes, location, history }) => {

  const { width } = useViewport();
  const { organization: orgSlug, deal: dealSlug } = useParams();
  const [tabIndex, setTabIndex] = useState(0)
  const [dealData, setDealData] = useState({});
  const [dealName, setDealName] = useState('')
  const [atDealData, setAtDealData] = useState({})
  const [getOrgDeals, { data: orgDeals }] = useLazyQuery(ORG_OVERVIEW, {
    variables: { slug: orgSlug, status: "active" },
    fetchPolicy: "network-only"
  });
  const { data: atDeal } = useFetch(OPS_ACCOUNTING, dealName && DEALS_TABLE, dealName && `({Deal Name}="${dealName}")`);
  const { data: atFundData, status } = useFetch(OPS_ACCOUNTING, atDealData?.name && INVESTMENTS_TABLE, atDealData?.name && `(FIND("${atDealData.name}", {Deals}))`);

  useEffect(() => {
    getOrgDeals()
  }, [dealSlug, orgSlug])

  useEffect(() => {
    if(orgDeals?.organization?.deals?.length && !dealSlug){
      let slug = orgDeals.organization.deals[0].slug;
      history.push(`/admin/${orgSlug}/${slug}`)
    }else if(orgDeals){
      let currentDeal = orgDeals.organization?.deals?.find(deal => dealSlug === deal.slug)
      let dealName = currentDeal.company_name
      // console.log({currentDeal, dealSlug});
      setDealData(currentDeal)
      setDealName(dealName)
    }
  }, [orgDeals])

  useEffect(() => {
    // console.log({atDeal});
    if(atDeal && atDeal.length){
      let data = atDeal[0].fields;
      setAtDealData({name: data['Deal Name'], id: atDeal[0].id})
    }else if(atDeal){
      setAtDealData({name: 'Deal Name Not found in AirTable', id: ''})
    }
  }, [atDeal])

  if(!dealData || !atFundData) return <Loader/>

  const fundData = atFundData.map((d) => d.fields)

  const handleLinkCopy = () => {
    if(orgSlug && dealSlug){
      navigator.clipboard.writeText(window.origin + (`/deals/${orgSlug}/${dealSlug}` || ''));
      toast.success('Copied deal link to clipboard.');
    }
  };

  const goToDeal = () => {
    if(orgSlug && dealSlug){
      history.push(`/deals/${orgSlug}/${dealSlug}`)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return(
          <Setup
            classes={classes}
            data={dealData}
            />
        )
      case 1:
        return(
          <Highlights
            classes={classes}
            orgSlug={orgSlug}
            dealSlug={dealSlug}
            data={fundData}
            dealData={dealData}
            />
        )
      case 2:
        return(
          <Investments
            classes={classes}
            width={width}
            data={fundData}
            />
        )
      case 3:
        return(
          <InvestorStatus classes={classes} width={width}/>
        )
      case 4:
        // return(
        //   <ActivityLog
        //     classes={classes}
        //     />
        // )
        return(
          <div className={classes.section}>
            <FlatBox title="SHARE">
              <Typography>dashboard.allocations.com{orgSlug && dealSlug? `/deals/${orgSlug}/${dealSlug}` : ''}</Typography>
              <div className={classes.pageIcons}>
                <div className={classes.pageIcon} onClick={goToDeal}><ChevronRightIcon/></div>
                <div className={classes.pageIcon} onClick={handleLinkCopy}><FileCopyOutlinedIcon/></div>
              </div>
            </FlatBox>
          </div>
        )
      default:
        return <p>No Data</p>
    }
  }

  if(status === "fetching") return <Loader/>

  return (
    <div className={classes.dashboardContainer}>
      <Typography className={classes.mainTitle}>Funds</Typography>
      <DealsTabs
        dealSlug={dealSlug}
        orgSlug={orgSlug}
        data={orgDeals}
        width={width}
        />
      <Tabs
        value={tabIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleTabChange}
        classes={{
          root: classes.tabs,
          indicator: classes.tabsIndicator,
          flexContainer: classes.tabsContainer
        }}
        >
        {dashboardTabs.map((tab, index) =>
          <Tab
            label={tab}
            className={classes.tab}
            key={`tab-${index}`}
            classes={{
              root: classes.tab,
              selected: classes.selectedTab,
              wrapper: classes.tabWrapper
            }}
            disableRipple
            />
        )}
        {/*}<Tab label="Disabled" disabled />*/}
      </Tabs>
      {getTabContent()}
    </div>
  );
}

export default withStyles(styles)(withRouter(FundManagerDashboard))
