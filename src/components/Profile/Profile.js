import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography } from '@material-ui/core';
import AccountUsers from './sections/AccountUsers';
import AccountEntities from './sections/AccountEntities';
import ProfileInfo from './sections/ProfileInfo';
import styles from './styles';

const dashboardTabs = ['Personal Information', 'Accounts', 'Entities'];

const Network = ({ classes }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <ProfileInfo classes={classes} />;

      case 1:
        return <AccountUsers classes={classes} />;

      case 2:
        return <AccountEntities classes={classes} />;

      default:
        return <p>No Data</p>;
    }
  };

  return (
    <div className={classes.dashboardContainer}>
      <div className={classes.mainTitleContainer}>
        <Typography className={classes.mainTitle}>Profile</Typography>
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

export default withStyles(styles)(withRouter(Network));
