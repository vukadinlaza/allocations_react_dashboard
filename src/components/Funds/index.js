import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography, Button, Grid } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useQuery } from '@apollo/react-hooks';
import { phone, tablet } from '../../utils/helpers';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';
import Highlights from './sections/Highlights';
import Funds from './sections/Funds';
import SPVs from './sections/SPVs';

const styles = (theme) => ({
  contentContainer: {
    margin: '40px',
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
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    position: 'absolute',
    width: '100%',
    left: '0',
    top: '0',
    background: 'white',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    padding: '20px 0px',
  },
  mainTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 40px',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
      fontSize: '.5rem',
    },
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
  tab: {
    textTransform: 'none',
    minWidth: 0,
    fontWeight: '400',
    '&:focus': {
      outline: 'none',
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
});

const FUND_ADMIN_DASHBOARD_STATS = gql`
  query fundAdminHighlights {
    fundAdminHighlights
  }
`;

const dashboardTabs = ['Highlights', 'Funds', 'SPVs'];

const FundAdminDashboard = ({ classes, history }) => {
  const { userProfile } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const { data } = useQuery(FUND_ADMIN_DASHBOARD_STATS);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <Highlights classes={classes} data={data} />;

      case 1:
        return <Funds classes={classes} />;

      case 2:
        return <SPVs classes={classes} />;

      default:
        return <p>No Data</p>;
    }
  };

  return (
    <div className={classes.dashboardContainer}>
      <div className={classes.mainTitleContainer}>
        <Typography className={classes.mainTitle}>Fund Admin Dashboard</Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {userProfile?.admin && (
            <span className={classes.createButtonLink}>
              <Button
                className={classes.createButton}
                style={{ marginLeft: '1rem' }}
                onClick={() => console.log('Create new Fund')}
              >
                <AddCircleIcon style={{ marginRight: '5px', fontSize: '20px' }} />
                Create New
              </Button>
            </span>
          )}
        </div>
      </div>
      <div>
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
          <div className={classes.contentContainer}> {getTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(withRouter(FundAdminDashboard));
