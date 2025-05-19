// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle } from 'react-icons/fa';
import { useAuthStore } from '../context/authStore';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await login(credentials);
        navigate('/dashboard');
      } catch (error) {
        setErrors({
          ...errors,
          general: error.message || 'Failed to login. Please check your credentials.'
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
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    formContainer: {
      maxWidth: '450px',
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
    signInBtn: {
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
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0 vh-100">
        {/* Left side - Design content */}
        <Col lg={6} className="d-none d-lg-block" style={styles.leftPanel}>
          <div style={styles.numberBadge}>
            50
            <div style={styles.numberLine}></div>
          </div>
          <h1 style={styles.headerTitle}>
            Login Design
            <span style={styles.headerSubtitle}>Examples</span>
          </h1>
          <p style={styles.tagline}>
            that Mix <span style={styles.highlight}>Creativity</span> with <span style={styles.highlight}>Convenience</span>
          </p>
        </Col>
        
        {/* Right side - Login form */}
        <Col lg={6} style={styles.rightPanel}>
          <div style={styles.formContainer}>
            <div className="text-center mb-4">
              <h2 style={styles.greeting}>Hello!</h2>
              <p style={styles.welcomeText}>We are really happy to see you again!</p>
            </div>
            
            {errors.general && (
              <Alert variant="danger" className="mb-4">
                {errors.general}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Control
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Username"
                  style={styles.input}
                  isInvalid={!!errors.email}
                  className="bg-light"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Password"
                    style={styles.input}
                    isInvalid={!!errors.password}
                    className="bg-light"
                  />
                  <Button 
                    variant="link" 
                    onClick={togglePasswordVisibility}
                    className="position-absolute end-0 z-10 bg-transparent border-0 text-secondary"
                    style={{ top: '50%', transform: 'translateY(-50%)', right: '10px' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-3 my-3"
                style={styles.signInBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              
              <div className="text-center mt-4 mb-4">
                <p className="text-muted">or sign in with</p>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="light" style={styles.socialButton} className="border">
                    <FaFacebookF />
                  </Button>
                  <Button variant="light" style={styles.socialButton} className="border">
                    <FaGoogle />
                  </Button>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account? <Link to="/register" className="text-primary fw-bold">Register</Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;