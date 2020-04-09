import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth0 } from "../../react-auth0-spa";
import { adminWhitelist } from "../../auth/admin-route"
import classNames from 'classnames'
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
      {admin && <div className={`sidebar-nav-item ${location.pathname === "/admin/funds" ? "sidebar-nav-item-active" : ""}`}>
        <Link to="/admin/funds">
          <span>Funds</span>
        </Link>
      </div>}
      {admin && <AdminLinks location={location} />}
      <Footer />
    </Col>
  )
}

const whitelist = ["allocations", "organizations", "funds"]
function Brand () {
  const history = useHistory()
  const match = useRouteMatch('/admin/:organization')
  const dealMatch = useRouteMatch('/deals/:organization/:id')

  const adminMatches = match && match.params.organization && !whitelist.includes(match.params.organization)
  const dealMatches = dealMatch && dealMatch.params.organization && !whitelist.includes(dealMatch.params.organization)
  if (adminMatches || dealMatches) {
    const slug = adminMatches ? match.params.organization : dealMatch.params.organization
    return <OrgLogo slug={slug} />
  }

  return (
    <div className="brand" onClick={() => history.push('/')}>
      <img src="https://allocations-public.s3.us-east-2.amazonaws.com/logo.png" alt="allocations" style={{height: "70px", width: "210px"}} />
    </div>
  ) 
}

function deSlugify(slug) {
  try {
    return slug.split('-').map(str => `${str[0].toUpperCase()}${str.slice(1)}`).join(' ')
  } catch (e) {
    return slug
  }
}

function OrgLogo ({ slug }) {
  const history = useHistory()
  const [img, setImg] = useState(`https://allocations-public.s3.us-east-2.amazonaws.com/organizations/${slug}.png`)

  if (!img) {
    return (
      <div className="brand" onClick={() => history.push(`/admin/${slug}`)}> 
        <span style={{height: "60px", width: "180px", textAlign: "center", fontSize: "1.5em"}}>
          <b>{deSlugify(slug)}</b>
        </span>
      </div>
    )
  }

  return (
    <div className="brand" onClick={() => history.push(`/admin/${slug}`)}> 
      <img height="60px" width="180px"
        alt={slug}
        onError={() => setImg(null)} 
        src={img} />
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
  const [showAdministration, setShowAdministration] = useState(false)

  if (!match) return null
  const { params: { organization } } = match
  if (organization === "funds") return null

  return (
    <div className="admin-links">
      <div className="sidebar-admin-header">Admin</div>
      {organization === "allocations" && <div className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/investors` ? "sidebar-nav-item-active" : ""}`}>
        <Link to={`/admin/${organization}/investors`}>
          <span>Investors</span>
        </Link>
      </div>}
      <div className={classNames('sidebar-nav-item', {"sidebar-nav-item-active": showAdministration})}
        onClick={() => setShowAdministration(true)}>
        <span>Administration</span>
      </div>
      {showAdministration && <div className={classNames("sidebar-nav-item", {"sidebar-nav-item-active": location.pathname === `/admin/${organization}/master-filing`})}>
        <Link to={`/admin/${organization}/master-filing`}>
          <span>Master Filing</span>
        </Link>
      </div>}
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