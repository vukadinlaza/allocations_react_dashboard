import React, { useState } from 'react';
import { Tabs, Tab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Deals from './sections/Deals';
import InvitedDeals from './sections/InvitedDeals';
import PledgedDeals from './sections/PledgedDeals';
import Requests from './sections/Requests';

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    padding: '2rem',
    [theme.breakpoints.down('sm')]: {
      padding: '.5rem',
    },
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    position: 'absolute',
    left: '0',
    top: '0',
    background: 'white',
  },
  mainTitle: {
    fontWeight: '500',
    padding: '20px 0px',
  },
  mainTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 40px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      fontSize: '.5rem',
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
    [theme.breakpoints.down('sm')]: {
      padding: '0 12px',
    },
  },
  tabsContainer: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      overflow: 'auto',
      display: 'block',
    },
  },
  tabsIndicator: {
    display: 'none',
  },
  tabWrapper: {
    padding: '0 20px',
  },
}));

const dashboardTabs = ['My Deals', 'Deals Invited To', 'Deals Pledged', 'Requests'];

const Prospect = () => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <Deals />;

      case 1:
        return <InvitedDeals />;

      case 2:
        return <PledgedDeals />;

      case 3:
        return <Requests />;

      default:
        return <p>No Data</p>;
    }
  };

  return (
    <div className={classes.dashboardContainer}>
      <div className={classes.mainTitleContainer}>
        <Typography variant="subtitle1" className={classes.mainTitle}>
          Allocations Angels{' '}
          <span style={{ fontSize: '12px', color: 'grey' }}>
            / Search and follow in the directory
          </span>
        </Typography>
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
                // eslint-disable-next-line react/no-array-index-key
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
          <div className={classes.contentContainer}>{getTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Prospect;
