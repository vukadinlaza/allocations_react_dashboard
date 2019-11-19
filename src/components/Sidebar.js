import React from 'react';
import { Link } from 'react-router-dom';
import { Col, NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Sidebar () {
  return (
    <Col xs="2" className="position-fixed h-100 Sidebar">
      <div className="brand"> 
        <img src="https://www.allocations.co/assets/img/brand.svg" style={{height:'40px'}} /> 
      </div>
      <div className="sidebar-nav-item">
        <Link to="/"><FontAwesomeIcon icon="feather" /> <span>Home</span></Link>
      </div>
      <div className="sidebar-nav-item">
        <Link to="/investments">
          <FontAwesomeIcon icon="search-dollar" /> <span>Investments</span>
        </Link>
      </div>
      <div className="sidebar-nav-item">
        <Link to="/funds">
          <FontAwesomeIcon icon="folder-plus" /> <span>Funds</span>
        </Link>
      </div>
    </Col>
  )
}