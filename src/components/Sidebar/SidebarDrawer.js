import React from 'react';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import AccountBalanceRoundedIcon from '@material-ui/icons/AccountBalanceRounded';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import StorefrontIcon from '@material-ui/icons/Storefront';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import CreditCardRoundedIcon from '@material-ui/icons/CreditCardRounded';
import { Link, useRouteMatch } from 'react-router-dom';
import { toLower } from 'lodash';
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

  return (
    <div className="SidebarDrawer">
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
                <ListItemText primary={title} />
              </ListItem>
            ) : (
              <a href={to}>
                <ListItem button>
                  <ListItemIcon className="icon">{icon}</ListItemIcon>
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
                <ListItemIcon className="icon">
                  <AccountBalanceRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Funds Admin" />
              </ListItem>
            </div>
            <AdminLinks location={location} />
          </List>
        </>
      )}
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
