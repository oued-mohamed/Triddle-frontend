// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Get user name from localStorage or use default
  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name || 'med' : 'med';

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
          
          {/* User greeting */}
          <span className="mx-3">Hello, {userName}</span>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            className="btn btn-danger ms-2 d-flex align-items-center"
            style={{ height: '38px' }}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;