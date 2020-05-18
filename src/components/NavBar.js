import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Collapse,
  Container,
  Navbar,
  Nav,
  NavItem,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

/***
 *
 * NavBar is the top bar that has the Auth0 profile in it
 *
 **/

import { useAuth0 } from "../react-auth0-spa";

const NavBar = () => {
  return (
    <div className="Navbar nav-container hidden-sm-down">
      <Navbar expand="md">
        <Container>
          <Collapse isOpen={false} navbar>
            <Nav navbar>
              <LoginOrProfile />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

function LoginOrProfile () {
  const { loading, user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const logoutWithRedirect = () => logout({ returnTo: process.env.REACT_APP_URL, });

  if (loading) return <Auth0ProfileLoading /> 

  if (isAuthenticated) return <Auth0Profile user={user} logoutWithRedirect={logoutWithRedirect} />

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

export function Auth0ProfileLoading () {
  return (
    <UncontrolledDropdown nav inNavbar>
      <span className="loading-user"></span>
    </UncontrolledDropdown>
  )
}

export function Auth0Profile ({ user, logoutWithRedirect }) {
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret id="profileDropDown" className="profile-actions-toggle">
        <img
          src={user.picture}
          alt="Profile"
          className="nav-user-profile rounded-circle"
          width="50"
        />
      </DropdownToggle>
      <DropdownMenu right className="profile-image">
        <DropdownItem header>{user.name}</DropdownItem>
        <DropdownItem
          tag={RouterNavLink}
          to="/profile"
          className="dropdown-profile"
          activeClassName="router-link-exact-active"
        >
          <FontAwesomeIcon icon="user" className="mr-3" /> Profile
        </DropdownItem>
        <DropdownItem
          id="qsLogoutBtn"
          onClick={() => logoutWithRedirect()}
        >
          <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
          out
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NavBar;
