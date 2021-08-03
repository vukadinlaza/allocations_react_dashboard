import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import { phone } from '../../utils/helpers';
import Loader from '../utils/Loader';
import Highlights from './sections/Highlights';
import Deals from './sections/Deals';
import Investors from './sections/Investors';
import FundManagers from './sections/FundManagers';
import styles from './styles.js';

const FUND_ADMIN_DASHBOARD_STATS = gql`
  query fundAdminHighlights {
    fundAdminHighlights
  }
`;

const dashboardTabs = ['Highlights', 'Fund Managers', 'Funds', 'SPVs', 'Investors'];

const FundAdminDashboard = ({ classes }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { data } = useQuery(FUND_ADMIN_DASHBOARD_STATS);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <Highlights data={data} />;

      case 1:
        return <FundManagers data={data} classes={classes} />;

      case 2:
        return <Deals filter={{ filter: 'fund' }} tableName="Fund" classes={classes} />;

      case 3:
        return <Deals filter={{ filter: { $ne: 'fund' } }} tableName="SPV" classes={classes} />;

      case 4:
        return <Investors classes={classes} />;

      default:
        return <p>No Data</p>;
    }
  };

  return (
    <div className={classes.dashboardContainer}>
      <div className={classes.mainTitleContainer}>
        <Typography className={classes.mainTitle}>Fund Admin Dashboard</Typography>
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
