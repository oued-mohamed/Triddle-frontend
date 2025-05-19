// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaUser, FaEnvelope, FaLock, FaCheck } from 'react-icons/fa';
import { useAuthStore } from '../context/AuthStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation errors when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = formData;
        await register(userData);
        navigate('/dashboard');
      } catch (error) {
        setErrors({
          ...errors,
          general: error.message || 'Registration failed. Please try again.'
        });
      }
    }
  };

  // Custom inline styles to match the design
  const styles = {
    leftPanel: {
      background: 'linear-gradient(145deg, #f8f9fa 30%, #e9ecef 100%)',
      padding: '5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%'
    },
    numberBadge: {
      backgroundColor: '#4361ee',
      color: 'white',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
      marginBottom: '2rem',
      position: 'relative',
      fontWeight: 'bold'
    },
    numberLine: {
      position: 'absolute',
      bottom: '-5px',
      left: '0',
      height: '5px',
      width: '40px',
      backgroundColor: '#4361ee',
      borderRadius: '10px'
    },
    headerTitle: {
      fontSize: '3rem',
      fontWeight: '700',
      color: '#212529',
      lineHeight: '1.2'
    },
    headerSubtitle: {
      fontSize: '4.5rem',
      display: 'block',
      marginTop: '0.5rem',
      fontWeight: '700'
    },
    tagline: {
      fontSize: '1.8rem',
      color: '#495057',
      fontWeight: '400',
      marginTop: '3rem'
    },
    highlight: {
      color: '#4361ee',
      fontWeight: '500'
    },
    rightPanel: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    formContainer: {
      maxWidth: '500px',
      width: '100%',
      padding: '2rem'
    },
    greeting: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#212529',
      marginBottom: '0.5rem'
    },
    welcomeText: {
      fontSize: '1.1rem',
      color: '#6c757d',
      marginBottom: '2rem'
    },
    input: {
      padding: '1rem',
      fontSize: '1.1rem',
      borderRadius: '12px'
    },
    signUpBtn: {
      padding: '0.75rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '12px',
      backgroundColor: '#4361ee',
      border: 'none'
    },
    socialButton: {
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconContainer: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6c757d',
      zIndex: 10
    },
    eyeIcon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      background: 'transparent',
      border: 'none',
      color: '#6c757d'
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0 min-vh-100">
        {/* Left side - Design content */}
        <Col lg={6} className="d-none d-lg-block" style={styles.leftPanel}>
          <div style={styles.numberBadge}>
            50
            <div style={styles.numberLine}></div>
          </div>
          <h1 style={styles.headerTitle}>
            Register Design
            <span style={styles.headerSubtitle}>Examples</span>
          </h1>
          <p style={styles.tagline}>
            that Mix <span style={styles.highlight}>Creativity</span> with <span style={styles.highlight}>Convenience</span>
          </p>
        </Col>
        
        {/* Right side - Register form */}
        <Col lg={6} style={styles.rightPanel}>
          <div style={styles.formContainer}>
            <div className="text-center mb-4">
              <h2 style={styles.greeting}>Create Account</h2>
              <p style={styles.welcomeText}>Join Triddle to create amazing forms</p>
            </div>
            
            {errors.general && (
              <Alert variant="danger" className="mb-4">
                {errors.general}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              {/* Name Field */}
              <Form.Group className="mb-4 position-relative">
                <div style={styles.iconContainer}>
                  <FaUser />
                </div>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  style={{...styles.input, paddingLeft: '2.5rem'}}
                  isInvalid={!!errors.name}
                  className="bg-light"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Email Field */}
              <Form.Group className="mb-4 position-relative">
                <div style={styles.iconContainer}>
                  <FaEnvelope />
                </div>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  style={{...styles.input, paddingLeft: '2.5rem'}}
                  isInvalid={!!errors.email}
                  className="bg-light"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Password Field */}
              <Form.Group className="mb-4 position-relative">
                <div style={styles.iconContainer}>
                  <FaLock />
                </div>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  style={{...styles.input, paddingLeft: '2.5rem'}}
                  isInvalid={!!errors.password}
                  className="bg-light"
                />
                <Button 
                  style={styles.eyeIcon}
                  onClick={() => togglePasswordVisibility('password')}
                  className="bg-transparent border-0"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
                <Form.Text className="text-muted ms-1">
                  Password must be at least 6 characters
                </Form.Text>
              </Form.Group>
              
              {/* Confirm Password Field */}
              <Form.Group className="mb-4 position-relative">
                <div style={styles.iconContainer}>
                  <FaCheck />
                </div>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  style={{...styles.input, paddingLeft: '2.5rem'}}
                  isInvalid={!!errors.confirmPassword}
                  className="bg-light"
                />
                <Button 
                  style={styles.eyeIcon}
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="bg-transparent border-0"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Terms and Conditions */}
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="terms"
                  label={
                    <span>
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-primary">Privacy Policy</Link>
                    </span>
                  }
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  isInvalid={!!errors.terms}
                  feedback={errors.terms}
                  feedbackType="invalid"
                />
              </Form.Group>
              
              {/* Sign Up Button */}
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-3 my-3"
                style={styles.signUpBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              {/* Social Login Options */}
              <div className="text-center mt-4 mb-4">
                <p className="text-muted">or sign up with</p>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="light" style={styles.socialButton} className="border">
                    <FaFacebookF />
                  </Button>
                  <Button variant="light" style={styles.socialButton} className="border">
                    <FaGoogle />
                  </Button>
                </div>
              </div>
              
              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="text-primary fw-bold">Sign In</Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;