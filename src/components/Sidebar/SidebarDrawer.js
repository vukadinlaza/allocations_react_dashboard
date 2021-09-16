import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AccountBalanceRoundedIcon from '@material-ui/icons/AccountBalanceRounded';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import StorefrontIcon from '@material-ui/icons/Storefront';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import CreditCardRoundedIcon from '@material-ui/icons/CreditCardRounded';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import FlightIcon from '@material-ui/icons/Flight';
import { toLower } from 'lodash';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import whitelistEmails from './whiteListEmails';
import './SidebarDrawer.scss';

const SidebarDrawer = ({
  mobileOpen,
  handleDrawerClose,
  investTab,
  creditTab,
  userProfile,
  currentHomeUrl,
  logout,
  location,
}) => {
  const logoutWithRedirect = () => logout({ returnTo: process.env.REACT_APP_URL });
  const AdminLinks = () => {
    const match = useRouteMatch('/admin/:organization');

    if (!match) return null;
    const {
      params: { organization },
    } = match;
    if (organization === 'funds') return null;

    return <div />;
  };
  const history = useHistory();
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(8),
    },
  }));
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [openTwo, setOpenTwo] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickTwo = () => {
    setOpenTwo(!openTwo);
  };
  const menus = [
    {
      to: currentHomeUrl,
      title: 'Dashboard',
      icon: <HomeIcon fontSize="medium" />,
    },
    {
      to: currentHomeUrl,
      title: 'SPVs',
      icon: <FlightIcon fontSize="medium" />,
    },
    {
      to: currentHomeUrl,
      title: 'Funds',
      icon: <AccountBalanceIcon fontSize="medium" />,
    },
    {
      to: currentHomeUrl,
      title: 'Investors',
      icon: <PersonIcon fontSize="medium" />,
    },
  ];
  const menusTwo = [
    {
      to: '/dealdocs',
      title: 'Documents Library',
      icon: <HomeIcon fontSize="medium" />,
    },
    {
      to: '/billing',
      title: 'Billing',
      icon: <FlightIcon fontSize="medium" />,
    },
  ];

  return (
    <div className="SidebarDrawer">
      <Typography className="sectionSideBarTitle">ESSENTIALS</Typography>
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
                <ListItemIcon className="icon">{icon}</ListItemIcon>
                <ListItemText primary={title} className="iconLabel" />
              </ListItem>
            ) : (
              <a href={to}>
                <ListItem button>
                  <ListItemIcon className="icon">{icon}</ListItemIcon>
                  <ListItemText primary={title} className="iconLabel" />
                </ListItem>
              </a>
            )}
          </div>
        ))}
      </List>
      <Typography className="sectionSideBarTitle">TOOLS</Typography>
      <List>
        {menusTwo.map(({ to, title, icon }) => (
          <div
            key={`menu-${title}`}
            onClick={mobileOpen ? handleDrawerClose : null}
            className={`sidebar-nav-item ${
              location.pathname === to ? 'sidebar-nav-item-active' : ''
            }`}
          >
            {title !== 'Get Started' ? (
              <ListItem component={Link} to={to} button>
                <ListItemIcon className="icon">{icon}</ListItemIcon>
                <ListItemText primary={title} className="iconLabel" />
              </ListItem>
            ) : (
              <a href={to}>
                <ListItem button>
                  <ListItemIcon className="icon">{icon}</ListItemIcon>
                  <ListItemText primary={title} className="iconLabel" />
                </ListItem>
              </a>
            )}
          </div>
        ))}
      </List>
      <Typography className="sectionSideBarTitle">UPGRADE</Typography>

      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <FlightIcon />
        </ListItemIcon>
        <ListItemText primary="SPVs" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {['Real Estate', 'Crypto', 'Secondaries'].map((x) => {
            return (
              <Link
                to={{
                  pathname: '/upgrade',
                  state: { type: 'SPV', asset: x },
                }}
              >
                <ListItem button className={classes.nested}>
                  <ListItemText size="small" primary={x} />
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Collapse>
      <ListItem button onClick={handleClickTwo}>
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary="Funds" />
        {openTwo ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openTwo} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {['Quarterly Funds', 'Traditional Funds'].map((x) => {
            return (
              <Link
                to={{
                  pathname: '/upgrade',
                  state: { type: 'FUND', asset: x },
                }}
              >
                <ListItem button className={classes.nested}>
                  <ListItemText size="small" primary={x} />
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Collapse>

      <div onClick={mobileOpen ? handleDrawerClose : null}>
        <ListItem button onClick={logoutWithRedirect}>
          <ListItemIcon className="icon">
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </div>
    </div>
  );
};

export default SidebarDrawer;
