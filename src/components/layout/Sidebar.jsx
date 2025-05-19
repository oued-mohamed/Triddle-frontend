// frontend/src/components/layout/Sidebar.jsx
import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaWpforms, 
  FaPlus, 
  FaChartBar, 
  FaUserFriends,
  FaCog,
  FaBars
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  // Animation variants for sidebar items
  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: {
      opacity: collapsed ? 0 : 1,
      x: collapsed ? -10 : 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };
  
  // Navigation items
  const navItems = [
    {
      path: '/',
      icon: <FaHome />,
      label: 'Home'
    },
    {
      path: '/dashboard',
      icon: <FaWpforms />,
      label: 'Dashboard'
    },
    {
      path: '/forms',
      icon: <FaWpforms />,
      label: 'My Forms'
    },
    {
      path: '/forms/create',
      icon: <FaPlus />,
      label: 'Create Form'
    },
    {
      path: '/analytics',
      icon: <FaChartBar />,
      label: 'Analytics'
    },
    {
      path: '/responses',
      icon: <FaUserFriends />,
      label: 'Responses'
    },
    {
      path: '/settings',
      icon: <FaCog />,
      label: 'Settings'
    }
  ];
  
  return (
    <div className="sidebar d-flex flex-column h-100">
      <div className="sidebar-header py-3 d-flex justify-content-between align-items-center px-3">
        {!collapsed && <h5 className="mb-0">Navigation</h5>}
        <Button 
          variant="light" 
          size="sm" 
          className="sidebar-toggle"
          onClick={toggleSidebar}
        >
          <FaBars />
        </Button>
      </div>
      
      <Nav className="flex-column flex-grow-1">
        {navItems.map((item) => (
          <Nav.Item key={item.path}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => 
                `nav-link sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <div className="sidebar-icon">{item.icon}</div>
              <motion.span 
                className="sidebar-text"
                initial="open"
                animate={collapsed ? 'closed' : 'open'}
                variants={itemVariants}
              >
                {item.label}
              </motion.span>
            </NavLink>
          </Nav.Item>
        ))}
      </Nav>
      
      <div className="sidebar-footer">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-3"
        >
          {!collapsed && (
            <div className="small text-muted">
              <p className="mb-0">© 2025 Triddle</p>
              <p className="mb-0">Version 1.0.0</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;