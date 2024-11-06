// src/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png'; 
import './styles/styles.css';

const Layout = ({ children, navLinks }) => {
  return (
    <div>
      <header>
        <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="FitTrack Logo" className="logo-image" />
            <span>RunToEarn</span>
          </div>
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link to={link.path} className="nav-item" key={link.path}>
                {link.label}
              </Link>
            ))}
            <button className="learn-more-btn">Learn more</button>
          </div>
        </nav>
      </header>
      <main>{children}</main> 
    </div>
  );
};

export default Layout;
