import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useQuery, gql } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  InputAdornment,
  Tabs,
  Tab,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AllocationsTable from './AllocationsTable';
import Loader from './Loader';
import { titleCase, phone, tablet } from '../../utils/helpers';

const styles = (theme) => ({
  root: {
    width: '100%',
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
    padding: '6px 0',
    '&:focus': {
      outline: 'none',
    },
  },
  tabs: {
    width: '100%',
    border: 'none',
    height: '50px',
    // padding: '0 28px',
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
    padding: '0 32px',
  },
});

const HighlightedTabs = ({ classes, tabs, tabIndex, handleTabChange }) => {
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

export default withStyles(styles)(HighlightedTabs);
