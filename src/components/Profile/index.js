import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Typography } from '@material-ui/core';
import { useAuth } from '../../auth/useAuth';
import ProfileInfo from './profileSections/ProfileInfo';
import Loader from '../utils/Loader';
import useStyles from './styles';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      display_username
      username
      state
      sectors
      stages
      linkedinUrl
      profileImageKey
      city
      profileBio
      account {
        _id
      }
      accredidation_doc {
        link
        path
      }
      passport {
        link
        path
      }
    }
  }
`;

const dashboardTabs = ['Personal Information'];

const Profile = () => {
  const classes = useStyles();
  const { userProfile, refetch, loading, logout } = useAuth(GET_INVESTOR);
  const [formStatus, setFormStatus] = useState('edit');

  const [tabIndex, setTabIndex] = useState(0);

  const icon =
    formStatus === 'loading' ? 'circle-notch' : formStatus === 'complete' ? 'check' : null;
  if (loading) return <Loader />;

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
          <ProfileInfo
            logout={logout}
            classes={classes}
            investorProfile={userProfile}
            icon={icon}
            setFormStatus={setFormStatus}
            actionText="Save Profile"
            refetch={refetch}
          />
        );

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

export default withRouter(Profile);
