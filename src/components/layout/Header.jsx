// frontend/src/components/layout/Header.jsx
import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBars, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Header = ({ user, onLogout, toggleSidebar, sidebarCollapsed }) => {
  return (
    <Navbar bg="white" expand="lg" className="header-navbar shadow-sm">
      <Container fluid>
        <button 
          className="sidebar-toggle btn"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FaBars />
        </button>
        
        <Navbar.Brand as={Link} to="/dashboard" className="me-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="brand-logo d-flex align-items-center"
          >
            <span className="brand-text ms-2">Triddle</span>
          </motion.div>
        </Navbar.Brand>
        
        <Nav className="ms-auto">
          {user && (
            <NavDropdown 
              title={
                <div className="user-dropdown-toggle">
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <span className="ms-2 d-none d-md-inline">{user.name}</span>
                </div>
              } 
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile">
                <FaUser className="me-2" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">
                <FaCog className="me-2" />
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;