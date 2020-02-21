import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth0 } from "../../react-auth0-spa";
import { adminWhitelist } from "../../auth/admin-route"
import "./style.scss"

export default function Sidebar ({ showSidebar, setShowSidebar }) {
  const { user } = useAuth0()
  const history = useHistory()
  const location = useLocation()
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    if (user && adminWhitelist.includes(user.email)) setAdmin(true)
  }, [user])

  return (
    <Col sm="2" className={`position-fixed h-100 Sidebar ${showSidebar ? "Sidebar-show" : "Sidebar-no-show"}`}> 
      <Brand />
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
      <Footer />
    </Col>
  )
}

const whitelist = ["allocations", "organizations"]
function Brand () {
  const history = useHistory()
  const match = useRouteMatch('/admin/:organization')

  if (match && match.params.organization && !whitelist.includes(match.params.organization)) {
    return (
      <div className="brand" onClick={() => history.push(`/admin/${match.params.organization}`)}> 
        <img height="60px" width="180px" 
          alt={match.params.organization} 
          src={`https://allocations-public.s3.us-east-2.amazonaws.com/organizations/${match.params.organization}.png`} />
      </div>
    )
  }

  return (
    <div className="brand" onClick={() => history.push('/')}>
      <img src="https://www.allocations.co/assets/img/brand.svg" alt="allocations" style={{height:'40px'}} />
      <span className="beta">beta</span>
    </div>
  ) 
}

function Footer () {
  return (
    <div className="Sidebar-footer">
      <Link to="/getting-started">Getting Started</Link>
    </div>
  )
}

function AdminLinks ({ location }) {
  const match = useRouteMatch('/admin/:organization')

  if (!match) return null

  const { params: { organization } } = match

  return (
    <div className="admin-links">
      <div className="sidebar-admin-header">Admin</div>
      <div className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/investors` ? "sidebar-nav-item-active" : ""}`}>
        <Link to={`/admin/${organization}/investors`}>
          <span>Investors</span>
        </Link>
      </div>
      <div className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/deals` ? "sidebar-nav-item-active" : ""}`}>
        <Link to={`/admin/${organization}/deals`}>
          <span>Deals</span>
        </Link>
      </div>
      <div className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/investments` ? "sidebar-nav-item-active" : ""}`}>
        <Link to={`/admin/${organization}/investments`}>
          <span>Investments</span>
        </Link>
      </div>
    </div>
  )
}