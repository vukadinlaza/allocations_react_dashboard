import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import { withRouter, useRouteMatch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Menu, MenuItem, ListItemText, Button } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { phone } from '../../../../utils/helpers'
import Loader from '../../../utils/Loader'



const styles = theme => ({
  item: {
    "&:hover": {
      backgroundColor: "#8493A61A",
    },
    "& *": {
      fontSize: "14px",
      fontWeight: "bold",
    }
  },
  moreButton: {
    width: "10em",
    textTransform: "none",
    "&:hover":{
      backgroundColor: "#8493A61A",
    },
    "&:focus": {
      outline: "none",
      border: "none"
    }
  },
  root: {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: "center",
    color: "#2A2B54",
    fontWeight: "bold",
    marginBottom: "15px",
    padding: "0 40px"
  },
  selectedTab: {
    // color: "#2A2B54 !important",
    fontWeight: "bold !important",
    "& $tabWrapper":{
      background: "none",
    }
  },
  tab: {
    textTransform: "none",
    fontWeight: "400",
    whiteSpace: "nowrap",
    fontSize: "16px",
    borderBottom: "2px solid #E6E9EF",
    "&:focus": {
      outline: "none"
    }
  },
  tabs: {
    zIndex: "1",
  },
  tabsContainer: {
    [theme.breakpoints.down(phone)]: {
      overflowX: 'scroll',
      display: "block"
    },
  },
  tabsIndicator: {
    // display: "none",
  },
  tabsPlaceholder: {
    width: "calc(100% - 80px)",
    borderBottom: "2px solid #E6E9EF",
    height: "130px", //height of main title and tabs component
    position: "absolute",
    top: "0px",
    left: "0px",
    margin: "0 40px"
  },
  tabWrapper: {
    padding: "0 10px",
  },
});



const DealsTabs = ({ classes, history, orgSlug, dealSlug, data, width }) => {

  const [tabIndex, setTabIndex] = useState(0);
  const [deals, setDeals] = useState([]);

  const handleTabChange = (e, newIndex, fromClick = false) => {
    setTabIndex(newIndex);
    if(deals.length && fromClick){
      const { slug } = deals[newIndex]
      history.push(`/admin/${orgSlug}/${slug}`)
    }
  }

  useEffect(() => {
    if(data?.organization?.deals?.length){
      const deals = data.organization.deals
      const currentDealIndex = deals.map(deal => deal.slug).indexOf(dealSlug)
      setDeals(deals)
      handleTabChange('', currentDealIndex)
    }
  }, [dealSlug])


  if(!data) return <Loader/>

  return(
    <div className={classes.root}>
      <Tabs
        value={tabIndex}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        onChange={(e,v) => handleTabChange(e, v, true)}
        classes={{
          root: classes.tabs,
          indicator: classes.tabsIndicator,
          // flexContainer: classes.tabsContainer
        }}
        variant={width > phone? "fullWidth" : "scrollable"}
      >
        {deals.map((deal, index) =>
          <Tab
            label={deal.company_name}
            key={`tab-${index}`}
            classes={{
              root: classes.tab,
              selected: classes.selectedTab,
              // wrapper: classes.tabWrapper
            }}
            disableRipple
            />
        )}
      </Tabs>
      <div className={classes.tabsPlaceholder}/>
    </div>
  )
}

export default withStyles(styles)(withRouter(DealsTabs));
