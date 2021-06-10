import React, { useState } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';
import { FlatBox } from './widgets'
import AllocationsTable from '../../utils/AllocationsTable'
import { nWithCommas } from '../../../utils/numbers'
import Setup from './sections/Setup';
import Highlights from './sections/Highlights';
import InvestorStatus from './sections/InvestorStatus';

const styles = theme => ({
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
  section: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: "40px"
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
  tabsIndicator: {
    display: "none"
  },
  tabWrapper: {
    padding: "0 10px",
  },
});


const dashboardTabs = ["Setup", "Highlights", "Investments", "Investor Onboarding Status", "Activity Log", "Deal Page"]



const FundManagerDashboard = ({ classes }) => {

  const [tabIndex, setTabIndex] = useState(0)

  const highlightsHeaders = [
    { value: 'name', label: 'NAME' },
    { value: 'tagline', label: 'TAGLINE' },
    { value: 'date', label: 'DATE', type: 'date' },
    { value: 'investment', label: 'INVESTMENT', type: 'amount' },
  ]

  const highlightsData = [
    { name: 'Luminous Computing', tagline: 'Photonics chips to tackle AI workloads', date: new Date(), investment: 25000},
    { name: 'Browder Capital LP', tagline: 'Early stage technology fund', date: new Date(), investment: 50000},
  ]

  const getCellContent = (type, row, value) => {
    switch (type) {
      case 'date':
        return moment(row[value]).format('MM/DD/YYYY');
      case 'amount':
        return `$${nWithCommas(row[value])}`
      default:
        return
    }
  }

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
            />
        )
      case 2:
        return(
          <div className={classes.section}>
            <AllocationsTable
              data={highlightsData}
              headers={highlightsHeaders}
              getCellContent={getCellContent}
              />
          </div>
        )
      case 3:
        return(
          <InvestorStatus
            classes={classes}
            buttonAction={buttonAction}
            />
        )
      case 5:
        return(
          <div className={classes.section}>
            <FlatBox title="SHARE" info="Explanation">Child</FlatBox>
          </div>
        )
      default:
        <p>No Data</p>
    }
  }

  return (
    <div className={classes.dashboardContainer}>
     <Tabs
       value={tabIndex}
       indicatorColor="primary"
       textColor="primary"
       onChange={handleTabChange}
       classes={{
         root: classes.tabs,
         indicator: classes.tabsIndicator
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
