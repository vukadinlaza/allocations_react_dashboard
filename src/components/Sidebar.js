import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Col, NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth0 } from "../react-auth0-spa";
import { adminWhitelist } from "../auth/admin-route"

export default function Sidebar () {
  const { user } = useAuth0()
  const location = useLocation()
  const [admin, setAdmin] = useState(false)

  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  const [smallScreen, setSmallScreen] = useState(width < 768)
  const [active, setActive] = useState(width > 768)

  useEffect(() => {
    if (user && adminWhitelist.includes(user.email)) setAdmin(true)
  }, [user])

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
          admin &&
          <div className={`sidebar-nav-item ${location.pathname === "/funds" ? "sidebar-nav-item-active" : ""}`}>
            <Link to="/funds">
              <span>Funds</span>
            </Link>
          </div> 
        }
        {
          admin &&
          <div className={`sidebar-nav-item ${location.pathname === "/investors" ? "sidebar-nav-item-active" : ""}`}>
            <Link to="/investors">
              <span>Investors</span>
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