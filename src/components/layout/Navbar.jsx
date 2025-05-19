// components/layout/Navbar.jsx
import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaWpforms, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '../../context/authStore';

const MainNavbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log("Current user:", user); // Debug logging

  return (
    <Navbar bg="light" expand="lg" className="py-2 shadow-sm fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Triddle
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <FaHome className="me-1" /> Home
            </Nav.Link>
            
            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  <FaTachometerAlt className="me-1" /> Dashboard
                </Nav.Link>
                
                <Nav.Link as={Link} to="/forms">
                  <FaWpforms className="me-1" /> Forms
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <div className="d-flex align-items-center">
                <span className="me-3">Hello, {user.name || user.email}</span>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="btn btn-outline-primary me-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;