import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { get } from 'lodash';
import { gql } from '@apollo/client';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import MenuIcon from '@material-ui/icons/Menu';
import { useAuth } from '../../auth/useAuth';
import SidebarDrawer from './SidebarDrawer';
import './Sidebar.scss';

const useStyles = makeStyles(() => ({
  drawerPaper: {
    width: '65%',
    paddingTop: 8,
    borderRight: 'none !important',
    borderLeft: 0,
    position: 'relative',
    height: '100%',
    backgroundColor: '#f7f7f7',
    background: '#f7f7f7',
  },
  newDrawerPaper: {
    width: '100%',
    paddingTop: 5,
    position: 'relative',
    height: '100%',
    backgroundColor: '#f7f7f7',
    background: '#f7f7f7',
    borderRight: 'none !important',
  },
  select: {
    width: '90%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}));

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

export default function Sidebar(props) {
  const { userProfile, logout, isAuthenticated } = useAuth(GET_INVESTOR);
  const history = useHistory();
  const [investTab, setInvestTab] = useState(false);
  const [creditTab, setCreditTab] = useState(false);
  const [buildTab, setBuildTab] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [currentHomeUrl, setCurrentHomeUrl] = useState('');
  const fundMatch = useRouteMatch('/admin/:organization');
  const location = useLocation();
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

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

  const isUserAuthenticated = isAuthenticated && !!userProfile;

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
    <div className="Sidebar">
      {!onboarding && (
        <>
          <AppBar className="appBar">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className="menuButton"
              >
                <MenuIcon />
              </IconButton>
              <div className="brand">
                <Brand
                  organizations_admin={userProfile.organizations_admin || []}
                  admin={userProfile.admin}
                />
              </div>
            </Toolbar>
          </AppBar>

          <div className="contentContainer">
            <nav className="drawer" aria-label="mailbox folders">
              <Hidden mdUp implementation="css" className="firstHidden">
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
                  <FormControl className="formControl">
                    <Select
                      labelId="accounts-select"
                      value={currentAccount || ''}
                      onChange={handleAccountChange}
                      className="input"
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
                        className="formItem"
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

              <Hidden smDown implementation="css" className="secondHidden">
                <Drawer
                  className="newDrawerPaper"
                  classes={{
                    paper: classes.newDrawerPaper,
                  }}
                  variant="permanent"
                  open
                >
                  <FormControl className="formControl">
                    <Select
                      labelId="accounts-select"
                      value={currentAccount || ''}
                      onChange={handleAccountChange}
                      className="input"
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
                        className="formItem"
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
            <main className="content" style={{ background: 'white', height: '100vh' }}>
              {props.children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

const whitelist = ['allocations', 'organizations', 'funds', 'investments', 'invest'];

function Brand({ organizations_admin, admin }) {
  const history = useHistory();
  const match = useRouteMatch('/admin/:organization');
  const dealMatch = useRouteMatch('/deals/:organization/:id');
  let isAdmin = organizations_admin.find((org) => {
    return org.slug === match?.params?.organization;
  });
  if (admin) {
    isAdmin = true;
  }

  const adminMatches =
    match && match.params.organization && !whitelist.includes(match.params.organization);
  const dealMatches =
    dealMatch &&
    dealMatch.params.organization &&
    !whitelist.includes(dealMatch.params.organization);
  if (adminMatches || dealMatches) {
    const slug = adminMatches ? match.params.organization : dealMatch.params.organization;
    const orgName = get(
      (organizations_admin || []).find((org) => org.slug === slug),
      'name',
      false,
    );
    return <OrgLogo slug={slug} name={orgName} isAdmin={isAdmin} />;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      onClick={() => history.push('/')}
      src="https://allocations-public.s3.us-east-2.amazonaws.com/allocations-logo.svg"
      alt="allocations"
      style={{ height: '60px', width: 'auto' }}
    />
  );
}

function deSlugify(slug) {
  try {
    return slug
      .split('-')
      .map((str) => `${str[0].toUpperCase()}${str.slice(1)}`)
      .join(' ');
  } catch (e) {
    return slug;
  }
}

function OrgLogo({ slug, name, isAdmin }) {
  const history = useHistory();
  const [img, setImg] = useState();
  useEffect(() => {
    setImg(`https://allocations-public.s3.us-east-2.amazonaws.com/organizations/${slug}.png`);
  }, [slug]);
  const pushfn = isAdmin ? () => history.push(`/admin/${slug}`) : () => {};
  if (!img) {
    return (
      <div className="brand" onClick={pushfn}>
        <span className="brand-span">
          <b>{name || deSlugify(slug)}</b>
        </span>
      </div>
    );
  }

  return (
    <div className="brand" onClick={() => history.push(`/admin/${slug}`)}>
      <img height="60px" width="180px" alt={slug} onError={() => setImg(null)} src={img} />
    </div>
  );
}
