import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useTheme } from '@material-ui/core/styles';
import { Toolbar, AppBar, Drawer, Hidden, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { useAuth } from '../../auth/useAuth';
import SidebarDrawer from './SidebarDrawer';
import styles from './styles';
import OrgDropDown from '../OrgDropDown';

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

function Sidebar(props) {
  const { userProfile, logout, isAuthenticated, loading } = useAuth(GET_INVESTOR);
  const [setInvestTab] = useState(false);
  const [setCreditTab] = useState(false);

  const location = useLocation();
  const { window, classes } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useEffect(() => {
    if (userProfile.showInvestAndMrkPlc || location.pathname === '/invest') {
      setInvestTab(true);
    }
    if (userProfile.showCredit || location.pathname === '/credit') {
      setCreditTab(true);
    }
  }, [
    userProfile.showInvestAndMrkPlc,
    userProfile.showCredit,
    location.pathname,
    userProfile.showBuild,
  ]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  if (!isAuthenticated) return null;
  return (
    <div className={classes.sidebar}>
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
          <div style={{ width: '64px', height: '48px' }} />
        </Toolbar>
      </AppBar>

      <div className={classes.contentContainer}>
        <nav className={classes.drawer} aria-label="mailbox folders">
          <Hidden lgUp implementation="js" className={classes.firstHidden}>
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
              <div className={classes.brand}>
                <Brand
                  organizations_admin={userProfile.organizations_admin || []}
                  admin={userProfile.admin}
                />
              </div>
              <OrgDropDown loading={loading} />

              <SidebarDrawer
                mobileOpen={mobileOpen}
                handleDrawerClose={handleDrawerClose}
                userProfile={userProfile}
                logout={logout}
                location={location}
              />
            </Drawer>
          </Hidden>

          <Hidden mdDown implementation="css" className={classes.secondHidden}>
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
              <OrgDropDown loading={loading} />

              <SidebarDrawer
                mobileOpen={mobileOpen}
                handleDrawerClose={handleDrawerClose}
                userProfile={userProfile}
                logout={logout}
                location={location}
              />
            </Drawer>
          </Hidden>
        </nav>
      </div>
    </div>
  );
}

export default withStyles(styles)(Sidebar);
