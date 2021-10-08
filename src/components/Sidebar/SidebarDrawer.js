import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link, useRouteMatch } from 'react-router-dom';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { FaRocket, FaPercentage } from 'react-icons/fa';
import { BsArrowLeftRight } from 'react-icons/bs';
import { RiBillLine } from 'react-icons/ri';
import { AiOutlineStar } from 'react-icons/ai';
import BuildModal from '../NewBuild/BuildModal';
import styles from './styles.js';

const SidebarDrawer = ({
  mobileOpen,
  handleDrawerClose,
  currentHomeUrl,
  logout,
  location,
  classes,
}) => {
  const [openSubMenu, setOpenSubMenu] = useState([]);
  const [openModal, setOpenModal] = useState(false);

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

  const handleOpenSubMenu = (id) => {
    const openSubMenuCopy = openSubMenu.map((i) => i);
    const idIndex = openSubMenuCopy.indexOf(id);
    if (idIndex >= 0) {
      openSubMenuCopy.splice(idIndex, 1);
    } else {
      openSubMenuCopy.push(id);
    }
    setOpenSubMenu(openSubMenuCopy);
  };

  const menuSections = [
    {
      sectionTitle: 'ESSENTIALS',
      menu: [
        {
          to: currentHomeUrl,
          title: 'Dashboard',
          icon: <HomeIcon fontSize="medium" />,
        },
        {
          to: '/admin/type/spvs',
          title: 'SPVs',
          icon: <FaRocket style={{ margin: '0 .5rem 0 0' }} />,
        },
        {
          to: '/admin/type/funds',
          title: 'Funds',
          icon: <AccountBalanceIcon fontSize="medium" />,
        },
        // need to change route to '/admin/investors', but that breaks. need to push temp fix.
        {
          to: '/investors',
          title: 'Investors',
          icon: <PersonIcon fontSize="medium" />,
        },
      ],
    },
    {
      sectionTitle: 'TOOLS',
      menu: [
        {
          to: '/admin/funds',
          title: 'Demo',
          icon: <AiOutlineStar fontSize="medium" />,
          subMenu: [
            {
              to: '/#',
              title: 'Invest',
              icon: '',
            },
            {
              to: '/#',
              title: 'Fund Manager',
              icon: '',
            },
          ],
        },
        {
          to: '/billing',
          title: 'Billing',
          icon: <RiBillLine fontSize="medium" />,
        },
        {
          to: '/wire-activity',
          title: 'Wire Activity',
          icon: <BsArrowLeftRight fontSize="medium" />,
        },
        {
          to: '/tax-activity',
          title: 'Tax Activity',
          icon: <FaPercentage fontSize="medium" />,
        },
      ],
    },
    {
      sectionTitle: 'UPGRADE',
      menu: [
        {
          to: '',
          title: 'SPVs',
          icon: <FaRocket style={{ margin: '0 .5rem 0 0' }} />,
          subMenu: [
            {
              to: '/upgrade',
              title: 'Real Estate',
              icon: '',
              state: { type: 'SPV', asset: 'Real Estate' },
            },
            {
              to: '/upgrade',
              title: 'Crypto',
              icon: '',
              state: { type: 'SPV', asset: 'Crypto' },
            },
            {
              to: '/upgrade',
              title: 'Secondaries',
              icon: '',
              state: { type: 'SPV', asset: 'Secondaries' },
            },
          ],
        },
        {
          to: '',
          title: 'Funds',
          icon: <AccountBalanceIcon fontSize="medium" />,
          subMenu: [
            {
              to: '/upgrade',
              title: 'Quarterly Funds',
              icon: '',
              state: { type: 'FUND', asset: 'Quarterly Funds' },
            },
            {
              to: '/upgrade',
              title: 'Traditional Funds',
              icon: '',
              state: { type: 'FUND', asset: 'Traditional Funds' },
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className={classes.sidebarDrawer}>
      <BuildModal isOpen={openModal} onClose={() => setOpenModal(false)} />

      <Button variant="contained" onClick={() => setOpenModal(true)} className={classes.addButton}>
        <FontAwesomeIcon icon="plus" style={{ margin: '0 .5rem 0 0' }} />
        Add
      </Button>

      <List>
        {menuSections.map(({ sectionTitle, menu }) => (
          <>
            <Typography className={classes.sectionSideBarTitle}>{sectionTitle}</Typography>
            {menu.map(({ to, title, icon, subMenu }, menuId) => (
              <div
                key={`menu-${title}`}
                onClick={mobileOpen ? handleDrawerClose : null}
                className={`${!subMenu ? classes.sidebarNavItem : ''} ${
                  location.pathname === to ? classes.sidebarNavItemActive : ''
                }`}
              >
                {!subMenu ? (
                  <a href={to}>
                    <ListItem button className={classes.menuItem}>
                      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                      <ListItemText primary={title} className={classes.iconLabel} />
                    </ListItem>
                  </a>
                ) : (
                  <>
                    <ListItem
                      button
                      onClick={() => handleOpenSubMenu(menuId)}
                      className={classes.menuItem}
                    >
                      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                      <ListItemText primary={title} className={classes.iconLabel} />
                      {openSubMenu.includes(menuId) ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openSubMenu.includes(menuId)} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {subMenu.map((subMenuItem) => {
                          return (
                            <div className={classes.sidebarNavItem}>
                              <Link to={subMenuItem.to}>
                                <ListItem button className={classes.nested}>
                                  <ListItemText size="small" primary={subMenuItem.title} />
                                </ListItem>
                              </Link>
                            </div>
                          );
                        })}
                      </List>
                    </Collapse>
                  </>
                )}
              </div>
            ))}
          </>
        ))}
      </List>
      <div onClick={mobileOpen ? handleDrawerClose : null} className={classes.sidebarNavItem}>
        <ListItem button onClick={logoutWithRedirect} className={classes.menuItem}>
          <ListItemIcon className={classes.icon}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </div>
    </div>
  );
};

export default withStyles(styles)(SidebarDrawer);
