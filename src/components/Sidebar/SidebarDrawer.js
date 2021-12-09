import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HomeIcon from '@material-ui/icons/Home';
import { withLDProvider, useFlags } from 'launchdarkly-react-client-sdk';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link, useRouteMatch } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { FaRocket } from 'react-icons/fa';
import { BsBinocularsFill } from 'react-icons/bs';
import styles from './styles';
import NewBuildModal from '../NewBuild/NewBuildModal';
import { useAuth } from '../../auth/useAuth';

const AddBubbleBuildButton = ({ classes }) => (
  <Button
    variant="contained"
    className={classes.addButton}
    target="_blank"
    href="https://build.allocations.com"
  >
    <FontAwesomeIcon icon="plus" style={{ margin: '0 .5rem 0 0' }} />
    Add
  </Button>
);

const AddInAppBuildButton = ({ classes, setOpenModal, setNewBuildModalPage }) => {
  return (
    <Button
      variant="contained"
      className={classes.addButton}
      onClick={() => {
        if (localStorage.getItem('buildData') || localStorage.getItem('buildDeal')) {
          setNewBuildModalPage('new_or_current');
        }
        setOpenModal(true);
      }}
    >
      <FontAwesomeIcon icon="plus" style={{ margin: '0 .5rem 0 0' }} />
      Add
    </Button>
  );
};

const AddBuildButton = (props) => {
  const { useInAppBuild } = useFlags();
  if (useInAppBuild) return <AddInAppBuildButton {...props} />;
  return <AddBubbleBuildButton {...props} />;
};

const AddBuildWithLD = (props) => {
  const { isAuthenticated, loading, userProfile } = useAuth();
  const launchDarklyUser = { key: userProfile?._id, email: userProfile?.email };

  const FlagComponent = withLDProvider({
    clientSideID: process.env.REACT_APP_LAUNCH_DARKLY_ID,
    user: isAuthenticated && !loading ? launchDarklyUser : undefined,
  })(AddBuildButton);
  return <FlagComponent {...props} />;
};

const SidebarDrawer = ({
  mobileOpen,
  handleDrawerClose,
  currentOrganization,
  currentHomeUrl,
  logout,
  location,
  classes,
  userProfile,
  refetchUserProfile,
}) => {
  const [openSubMenu, setOpenSubMenu] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newBuildModalPage, setNewBuildModalPage] = useState('deal_type_selector');

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

  const prospectAccess = ['wes@allocations.com', 'drew.radcliff@allocations.com'];

  const menuSections = [
    {
      sectionTitle: 'ESSENTIALS',
      menu: prospectAccess.includes(userProfile.email)
        ? [
            {
              to: currentHomeUrl,
              title: 'Dashboard',
              icon: <HomeIcon fontSize="medium" />,
            },
            {
              to: '/profile',
              title: 'Profile',
              icon: <PersonIcon fontSize="medium" />,
            },
            {
              to: '/prospects',
              title: 'Prospects',
              icon: <BsBinocularsFill />,
            },
          ]
        : [
            {
              to: currentHomeUrl,
              title: 'Dashboard',
              icon: <HomeIcon fontSize="medium" />,
            },
            {
              to: '/profile',
              title: 'Profile',
              icon: <PersonIcon fontSize="medium" />,
            },
          ],
    },
  ];

  if (currentOrganization) {
    menuSections[0].menu.push({
      to: `/organizations/${currentOrganization.slug}/deals`,
      title: 'SPVs',
      icon: <FaRocket style={{ margin: '0 .5rem 0 0' }} />,
    });
  }

  return (
    <div className={classes.sidebarDrawer}>
      <NewBuildModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        page={newBuildModalPage}
        setPage={setNewBuildModalPage}
        refetchUserProfile={refetchUserProfile}
      />
      <AddBuildWithLD
        classes={classes}
        setOpenModal={setOpenModal}
        setNewBuildModalPage={setNewBuildModalPage}
      />
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
                  <Link to={to}>
                    <ListItem button className={classes.menuItem}>
                      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                      <ListItemText primary={title} className={classes.iconLabel} />
                    </ListItem>
                  </Link>
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
