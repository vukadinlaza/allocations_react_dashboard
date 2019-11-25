import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Col, NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth0 } from "../react-auth0-spa";

export default function Sidebar () {
  const { user } = useAuth0()
  const location = useLocation()

  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  const [smallScreen, setSmallScreen] = useState(width < 768)
  const [active, setActive] = useState(width > 768)

  if (active) {
    return (
      <Col sm="2" className="position-fixed h-100 Sidebar">
        <div className="brand"> 
          <img src="https://www.allocations.co/assets/img/brand.svg" style={{height:'40px'}} /> 
        </div>
        <div className={`sidebar-nav-item ${location.pathname === "/" ? "sidebar-nav-item-active" : ""}`}>
          <Link to="/"><span>Home</span></Link>
        </div>
        <div className={`sidebar-nav-item ${location.pathname === "/investments" ? "sidebar-nav-item-active" : ""}`}>
          <Link to="/investments">
            <span>Investments</span>
          </Link>
        </div>
        {
          false &&
          <div className={`sidebar-nav-item ${location.pathname === "/funds" ? "sidebar-nav-item-active" : ""}`}>
            <Link to="/funds">
              <span>Funds</span>
            </Link>
          </div> 
        }
      </Col>
    )
  } else {
    return (
      <Col xs="12" className="Sidebar">
        <div className="brand brand-small-screen"> 
          <img src="https://www.allocations.co/assets/img/brand.svg" style={{height:'40px'}} />
          <FontAwesomeIcon icon="bars" size="2x" className="toggle-sidebar" />
        </div>
      </Col>
    )
  }
}