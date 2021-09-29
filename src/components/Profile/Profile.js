import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography } from '@material-ui/core';
import { useAuth } from '../../auth/useAuth';
// import ProfileAccounts from './profileSections/ProfileAccounts';
// import ProfileEntities from './profileSections/ProfileEntities';
import ProfileInfo from './profileSections/ProfileInfo';
import Loader from '../utils/Loader';
import styles from './styles';

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

// const GET_ACCOUNT_USERS = gql`
//   query data {
//     accountUsers {
//       _id
//       first_name
//       last_name
//       name
//       email
//     }
//     rootAdmin
//     accountId
//   }
// `;

// const REMOVE_ACCT_USER = gql`
//   mutation RemoveAcctUser($accountId: String, $userId: String!) {
//     removeAcctUser(accountId: $accountId, userId: $userId)
//   }
// `;
// const CREATE_ENTITY = gql`
//   mutation createEntity($payload: Object) {
//     createEntity(payload: $payload)
//   }
// `;

// const REMOVE_ACCT_ENTITY = gql`
//   mutation DeleteEntity($accountId: String, $entityId: String!) {
//     deleteEntity(accountId: $accountId, entityId: $entityId)
//   }
// `;

// const UPDATE_ENTITY = gql`
//   mutation UpdateEntity($payload: EntityInput!) {
//     updateEntity(payload: $payload) {
//       _id
//       first_name
//       last_name
//       country
//       entity_name
//       investor_type
//       signer_full_name
//       accredited_investor_status
//       email
//       passport {
//         link
//         path
//       }
//     }
//   }
// `;

// const GET_ACCOUNT_ENTITIES = gql`
//   query data($accountId: String) {
//     getEntities(accountId: $accountId) {
//       _id
//       first_name
//       last_name
//       name
//       email
//       entity_name
//       investor_type
//       signer_full_name
//       country
//       isPrimaryEntity
//     }
//   }
// `;

const dashboardTabs = ['Personal Information'];

/* tabs that need to be commented out for now */
// 'Accounts', 'Entities'

const Profile = ({ classes }) => {
  const [investor, setInvestor] = useState(null);
  const [formStatus, setFormStatus] = useState('edit');
  const { userProfile, refetch: refetchUser } = useAuth(GET_INVESTOR);
  // const { data, refetch: refetchAccountUsers } = useQuery(GET_ACCOUNT_USERS);
  // const [createEntity, { data: createEntityRes }] = useMutation(CREATE_ENTITY);
  // const [deleteEntity, { data: deleteEntityRes }] = useMutation(REMOVE_ACCT_ENTITY);
  // const [updateEntity, { data: updateEntityRes }] = useMutation(UPDATE_ENTITY);
  // const { data: accountEntities, refetch: refetchAccountEntities } = useQuery(
  //   GET_ACCOUNT_ENTITIES,
  //   {
  //     variables: { accountId: userProfile?.account?._id },
  //   },
  // );

  // const [removeUser, { data: removeRes }] = useMutation(REMOVE_ACCT_USER);

  useEffect(() => {
    if (userProfile) {
      setInvestor(userProfile);
    }
  }, [userProfile]);

  // useEffect(() => {
  //   if (removeRes) {
  //     refetchAccountUsers();
  //   }
  // }, [refetchAccountUsers, removeRes]);

  // useEffect(() => {
  //   if (formStatus === 'complete') {
  //     refetchAccountUsers();
  //     refetchUser();
  //   }
  // }, [formStatus, refetchAccountUsers, refetchUser]);

  // useEffect(() => {
  //   if (createEntityRes || deleteEntityRes || updateEntityRes) {
  //     refetchAccountEntities();
  //   }
  // }, [createEntityRes, refetchAccountEntities, deleteEntityRes, updateEntityRes]);

  const [tabIndex, setTabIndex] = useState(0);

  const icon =
    formStatus === 'loading' ? 'circle-notch' : formStatus === 'complete' ? 'check' : null;
  if (!userProfile.email || !userProfile?.account) return <Loader />;

  // const acctUsers = data?.accountUsers || [];

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
          <ProfileInfo
            classes={classes}
            investor={investor}
            userProfile={userProfile}
            icon={icon}
            setInvestor={setInvestor}
            setFormStatus={setFormStatus}
            actionText="Save Profile"
            refetchUser={refetchUser}
          />
        );

      // case 1:
      //   return (
      //     <ProfileAccounts
      //       classes={classes}
      //       acctUsers={acctUsers}
      //       userProfile={userProfile}
      //       data={data}
      //       removeUser={removeUser}
      //       refetchAccountUsers={refetchAccountUsers}
      //     />
      //   );

      // case 2:
      //   return (
      //     <ProfileEntities
      //       classes={classes}
      //       acctUsers={acctUsers}
      //       userProfile={userProfile}
      //       data={data}
      //       deleteEntity={deleteEntity}
      //       refetchAccountUsers={refetchAccountUsers}
      //       accountEntities={accountEntities}
      //       refetchAccountEntities={refetchAccountEntities}
      //       createEntity={createEntity}
      //       updateEntity={updateEntity}
      //     />
      //   );

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

export default withStyles(styles)(withRouter(Profile));
