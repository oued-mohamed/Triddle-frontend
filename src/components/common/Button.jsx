// frontend/src/components/common/Button.jsx
import React from 'react';
import { Button as BootstrapButton, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size, 
  loading = false, 
  icon, 
  className = '', 
  type = 'button',
  onClick,
  disabled,
  ...props 
}) => {
  return (
    <motion.div 
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    >
      <BootstrapButton
        variant={variant}
        size={size}
        className={`custom-button ${className}`}
        disabled={disabled || loading}
        type={type}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="button-icon me-2">{icon}</span>}
            {children}
          </>
        )}
      </BootstrapButton>
    </motion.div>
  );
};

export default Button;