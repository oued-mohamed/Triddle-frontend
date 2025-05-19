// frontend/src/components/common/ConnectionTest.jsx
import React, { useState, useCallback } from 'react';
import { Button, Alert, Card, Spinner } from 'react-bootstrap';
import api from '../../services/api';

/**
 * ConnectionTest - A component for testing backend connectivity
 * 
 * This component provides a convenient way to test if your frontend can
 * successfully connect to your backend API. It includes tests for both
 * the health endpoint and auth endpoints.
 */
const ConnectionTest = () => {
  const [state, setState] = useState({
    status: null, // 'success', 'error', 'loading', or null
    message: '',
    details: null,
    testType: null // 'health' or 'auth'
  });

  // Get the API URL from environment or default
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Test health endpoint
  const testHealthEndpoint = useCallback(async () => {
    setState({
      status: 'loading',
      message: 'Testing connection to health endpoint...',
      details: null,
      testType: 'health'
    });

    try {
      const response = await fetch(`${apiUrl}/health`);
      const data = await response.json();

      if (response.ok) {
        setState({
          status: 'success',
          message: '✅ Connection successful! Backend is healthy.',
          details: data,
          testType: 'health'
        });
      } else {
        setState({
          status: 'error',
          message: `❌ Health endpoint returned status: ${response.status}`,
          details: data,
          testType: 'health'
        });
      }
    } catch (error) {
      setState({
        status: 'error',
        message: `❌ Connection failed: ${error.message}`,
        details: { error: error.message },
        testType: 'health'
      });
    }
  }, [apiUrl]);

  // Test auth endpoint
  const testAuthEndpoint = useCallback(async () => {
    setState({
      status: 'loading',
      message: 'Testing connection to auth endpoint...',
      details: null,
      testType: 'auth'
    });

    try {
      // Test the /auth/me endpoint - should return 401 if not authenticated
      await api.get('/auth/me');
      
      // This should not happen without auth
      setState({
        status: 'warning',
        message: '⚠️ Auth endpoint accessible without token! This may indicate an issue.',
        details: { warning: "Auth endpoint did not require authentication" },
        testType: 'auth'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // This is expected - auth endpoint requires authentication
        setState({
          status: 'success',
          message: '✅ Auth endpoint working properly (received expected 401 unauthorized).',
          details: { status: 401 },
          testType: 'auth'
        });
      } else {
        // Any other error is a problem
        setState({
          status: 'error',
          message: `❌ Auth endpoint test failed: ${error.message}`,
          details: error.response?.data || { error: error.message },
          testType: 'auth'
        });
      }
    }
  }, []);

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Body>
        <Card.Title>Backend Connection Test</Card.Title>
        <Card.Text className="text-muted">
          Use these tests to verify your frontend can connect to your backend API.
        </Card.Text>
        
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Button 
            variant="primary" 
            onClick={testHealthEndpoint}
            disabled={state.status === 'loading'}
            className="px-4"
          >
            {state.status === 'loading' && state.testType === 'health' ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Testing...
              </>
            ) : (
              'Test Health Endpoint'
            )}
          </Button>
          
          <Button 
            variant="outline-primary" 
            onClick={testAuthEndpoint}
            disabled={state.status === 'loading'}
            className="px-4"
          >
            {state.status === 'loading' && state.testType === 'auth' ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Testing...
              </>
            ) : (
              'Test Auth Endpoint'
            )}
          </Button>
        </div>
        
        {state.message && (
          <Alert 
            variant={
              state.status === 'success' ? 'success' : 
              state.status === 'error' ? 'danger' :
              state.status === 'warning' ? 'warning' : 'info'
            }
          >
            <Alert.Heading>{state.message}</Alert.Heading>
            
            {state.details && (
              <div className="mt-3">
                <p className="mb-1">Response details:</p>
                <pre className="bg-light p-2 rounded small" style={{ maxHeight: '150px', overflow: 'auto' }}>
                  {JSON.stringify(state.details, null, 2)}
                </pre>
              </div>
            )}
          </Alert>
        )}
        
        <Card.Text className="text-muted small mt-3">
          <strong>API URL:</strong> {apiUrl}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ConnectionTest;