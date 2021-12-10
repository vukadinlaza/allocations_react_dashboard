import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Tabs, Tab, Button, Menu, MenuItem, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  menuItem: {
    '& *': {
      alignItems: 'baseline',
    },
  },
  moreButton: {
    width: 'fit-content',
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
  scrollableTabs: {
    display: 'flex',
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
    maxWidth: 'none',
    opacity: '1',
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
  tabWrapper: {
    padding: '0 10px',
  },
});

const DealsTabs = ({ classes, data, tabIndex, setTabIndex }) => {
  const { deals = [] } = data?.organization || {};
  const isMobile = useMediaQuery('(max-width:600px)');
  const [titleContainer, setTitleContainer] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dropdownSelected, setDropdownSelected] = useState(false);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (e, newIndex) => {
    setTabIndex(newIndex);

    if ((isMobile && newIndex === 0) || (!isMobile && newIndex < 4)) {
      setDropdownSelected(false);
    }
    if ((isMobile && newIndex > 0) || (!isMobile && newIndex >= 4)) {
      setDropdownSelected(true);
    }

    handleClose();
  };

  useEffect(() => {
    const titleCont = document.getElementById('main-title-container');
    setTitleContainer(titleCont);
  }, []);

  const mappedTabs = deals.map((deal) => {
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
        key={`${deal._id}`}
        classes={{
          root: classes.tab,
          selected: classes.selectedTab,
        }}
        disableRipple
      />
    );
  });

  if (!data || !titleContainer) return <Loader />;

  console.log(deals, 'DEALS');

  return (
    <div className={classes.root}>
      <Tabs
        value={tabIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={(e, v) => handleTabChange(e, v)}
        classes={{
          root: classes.tabs,
          scrollable: classes.scrollableTabs,
        }}
        variant="scrollable"
      >
        {isMobile ? mappedTabs.slice(0, 1) : mappedTabs.slice(0, 4)}
        {(isMobile && mappedTabs.length > 2) || (!isMobile && mappedTabs.length > 4) ? (
          <>
            <Button
              onClick={handleClick}
              className={classes.moreButton}
              style={
                dropdownSelected ? { borderBottom: 'solid 2px #205df5', borderRadius: '0' } : {}
              }
            >
              <Typography>
                {isMobile ? (
                  tabIndex < 1 ? (
                    'Funds'
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {deals[tabIndex].company_name}
                      {deals[tabIndex].company_name !== 'All' && (
                        <span
                          style={{
                            backgroundColor:
                              deals[tabIndex].investmentType === 'fund' ? '#2A2B54' : '#0461FF',
                          }}
                          className={classes.dealTag}
                        >
                          {deals[tabIndex].investmentType === 'fund' ? (
                            <AccountBalanceIcon style={{ marginRight: '4px' }} />
                          ) : (
                            <FontAwesomeIcon style={{ marginRight: '4px' }} icon={faRocket} />
                          )}
                          {deals[tabIndex].investmentType === 'fund' ? 'FUND' : 'SPV'}
                          <FiberManualRecordIcon
                            style={{
                              color: deals[tabIndex].status === 'closed' ? '#d0d0d0' : '#39C522',
                              marginLeft: '2px',
                            }}
                          />
                        </span>
                      )}
                    </div>
                  )
                ) : tabIndex < 4 ? (
                  'More Funds'
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#205df5',
                      fontWeight: 'bold',
                    }}
                  >
                    {deals[tabIndex].company_name}
                    {deals[tabIndex].company_name !== 'All' && (
                      <span
                        style={{
                          backgroundColor:
                            deals[tabIndex].investmentType === 'fund' ? '#2A2B54' : '#0461FF',
                        }}
                        className={classes.dealTag}
                      >
                        {deals[tabIndex].investmentType === 'fund' ? (
                          <AccountBalanceIcon style={{ marginRight: '4px' }} />
                        ) : (
                          <FontAwesomeIcon style={{ marginRight: '4px' }} icon={faRocket} />
                        )}
                        {deals[tabIndex].investmentType === 'fund' ? 'FUND' : 'SPV'}
                        <FiberManualRecordIcon
                          style={{
                            color: deals[tabIndex].status === 'closed' ? '#d0d0d0' : '#39C522',
                            marginLeft: '2px',
                          }}
                        />
                      </span>
                    )}
                  </div>
                )}
              </Typography>
              <ExpandMoreIcon />
            </Button>

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {isMobile
                ? mappedTabs.slice(1).map((tab, i) => {
                    return (
                      <MenuItem
                        onClick={(e) => handleTabChange(e, i + 1)}
                        className={classes.menuItem}
                        key={`tab-${i}`}
                      >
                        {tab}
                      </MenuItem>
                    );
                  })
                : mappedTabs.slice(4).map((tab, i) => {
                    return (
                      <MenuItem
                        onClick={(e) => handleTabChange(e, i + 4)}
                        className={classes.menuItem}
                        key={`tab-${i}`}
                      >
                        {tab}
                      </MenuItem>
                    );
                  })}
            </Menu>
          </>
        ) : isMobile ? (
          mappedTabs.slice(1, 2)
        ) : (
          mappedTabs.slice(4, 5)
        )}
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(withRouter(DealsTabs));
