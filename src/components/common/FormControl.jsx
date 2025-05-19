// frontend/src/components/common/FormControl.jsx
import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';

const FormControl = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  icon,
  helpText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  // Field animation
  const fieldVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  // Error animation
  const errorVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const showError = error && touched;

  return (
    <Form.Group className={`mb-3 custom-form-group ${className}`}>
      {label && (
        <Form.Label htmlFor={id} className="custom-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}

      <motion.div
        variants={fieldVariants}
        initial="blur"
        whileFocus="focus"
        animate="blur"
      >
        {icon ? (
          <InputGroup>
            <InputGroup.Text className="bg-transparent">
              {icon}
            </InputGroup.Text>
            <Form.Control
              id={id}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              isInvalid={showError}
              disabled={disabled}
              className="custom-input"
              {...props}
            />
          </InputGroup>
        ) : (
          <Form.Control
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={showError}
            disabled={disabled}
            className="custom-input"
            {...props}
          />
        )}
      </motion.div>

      {showError && (
        <motion.div
          variants={errorVariants}
          initial="initial"
          animate="animate"
        >
          <Form.Control.Feedback type="invalid" className="d-block">
            {error}
          </Form.Control.Feedback>
        </motion.div>
      )}

      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
    </Form.Group>
  );
};

export default FormControl;