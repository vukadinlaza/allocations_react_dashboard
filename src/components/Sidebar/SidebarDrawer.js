import React, { useState } from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import { FaRocket, FaPercentage } from 'react-icons/fa';
import { BsArrowLeftRight } from 'react-icons/bs';
import { RiBillLine } from 'react-icons/ri';
import BuildModal from '../NewBuild/BuildModal';

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

  const [open, setOpen] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [openThree, setOpenThree] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickTwo = () => {
    setOpenTwo(!openTwo);
  };
  const handleClickThree = () => {
    setOpenThree(!openThree);
  };
  const menus = [
    {
      to: currentHomeUrl,
      title: 'Dashboard',
      icon: <HomeIcon fontSize="medium" />,
    },
    {
      to: '/spvs',
      title: 'SPVs',
      icon: <FaRocket style={{ margin: '0 .5rem 0 0' }} />,
    },
    {
      to: '/funds',
      title: 'Funds',
      icon: <AccountBalanceIcon fontSize="medium" />,
    },
    {
      to: '/admin/allocations/investors',
      title: 'Investors',
      icon: <PersonIcon fontSize="medium" />,
    },
  ];
  const menusTwo = [
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
  ];

  return (
    <div className="SidebarDrawer">
      <BuildModal isOpen={openModal} onClose={() => setOpenModal(false)} />

      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        style={{
          borderRadious: '.75rem',
          width: '80%',
          margin: '.5rem 1rem',
          backgroundColor: '#186EFF',
          color: 'white',
        }}
      >
        <FontAwesomeIcon icon="plus" style={{ margin: '0 .5rem 0 0' }} />
        Add
      </Button>

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
      <ListItem button onClick={handleClickThree}>
        <ListItemIcon>
          <StarBorder fontSize="medium" />
        </ListItemIcon>
        <ListItemText primary="Demo" />
        {openThree ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openThree} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {[
            { title: 'Invest', link: '/deals/305-ventures' },
            { title: 'Fund Manager', link: '/admin/demo-fund' },
          ].map((x) => {
            return (
              <Link
                to={{
                  pathname: x.link,
                }}
              >
                <ListItem button className={classes.nested}>
                  <ListItemText size="small" primary={x.title} />
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Collapse>
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
          <FaRocket style={{ margin: '0 .5rem 0 0' }} />
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
