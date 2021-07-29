import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { get, toLower } from 'lodash';
import { gql } from '@apollo/client';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Toolbar,
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import StorefrontIcon from '@material-ui/icons/Storefront';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import AccountBalanceRoundedIcon from '@material-ui/icons/AccountBalanceRounded';
import CreditCardRoundedIcon from '@material-ui/icons/CreditCardRounded';
import { useAuth } from '../../auth/useAuth';
import NavBar from '../NavBar';
import { phone } from '../../utils/helpers';
import Loader from '../utils/Loader';
import { useViewport } from '../../utils/hooks';
import whitelistEmails from './whiteListEmails';
import './style.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  brand: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      flexShrink: 0,
    },
    zIndex: 1099,
  },
  appBar: {
    width: '100%',
    background: '#fff',
    color: '#868c97',
    boxShadow: 'none !important',
    position: 'relative',
    height: '70px',
    border: 'none',
    borderBottom: '1px solid #d8dce6',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  icon: {
    minWidth: '40px',
    color: '#8593a6',
  },
  input: {
    border: 'none !important',
    '&:before, &:after': {
      border: 'none',
    },
  },
  inputFocused: {
    border: 'none',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: '100%',
    paddingTop: 8,
    border: 'none',
    borderRight: '1px solid #dfe2e5',
    borderLeft: 0,
    position: 'relative',
    height: '100vh',
    // height: "calc(100vh - 70px)"
  },
  newDrawerPaper: {
    width: '100%',
    paddingTop: 8,
    border: 'none',
    borderRight: '1px solid #dfe2e5',
    borderLeft: 0,
    position: 'relative',
    height: '100vh',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 'calc(100vh - 70px)',
    overflow: 'hidden',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(4),
    maxWidth: 'calc(100% - 250px)',
    width: 'calc(100% - 250px)',
    overflowY: 'scroll',
    height: 'calc(100vh - 70px)',
    paddingBottom: '0',
    position: 'relative',
    [theme.breakpoints.down(phone)]: {
      width: '100vw',
      maxWidth: 'none',
      padding: '20px',
    },
  },
  formControl: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '78%',
    marginTop: '20px',
    '&:hover *:before, ': {
      border: 'none !important',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  select: {
    width: '90%',
    textAlign: 'center',
    fontWeight: 'bold',
    // fontSize: "20px"
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
  const logoutWithRedirect = () => logout({ returnTo: process.env.REACT_APP_URL });
  const [investTab, setInvestTab] = useState(false);
  const [creditTab, setCreditTab] = useState(false);
  const [buildTab, setBuildTab] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [currentHomeUrl, setCurrentHomeUrl] = useState('');
  const fundMatch = useRouteMatch('/admin/:organization');
  const homeMatch = useRouteMatch('/');
  const location = useLocation();
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { width } = useViewport();

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

  const isUserAuthenticated = isAuthenticated && userProfile;

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

  const menus = [
    {
      to: currentHomeUrl,
      title: 'Home',
      icon: <HomeIcon />,
    },
  ];
  menus.push({
    to: '/profile',
    title: 'Profile',
    icon: <PersonIcon />,
  });

  if (whitelistEmails.find((p) => toLower(p.email) === toLower(userProfile.email)) || investTab)
    menus.push({
      to: '/marketplace',
      title: 'Marketplace',
      icon: <StorefrontIcon />,
    });

  if (investTab)
    menus.push({
      to: '/demo',
      title: 'Demo',
      icon: <MonetizationOnRoundedIcon />,
    });

  if (creditTab) {
    menus.push({
      to: '/credit',
      title: 'Credit',
      icon: <CreditCardRoundedIcon />,
    });
  }

  const drawer = (
    <div>
      <List>
        {menus.map(({ to, title, icon }) => (
          <div
            key={`menu-${title}`}
            onClick={mobileOpen ? handleDrawerClose : null}
            className={`sidebar-nav-item ${
              location.pathname === to ? 'sidebar-nav-item-active' : ''
            }`}
          >
            {title !== 'Get Started' ? (
              <ListItem component={Link} to={to} button>
                <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                <ListItemText primary={title} />
              </ListItem>
            ) : (
              <a href={to}>
                <ListItem button>
                  <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                  <ListItemText primary={title} />
                </ListItem>
              </a>
            )}
          </div>
        ))}
      </List>
      {userProfile.admin && (
        <>
          <Divider />
          <List>
            <div
              className={`sidebar-nav-item ${
                location.pathname === '/admin/funds' ? 'sidebar-nav-item-active' : ''
              }`}
            >
              <ListItem component={Link} to="/admin/funds" button>
                <ListItemIcon className={classes.icon}>
                  <AccountBalanceRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Funds Admin" />
              </ListItem>
            </div>
            {/*
            <div
              className={`sidebar-nav-item ${
                location.pathname === '/admin/settings' ? 'sidebar-nav-item-active' : ''
              }`}
            >
              <ListItem component={Link} to="/admin/settings" button>
                <ListItemIcon className={classes.icon}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Investors Admin" />
              </ListItem>
            </div>{' '}
            */}
            <AdminLinks location={location} />
          </List>
        </>
      )}
      <div onClick={mobileOpen ? handleDrawerClose : null} className={`sidebar-nav-item`}>
        <ListItem button onClick={logoutWithRedirect}>
          <ListItemIcon className={classes.icon}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </div>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  const onboarding = location.pathname === '/get-started';

  return (
    <>
      <div className={classes.root}>
        {!onboarding && <CssBaseline />}
        {!onboarding && (
          <>
            {width > phone ? (
              ''
            ) : (
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
            )}
            <div
              className={classes.contentContainer}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                height: '100vh',
              }}
            >
              <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden mdUp implementation="css">
                  <Drawer
                    container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                      paper: classes.drawerPaper,
                    }}
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
                          style={{
                            borderBottom: '1px solid rgb(204, 204, 204)',
                            fontWeight: '500',
                          }}
                        >
                          {userProfile?.name}
                        </MenuItem>
                        {userProfile?.organizations_admin?.length &&
                          [...userProfile.organizations_admin]
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
                    {drawer}
                  </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                  <Drawer
                    classes={{
                      paper: classes.newDrawerPaper,
                    }}
                    variant="permanent"
                    open
                  >
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
                          style={{
                            borderBottom: '1px solid rgb(204, 204, 204)',
                            fontWeight: '500',
                          }}
                        >
                          {userProfile?.name}
                        </MenuItem>
                        {userProfile?.organizations_admin?.length &&
                          [...userProfile.organizations_admin]
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
                    {drawer}
                  </Drawer>
                </Hidden>
              </nav>
            </div>
          </>
        )}
      </div>
    </>
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
        <span style={{ height: '60px', width: '180px', textAlign: 'center', fontSize: '1.5em' }}>
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

function AdminLinks() {
  const match = useRouteMatch('/admin/:organization');

  if (!match) return null;
  const {
    params: { organization },
  } = match;
  if (organization === 'funds') return null;

  return <div className="admin-links" />;
}
