import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Tabs, Tab, Typography, Paper } from '@material-ui/core';
import MyDeals from './sections/MyDeals';
import InvitedDeals from './sections/InvitedDeals';
import PledgedDeals from './sections/PledgedDeals';
import Requests from './sections/Requests';
import useStyles from './PropectStyles';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      email
    }
  }
`;

const GET_DEALS = gql`
  query GetDeals {
    allDeals {
      _id
      company_name
      slug
      created_by {
        _id
      }
    }
  }
`;

const dashboardTabs = ['My Deals', 'Deals Invited To', 'Deals Pledged', 'Requests'];

const Prospect = () => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const { data: investorData } = useQuery(GET_INVESTOR);
  const userProfile = !investorData ? '' : investorData?.investor;

  const { loading, error, data } = useQuery(GET_DEALS);
  const deals = loading ? [] : data?.allDeals;

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <MyDeals userProfile={userProfile} deals={deals} />;

      case 1:
        return <InvitedDeals userProfile={userProfile} deals={deals} />;

      case 2:
        return <PledgedDeals userProfile={userProfile} deals={deals} />;

      case 3:
        return <Requests userProfile={userProfile} deals={deals} />;

      default:
        return <p>No Data</p>;
    }
  };

  return (
    <div>
      <div className={classes.mainTitleContainer}>
        <Typography variant="subtitle1" className={classes.mainTitle}>
          Allocations Angels{' '}
          <span style={{ fontSize: '12px', color: 'grey' }}>
            / Search and follow in the directory
          </span>
        </Typography>
      </div>

      <Paper className={classes.paper}>
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
      </Paper>
    </div>
  );
};

export default Prospect;
