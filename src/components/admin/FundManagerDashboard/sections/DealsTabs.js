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
    padding: '0 40px',
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
  const { deals } = data.organization;
  const matches = useMediaQuery('(max-width:600px)');
  const [titleContainer, setTitleContainer] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (e, newIndex) => {
    setTabIndex(newIndex);
    handleClose();
  };

  useEffect(() => {
    const titleCont = document.getElementById('main-title-container');
    setTitleContainer(titleCont);
  }, []);

  const mappedTabs = deals.map((deal, index) => {
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
  });

  if (!data || !titleContainer) return <Loader />;

  console.log('INDEX', tabIndex);

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
        variant={matches ? 'scrollable' : 'standard'}
      >
        {matches ? mappedTabs.slice(0, 1) : mappedTabs.slice(0, 4)}

        {matches ? (
          <>
            {mappedTabs.length > 1 ? (
              <>
                <Button onClick={handleClick} className={classes.moreButton}>
                  <Typography>
                    {tabIndex < 1 ? (
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
                  {mappedTabs.slice(1).map((tab, i) => {
                    return <MenuItem onClick={(e) => handleTabChange(e, i + 1)}>{tab}</MenuItem>;
                  })}
                </Menu>
              </>
            ) : (
              ''
            )}
          </>
        ) : (
          <>
            {mappedTabs.length > 4 ? (
              <>
                <Button onClick={handleClick} className={classes.moreButton}>
                  <Typography>
                    {tabIndex < 4 ? (
                      'More Funds'
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
                  {mappedTabs.slice(4).map((tab, i) => {
                    return <MenuItem onClick={(e) => handleTabChange(e, i + 4)}>{tab}</MenuItem>;
                  })}
                </Menu>
              </>
            ) : (
              ''
            )}
          </>
        )}
      </Tabs>
      <div
        className={classes.tabsPlaceholder}
        style={{ height: titleContainer ? `${titleContainer.offsetHeight + 48}px` : '180px' }}
      />
    </div>
  );
};

export default withStyles(styles)(withRouter(DealsTabs));
