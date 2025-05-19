// frontend/src/components/common/Card.jsx
import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  className = '', 
  hoverable = false,
  onClick,
  ...props 
}) => {
  // Animation variants
  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      transition: { duration: 0.3 }
    },
    tap: {
      y: 0,
      boxShadow: '0 5px 10px rgba(0,0,0,0.05)',
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={hoverable ? 'hover' : undefined}
      whileTap={hoverable && onClick ? 'tap' : undefined}
      className={`custom-card-wrapper ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <BootstrapCard className="custom-card border-0 h-100" {...props}>
        {(title || subtitle) && (
          <BootstrapCard.Header className="bg-transparent border-bottom-0">
            {icon && <div className="card-icon me-2">{icon}</div>}
            {title && <BootstrapCard.Title>{title}</BootstrapCard.Title>}
            {subtitle && (
              <BootstrapCard.Subtitle className="text-muted">
                {subtitle}
              </BootstrapCard.Subtitle>
            )}
          </BootstrapCard.Header>
        )}
        <BootstrapCard.Body>
          {children}
        </BootstrapCard.Body>
      </BootstrapCard>
    </motion.div>
  );
};

export default Card;