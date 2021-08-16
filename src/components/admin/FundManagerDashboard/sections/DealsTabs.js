import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { phone } from '../../../../utils/helpers';
import Loader from '../../../utils/Loader';

const styles = (theme) => ({
  dealTag: {
    borderRadius: '20px',
    color: 'white',
    fontSize: '10px',
    padding: '0px 10px',
    marginLeft: '5px',
    fontWeight: 'bold',
    height: 'auto !important',
    display: 'flex',
    alignItems: 'center',
    '& *': {
      fontSize: '10px',
    },
  },
  item: {
    '&:hover': {
      backgroundColor: '#8493A61A',
    },
    '& *': {
      fontSize: '14px',
      fontWeight: 'bold',
    },
  },
  moreButton: {
    width: '10em',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#8493A61A',
    },
    '&:focus': {
      outline: 'none',
      border: 'none',
    },
  },
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    color: '#2A2B54',
    fontWeight: 'bold',
    marginBottom: '15px',
    [theme.breakpoints.down('1280')]: {
      justifyContent: 'center',
      padding: '0 22px',
    },
  },
  selectedTab: {
    // color: "#2A2B54 !important",
    fontWeight: 'bold !important',
    '& $tabWrapper': {
      background: 'none',
    },
  },
  tab: {
    textTransform: 'none',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    fontSize: '16px',
    borderBottom: '2px solid #E6E9EF',
    maxWidth: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
  tabs: {
    zIndex: '1',
  },
  tabsContainer: {
    [theme.breakpoints.down(phone)]: {
      overflowX: 'scroll',
      display: 'block',
    },
  },
  tabsPlaceholder: {
    width: 'calc(100% - 80px)',
    borderBottom: '2px solid #E6E9EF',
    height: '130px', // height of main title and tabs component
    position: 'absolute',
    top: '0px',
    left: '0px',
    margin: '0 40px',
    [theme.breakpoints.down(phone)]: {
      borderBottom: 'none',
    },
  },
  tabWrapper: {
    padding: '0 10px',
  },
});

const DealsTabs = ({ classes, data, tabIndex, setTabIndex }) => {
  // const [deals, setDeals] = useState([]);
  const { deals } = data.organization;
  const [titleContainer, setTitleContainer] = useState(null);

  const handleTabChange = (e, newIndex) => {
    setTabIndex(newIndex);
  };

  useEffect(() => {
    const titleCont = document.getElementById('main-title-container');
    setTitleContainer(titleCont);
  }, []);

  if (!data || !titleContainer) return <Loader />;

  return (
    <div className={classes.root}>
      <Tabs
        value={tabIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={(e, v) => handleTabChange(e, v)}
        classes={{
          root: classes.tabs,
        }}
        variant="scrollable"
      >
        {deals.map((deal, index) => {
          const isFund = deal.investmentType === 'fund';
          const closed = deal.status === 'closed';
          return (
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {deal.company_name}
                  {deal.company_name !== 'All' && (
                    <span
                      style={{ backgroundColor: isFund ? '#2A2B54' : '#0461FF' }}
                      className={classes.dealTag}
                    >
                      {isFund ? (
                        <AccountBalanceIcon style={{ marginRight: '4px' }} />
                      ) : (
                        <FontAwesomeIcon style={{ marginRight: '4px' }} icon={faRocket} />
                      )}
                      {isFund ? 'FUND' : 'SPV'}
                      <FiberManualRecordIcon
                        style={{ color: closed ? '#d0d0d0' : '#39C522', marginLeft: '2px' }}
                      />
                    </span>
                  )}
                </div>
              }
              // eslint-disable-next-line react/no-array-index-key
              key={`tab-${index}`}
              classes={{
                root: classes.tab,
                selected: classes.selectedTab,
              }}
              disableRipple
            />
          );
        })}
      </Tabs>
      <div
        className={classes.tabsPlaceholder}
        style={{ height: titleContainer ? `${titleContainer.offsetHeight + 48}px` : '180px' }}
      />
    </div>
  );
};

export default withStyles(styles)(withRouter(DealsTabs));
