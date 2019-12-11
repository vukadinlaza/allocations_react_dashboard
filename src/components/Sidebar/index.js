import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Col, NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth0 } from "../../react-auth0-spa";
import { adminWhitelist } from "../../auth/admin-route"
import "./style.scss"

export default function Sidebar ({ showSidebar, setShowSidebar }) {
  const { user } = useAuth0()
  const location = useLocation()
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    if (user && adminWhitelist.includes(user.email)) setAdmin(true)
  }, [user])

  return (
    <Col sm="2" className={`position-fixed h-100 Sidebar ${showSidebar ? "Sidebar-show" : "Sidebar-no-show"}`}>
      <div className="brand"> 
        <img src="https://www.allocations.co/assets/img/brand.svg" style={{height:'40px'}} />
        <span className="beta">beta</span>
      </div>
      <div className="toggle-wrapper">
        <FontAwesomeIcon icon="times" className="toggle" onClick={() => setShowSidebar(false)} />
      </div>
      <div className={`sidebar-nav-item ${location.pathname === "/" ? "sidebar-nav-item-active" : ""}`}>
        <Link to="/"><span>Home</span></Link>
      </div>
      <div className={`sidebar-nav-item ${location.pathname === "/investments" ? "sidebar-nav-item-active" : ""}`}>
        <Link to="/investments">
          <span>Investments</span>
        </Link>
      </div>
      <div className={`sidebar-nav-item ${location.pathname === "/invited-deals" ? "sidebar-nav-item-active" : ""}`}>
        <Link to="/invited-deals">
          <span>Deals</span>
        </Link>
      </div>
      <div className={`sidebar-nav-item ${location.pathname === "/profile" ? "sidebar-nav-item-active" : ""}`}>
        <Link to="/profile">
          <span>Profile</span>
        </Link>
      </div>
      {admin && <AdminLinks location={location} />}
    </Col>
  )
}

function AdminLinks ({ location }) {
  return (
    <div className="admin-links">
      <div className="sidebar-admin-header">Admin</div>
      <div className={`sidebar-nav-item ${location.pathname === "/funds" ? "sidebar-nav-item-active" : ""}`}>
        <Link to="/funds">
          <span>All Funds</span>
        </Link>
      </div>
      <div className={`sidebar-nav-item ${location.pathname === "/investors" ? "sidebar-nav-item-active" : ""}`}>
        <Link to="/investors">
          <span>All Investors</span>
        </Link>
      </div>
      <div className={`sidebar-nav-item ${location.pathname === "/deals" ? "sidebar-nav-item-active" : ""}`}>
        <Link to="/deals">
          <span>All Deals</span>
        </Link>
      </div>
      <div className={`sidebar-nav-item ${location.pathname === "/admin/investments" ? "sidebar-nav-item-active" : ""}`}>
        <Link to="/admin/investments">
          <span>All Investments</span>
        </Link>
      </div>
    </div>
  )
}