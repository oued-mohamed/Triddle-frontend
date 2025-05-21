// src/components/layout/AuthNavbar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';

const AuthNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Only show the navbar if the user is logged in
  const isAuthenticated = localStorage.getItem('token') !== null;
  if (!isAuthenticated) {
    return null;
  }

  // Don't show navbar on login or register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className="border-bottom shadow-sm mb-4">
      <Container fluid className="d-flex justify-content-between align-items-center py-2">
        {/* Left side - Brand */}
        <div>
          <Link to="/dashboard" className="text-decoration-none">
            <h2 className="mb-0 text-primary fw-bold">Triddle</h2>
          </Link>
        </div>
        
        {/* Right side - Navigation & Logout */}
        <div className="d-flex align-items-center">
          {/* Navigation Links */}
          <Link 
            to="/dashboard" 
            className="text-decoration-none mx-3 fw-medium" 
            style={{ 
              color: location.pathname === '/dashboard' ? '#0d6efd' : '#495057',
              borderBottom: location.pathname === '/dashboard' ? '2px solid #0d6efd' : 'none',
              paddingBottom: '5px'
            }}
          >
            Dashboard
          </Link>
          <Link 
            to="/forms" 
            className="text-decoration-none mx-3 fw-medium" 
            style={{ 
              color: location.pathname.includes('/forms') ? '#0d6efd' : '#495057',
              borderBottom: location.pathname.includes('/forms') ? '2px solid #0d6efd' : 'none',
              paddingBottom: '5px'
            }}
          >
            Forms
          </Link>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            className="btn btn-danger ms-4 d-flex align-items-center"
            style={{ height: '38px' }}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </Container>
    </div>
  );
};

export default AuthNavbar;