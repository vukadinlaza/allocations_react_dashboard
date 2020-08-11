import React from "react";
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Hidden from "@material-ui/core/Hidden";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useHistory } from "react-router-dom"
import Loader from './utils/Loader'

import {
  NavItem,
  UncontrolledDropdown,
} from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from '@material-ui/icons/MoreVert';

import { useAuth } from '../auth/useAuth'

/***
 *
 * NavBar is the top bar that has the Auth0 profile in it
 *
 **/

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
  },
}));

const NavBar = () => {
  return (
    <LoginOrProfile />
  )
}

function LoginOrProfile() {
  const {
    loading,
    userProfile,
    loginWithRedirect,
    logout,
  } = useAuth();
  const logoutWithRedirect = () => logout({ returnTo: process.env.REACT_APP_URL, });

  if (loading) return <Auth0ProfileLoading />

  if (userProfile.email) {
    return (
      <Auth0Profile
        user={userProfile}
        logoutWithRedirect={logoutWithRedirect}
      />
    )
  }

  // not signed in - show login
  return (
    <NavItem>
      <Button
        id="qsLoginBtn"
        color="primary"
        className="btn-margin"
        onClick={() => loginWithRedirect({})}
      >
        Log in
      </Button>
    </NavItem>
  )
}

export function Auth0ProfileLoading() {
  return (
    <UncontrolledDropdown nav inNavbar>
      <span className="loading-user"></span>
    </UncontrolledDropdown>
  )
}

export function Auth0Profile({ user, logoutWithRedirect }) {
  const [anchorElFunds, setAnchorElFunds] = React.useState(null);
  const [anchorElProfile, setAnchorElProfile] = React.useState(null);
  const { userProfile } = useAuth()
  const { organizations_admin } = userProfile;

  const classes = useStyles();
  const history = useHistory();

  const handleClickFunds = (event) => {
    setAnchorElFunds(event.currentTarget);
  };

  const handleCloseFunds = () => {
    setAnchorElFunds(null);
  };

  const handleClickProfile = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  if (!userProfile.email) return <div><Loader /></div>

  return (
    <div className={classes.root}>
      <ToastContainer />

      {organizations_admin.length >= 1 && <Hidden smDown>
        <Typography variant="subtitle1" style={{ marginRight: 16, color: "#3A506B" }}>
          You are a fund manager
        </Typography>
      </Hidden>}

      <Hidden only="xs">
        <Button color="primary" endIcon={<KeyboardArrowDownIcon />} variant="outlined" aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClickFunds} style={{ marginRight: 16 }}>
          My Funds
        </Button>
      </Hidden>
      <Menu
        id="funds-menu"
        anchorEl={anchorElFunds}
        keepMounted
        open={Boolean(anchorElFunds)}
        onClose={handleCloseFunds}
      >
        {organizations_admin.map(org => {
          return (
            <MenuItem
              onClick={() => {
                history.push(`/admin/${org.slug}`);
                handleCloseFunds();
              }}
              key={org.name}
            >
              {org.name}
            </MenuItem>
          )
        })}
      </Menu>

      <ButtonBase onClick={handleClickProfile}>
        <Hidden only="xs">
          <Avatar src={userProfile.picture} alt="Profile" /> <KeyboardArrowDownIcon />
        </Hidden>
        <Hidden smUp>
          <IconButton>
            <MoreIcon />
          </IconButton>
        </Hidden>
      </ButtonBase>


      <Menu
        id="profile-menu"
        anchorEl={anchorElProfile}
        keepMounted
        open={Boolean(anchorElProfile)}
        onClose={handleCloseProfile}>
        <MenuItem onClick={() => history.push(`/profile`)}>Profile</MenuItem>
        <MenuItem onClick={() => logoutWithRedirect()}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

export default NavBar;
