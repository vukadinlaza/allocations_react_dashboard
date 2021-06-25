import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import { withRouter, useRouteMatch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Menu, MenuItem, ListItemText, Button } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { phone } from '../utils/helpers'
import Loader from './utils/Loader'


export const ORG_OVERVIEW = gql`
  query GetOrg($slug: String!, $status: String) {
    organization(slug: $slug) {
      _id
      name
      slug
      deals(status: $status) {
        _id
        slug
        company_name
      }
    }
  }
`;


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
    fontWeight: "bold"
  },
  selectedItem: {
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor: "#8493A61A",
    "& *": {
      fontSize: "14px",
      fontWeight: "bold",
    }
  },
  selectedTab: {
    color: "#2A2B54 !important",
    fontWeight: "bold",
    "& $tabWrapper":{
      backgroundColor: "#8493A61A",
      borderRadius: "10px",
    }
  },
  tab: {
    textTransform: "none",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    color: "#2A2B54",
    "&:focus": {
      outline: "none"
    }
  },
  tabs: {
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
});



const NewNavBar = ({ classes, history, setLoading }) => {

  const [tabIndex, setTabIndex] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deals, setDeals] = useState([]);
  const match = useRouteMatch('/admin/:organization');
  const dealMatch = useRouteMatch('/admin/:organization/:deal');
  const orgSlug = match?.params?.organization? match.params.organization : ''
  const dealSlug = dealMatch?.params?.deal? dealMatch.params.deal : ''
  const [getOrgDeals, { loading, data }] = useLazyQuery(ORG_OVERVIEW, {
    variables: { slug: orgSlug, status: 'active' },
  });

  const handleTabChange = (e, newIndex) => {
    setTabIndex(newIndex)
  }

  useEffect(() => {
    getOrgDeals()
  }, [orgSlug])

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  useEffect(() => {
    if(data?.organization?.deals?.length){
      let deals = data.organization.deals.map(deal => { return { dealName: deal.company_name, dealSlug: deal.slug}})
      if(dealSlug){
        let dealIndex = deals.map(deal => deal.dealSlug).indexOf(dealSlug);
        handleTabChange('', dealIndex)
      }
      setDeals(deals)
    }
  }, [data])

  useEffect(() => {
    if(deals.length){
      const { dealSlug } = deals[tabIndex]
      setTimeout(() => {
        history.push(`/admin/${orgSlug}/${dealSlug}`)
      }, 1000);
    }
  }, [deals])

  useEffect(() => {
    if(deals.length){
      const { dealSlug } = deals[tabIndex]
      history.push(`/admin/${orgSlug}/${dealSlug}`)
    }
  }, [tabIndex])


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  if(loading) return <Loader/>

  const firstNDeals = 4
  let dealsCopy = deals.map(deal => deal)
  let firstDeals = dealsCopy.splice(0, firstNDeals);

  return(
    <div className={classes.root}>
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
        {firstDeals.map((deal, index) =>
          <Tab
            label={deal.dealName}
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
      </Tabs>
      {dealsCopy.length?
        <div>
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            onClick={handleClick}
            className={classes.moreButton}
            >
            More
            <KeyboardArrowDownIcon/>
          </Button>
          <Menu
            elevation={0}
            getContentAnchorEl={null}
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            >
            {dealsCopy.map((deal, index) =>
              <MenuItem className={deal.dealSlug === dealSlug? classes.selectedItem : classes.item}>
                <ListItemText primary={deal.dealName} onClick={(e) => handleTabChange(e, index + firstNDeals)} key={`tab-${index + firstNDeals}`}/>
              </MenuItem>
            )}
          </Menu>
        </div>
        :
        ''
      }
    </div>
  )
}

export default withStyles(styles)(withRouter(NewNavBar));
