// frontend/src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-wrapper">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        toggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="content-area">
        <motion.div 
          className={`sidebar-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}
          initial={{ width: sidebarCollapsed ? '80px' : '250px' }}
          animate={{ width: sidebarCollapsed ? '80px' : '250px' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Sidebar collapsed={sidebarCollapsed} />
        </motion.div>
        
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          <Container fluid className="px-4 py-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </Container>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;