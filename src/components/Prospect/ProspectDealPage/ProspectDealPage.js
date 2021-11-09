import React, { useState } from 'react';
import { Paper, Typography, IconButton, Button, Avatar, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { BsArrowLeft, BsPersonPlus } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { phone } from '../../../utils/helpers';
import DealPage from './ProspectDealPageSections/DealPage';
import Insights from './ProspectDealPageSections/Insights';
import InvestorActivity from './ProspectDealPageSections/InvestorActivity';
import Requests from './ProspectDealPageSections/Requests';

const useStyles = makeStyles((theme) => ({
  closePledging: {
    background: '#0261FF',
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: '2rem',
    [theme.breakpoints.down('sm')]: {
      padding: '.5rem',
    },
  },
  dealLogo: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    textAlign: 'center',
    marginLeft: '1rem',
  },
  paper: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    marginBottom: '16px',
    borderRadius: '15px',
    padding: '42px',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    [theme.breakpoints.down(phone)]: {
      maxWidth: '600px',
      marginBottom: '24px',
      padding: '16px',
      paddingBottom: '30px',
    },
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '.5rem',
  },
  inputGridContainer: {
    marginTop: '16px',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
    },
  },
  inputGridItem: {
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
    },
  },
  inviteButton: {
    background: '#DAE7FF',
    color: '#0261FF',
    marginRight: '.5rem',
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
    '&:focus': {
      outline: 'none',
    },
  },
  tabs: {
    width: '100%',
    border: 'none',
    height: '50px',
    padding: '0 28px',
    '& *': {
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 12px',
    },
  },
  tabsContainer: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      overflow: 'auto',
      display: 'block',
    },
  },
  tabsIndicator: {
    display: 'none',
  },
  tabWrapper: {
    padding: '0 20px',
  },
}));

const dashboardTabs = ['Insights', 'Deal Page', 'Investor Activity', 'Requests'];

const ProspectDealPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <Insights classes={classes} />;

      case 1:
        return <DealPage classes={classes} />;

      case 2:
        return <InvestorActivity classes={classes} />;

      case 3:
        return <Requests classes={classes} />;

      default:
        return <p>No Data</p>;
    }
  };

  const handleBack = () => {
    history.push('/prospects');
  };

  return (
    <div>
      <div className={classes.mainTitleContainer}>
        <Typography variant="h6" className={classes.mainTitle}>
          Allocations Angels{' '}
          <span style={{ fontSize: '14px', color: 'grey' }}>
            / Search and follow in the directory
          </span>
        </Typography>
      </div>

      {/* main paper on page */}
      <Paper className={classes.paper}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" component="span" onClick={handleBack}>
              <BsArrowLeft style={{ color: 'blue' }} />
            </IconButton>
            <Typography variant="subtitle2">Back</Typography>
          </div>
          <div>
            <Button
              variant="contained"
              className={classes.inviteButton}
              endIcon={<BsPersonPlus style={{ color: '0461FF' }} />}
            >
              Invite
            </Button>
            <Button variant="contained" className={classes.closePledging}>
              CLOSE PLEDGING
            </Button>
            <IconButton>
              <FiMoreVertical style={{ color: '#A0A4A8' }} />
            </IconButton>
          </div>
        </div>

        {/* logo and deal name */}
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1rem' }}>
          <Avatar
            alt="deal logo"
            // TODO: add in deal logo
            src="/static/images/avatar/1.jpg"
            className={classes.dealLogo}
          />
          <div style={{ marginLeft: '.5rem' }}>
            <Typography style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Deal Name</Typography>
            <Typography style={{ fontSize: '.8rem' }}>Due Date: deal due date</Typography>
          </div>
        </div>

        {/* tabs */}
        <div style={{ position: 'relative', paddingTop: '2rem' }}>
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

export default ProspectDealPage;
