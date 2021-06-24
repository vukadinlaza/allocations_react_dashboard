import React, { useState, useEffect } from 'react';
import _, { toLower } from 'lodash';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
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


const styles = theme => ({
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
  investorBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "white",
    borderRadius: "5px",
    background: "#ffffff",
    marginBottom: "10px",
    borderRadius: "10px",
    padding: "10px"
  },
  investorBoxName: {
    display: "flex",
    alignItems: "center"
  },
  investorCheck: {
    borderRadius: "20px",
    background: "#39C522",
    marginLeft: "0.5em",
    display: "flex",
    alignItems: "center",
    padding: "2px 5px",
    "& svg": {
      fontSize: "10px",
    }
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
    color: "#2A2B54 !important",
    fontWeight: "bold",
    "& $tabWrapper":{
        backgroundColor: "#8493A61A",
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
    height: "60px",
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
    padding: "0 10px",
  },
  titleDataText: {
    margin: "0",
    fontSize: "14px",
    color: "#39C522",
    fontWeight: "bold"
  }
});


export const GET_DEAL = gql`
  query GetDeal($fund_slug: String, $deal_slug: String) {
    deal(fund_slug: $fund_slug, deal_slug: $deal_slug) {
      _id
      company_name
      company_description
      organization {
        name
      }
      dealParams {
        dealMultiple
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


const FundManagerDashboard = ({ classes }) => {

  const { width } = useViewport();
  const { organization: orgSlug, deal: dealSlug } = useParams();
  const [tabIndex, setTabIndex] = useState(0)

  const [dealName, setDealName] = useState('')
  const [atDealData, setAtDealData] = useState({})
  const { data: dealData } = useQuery(GET_DEAL, {
    variables: { fund_slug: orgSlug, deal_slug: dealSlug },
    fetchPolicy: "network-only"
  });
  const { data: atDeal } = useFetch(OPS_ACCOUNTING, dealName && DEALS_TABLE, dealName && `({Deal Name}="${dealName}")`);
  const { data: atFundData, status } = useFetch(OPS_ACCOUNTING, atDealData?.name && INVESTMENTS_TABLE, atDealData?.name && `(FIND("${atDealData.name}", {Deals}))`);


  useEffect(() => {
    if(dealData){
      const dealName = dealData?.deal?.company_name;
      setDealName(dealName)
    }
  }, [dealData])

  useEffect(() => {

    if(atDeal && atDeal.length){
      let data = atDeal[0].fields;
      setAtDealData({name: data['Deal Name'], id: atDeal[0].id})
    }else if(atDeal){
      setAtDealData({name: 'Deal Name Not found in AirTable', id: ''})
    }
  }, [atDeal])


  if(!dealData || !atFundData) return <Loader/>

  const fundData = atFundData.map((d) => d.fields)


  const buttonAction = () => {
    console.log('HEY');
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
            dealId={dealData?.deal?.company_description}
            />
        )
      case 3:
        return(
          <InvestorStatus
            classes={classes}
            buttonAction={buttonAction}
            />
        )
      case 4:
        // return(
        //   <ActivityLog
        //     classes={classes}
        //     />
        // )
        return(
          <div className={classes.section}>
            <FlatBox title="SHARE" info="Explanation">
              <Typography>dashboard.allocations.com/funds/305-ventures</Typography>
              <div className={classes.pageIcons}>
                <div className={classes.pageIcon}><ChevronRightIcon/></div>
                <div className={classes.pageIcon}><FileCopyOutlinedIcon/></div>
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
       variant="fullWidth"
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

export default withStyles(styles)(FundManagerDashboard);
