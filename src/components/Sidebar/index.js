import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useTheme } from '@material-ui/core/styles';
import {
  Toolbar,
  AppBar,
  Drawer,
  Hidden,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { useAuth } from '../../auth/useAuth';
import SidebarDrawer from './SidebarDrawer';
import styles from './styles';

const GET_INVESTOR = gql`
  {
    investor {
      _id
      name
      admin
      showInvestAndMrkPlc
      showCredit
      showBuild
      organizations_admin {
        _id
        slug
        name
        logo
      }
    }
  }
`;

function Sidebar(props) {
  const { userProfile, logout, isAuthenticated, loading } = useAuth(GET_INVESTOR);
  const history = useHistory();
  const [investTab, setInvestTab] = useState(false);
  const [creditTab, setCreditTab] = useState(false);
  const [buildTab, setBuildTab] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [currentHomeUrl, setCurrentHomeUrl] = useState('');
  const fundMatch = useRouteMatch('/admin/:organization');
  const location = useLocation();
  const { window, classes } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  console.log('user', userProfile);

  useEffect(() => {
    if (userProfile.showInvestAndMrkPlc || location.pathname === '/invest') {
      setInvestTab(true);
    }
    if (userProfile.showCredit || location.pathname === '/credit') {
      setCreditTab(true);
    }
    if (userProfile.showBuild || location.pathname === '/get-started') {
      setBuildTab(true);
    }
  }, [
    userProfile.showInvestAndMrkPlc,
    userProfile.showCredit,
    location.pathname,
    userProfile.showBuild,
  ]);

  const isUserAuthenticated = isAuthenticated && !loading;

  useEffect(() => {
    const userIsOrgAdmin = userProfile?.organizations_admin?.length;
    const defaultAccount = userIsOrgAdmin
      ? userProfile.organizations_admin[0].name
      : userProfile.name;
    const defaultUrl = userIsOrgAdmin ? `/admin/${userProfile.organizations_admin[0].slug}` : '/';
    setCurrentHomeUrl(defaultUrl);
    if (isAuthenticated) {
      if (location?.pathname === '/') {
        setCurrentAccount(defaultAccount);
        history.push(defaultUrl);
      } else {
        const organizationSlug = fundMatch?.params?.organization;
        const currentOrg = userProfile?.organizations_admin?.find(
          (org) => org.slug === organizationSlug,
        );
        handleAccountChange(currentOrg?.name ? currentOrg.name : '');
      }
    }
  }, [isUserAuthenticated]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleAccountChange = (e) => {
    const newValue = e.target ? e.target.value : e;
    const org = userProfile?.organizations_admin?.find((org) => org.name === newValue);
    const account = org ? org.name : userProfile?.name;
    const currentHomePath = org ? `/admin/${org.slug}` : '/';
    setCurrentHomeUrl(currentHomePath);
    setCurrentAccount(account);
  };

  const container = window !== undefined ? () => window().document.body : undefined;
  const onboarding = location.pathname === '/get-started';
  const adminOrganizations = userProfile?.organizations_admin;
  const adminOrganizationsCopy = adminOrganizations ? [...adminOrganizations] : []; // Create a copy of organizations so we can mutate with sort

  return (
    <div className={classes.sidebar}>
      {!onboarding && (
        <>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <div className={classes.brand}>
                <Brand
                  organizations_admin={userProfile.organizations_admin || []}
                  admin={userProfile.admin}
                />
              </div>
            </Toolbar>
          </AppBar>

          <div className={classes.contentContainer}>
            <nav className={classes.drawer} aria-label="mailbox folders">
              <Hidden mdUp implementation="js" className={classes.firstHidden}>
                <Drawer
                  container={container}
                  variant="temporary"
                  anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                  style={{ backgroundColor: '#f7f7f7 !important' }}
                  ModalProps={{
                    keepMounted: true,
                  }}
                >
                  <FormControl className={classes.formControl}>
                    <Select
                      labelId="accounts-select"
                      value={currentAccount || ''}
                      onChange={handleAccountChange}
                      className={classes.input}
                      style={{ backgroundColor: '#f7f7f7' }}
                      classes={{
                        root: classes.select,
                      }}
                      inputProps={{
                        classes: {
                          focused: classes.inputFocused,
                          underline: classes.inputFocused,
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleDrawerToggle();
                          history.push(`/`);
                        }}
                        value={userProfile?.name}
                        className={classes.formItem}
                      >
                        {userProfile?.name}
                      </MenuItem>
                      {adminOrganizationsCopy?.length &&
                        adminOrganizationsCopy
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((org) => (
                            <MenuItem
                              onClick={() => {
                                handleDrawerToggle();
                                history.push(`/admin/${org.slug}`);
                              }}
                              value={org.name}
                              key={org.name}
                            >
                              {org.name}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                  <SidebarDrawer
                    mobileOpen={mobileOpen}
                    handleDrawerClose={handleDrawerClose}
                    investTab={investTab}
                    creditTab={creditTab}
                    userProfile={userProfile}
                    currentHomeUrl={currentHomeUrl}
                    logout={logout}
                    location={location}
                  />
                </Drawer>
              </Hidden>

              <Hidden smDown implementation="css" className={classes.secondHidden}>
                <Drawer
                  className={classes.newDrawerPaper}
                  classes={{
                    paper: classes.newDrawerPaper,
                  }}
                  variant="permanent"
                  open
                >
                  <div className={classes.brand}>
                    <Brand
                      organizations_admin={userProfile.organizations_admin || []}
                      admin={userProfile.admin}
                    />
                  </div>
                  <FormControl className={classes.formControl}>
                    <Select
                      labelId="accounts-select"
                      value={currentAccount || ''}
                      onChange={handleAccountChange}
                      className={classes.input}
                      classes={{
                        root: classes.select,
                      }}
                      inputProps={{
                        classes: {
                          focused: classes.inputFocused,
                          underline: classes.inputFocused,
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() => history.push(`/`)}
                        value={userProfile?.name}
                        className={classes.formItem}
                      >
                        {userProfile?.name}
                      </MenuItem>
                      {adminOrganizationsCopy?.length &&
                        adminOrganizationsCopy
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((org) => (
                            <MenuItem
                              onClick={() => history.push(`/admin/${org.slug}`)}
                              value={org.name}
                              key={org.name}
                            >
                              {org.name}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>

                  <SidebarDrawer
                    mobileOpen={mobileOpen}
                    handleDrawerClose={handleDrawerClose}
                    investTab={investTab}
                    creditTab={creditTab}
                    userProfile={userProfile}
                    currentHomeUrl={currentHomeUrl}
                    logout={logout}
                    location={location}
                  />
                </Drawer>
              </Hidden>
            </nav>
            <main className={classes.content} style={{ background: 'white', height: '100vh' }}>
              {props.children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default withStyles(styles)(Sidebar);

function Brand() {
  const history = useHistory();
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      onClick={() => history.push('/')}
      src="https://allocations-public.s3.us-east-2.amazonaws.com/allocations-logo.svg"
      alt="allocations"
      style={{ height: '60px', width: 'auto', cursor: 'pointer' }}
    />
  );
}
