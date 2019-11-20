import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import { useAuth0 } from "../react-auth0-spa";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () => logout({ returnTo: window.location.origin });

  return (
    <div className="Navbar nav-container">
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
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const logoutWithRedirect = () => logout({ returnTo: window.location.origin });

  if (isAuthenticated) {
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

export default NavBar;
