import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';
import { phone } from '../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  selectedTab: {
    fontWeight: '500 !important',
    color: theme.colors.primary[500],
    '& $tabWrapper': {
      backgroundColor: theme.colors.primary[50],
      borderRadius: '10px',
    },
  },
  tab: {
    textTransform: 'none',
    minWidth: 0,
    fontWeight: '500',
    padding: '6px 0',
    fontSize: '16px',
    color: theme.colors.gray[500],
    '&:focus': {
      outline: 'none',
    },
  },
  tabs: {
    width: '100%',
    border: 'none',
    height: '50px',
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
    padding: '4px 16px',
  },
}));

const HighlightedTabs = ({ tabs, tabIndex, handleTabChange, rootStyle }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
        style={rootStyle || {}}
      >
        {tabs.map((tab, index) => (
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
    </div>
  );
};

export default HighlightedTabs;
