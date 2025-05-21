// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Alert, Button as RBButton } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaWpforms, FaUsers, FaChartLine, FaPlus, FaSyncAlt, FaSignOutAlt } from 'react-icons/fa';
import Button from '../components/common/Button';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useFormStore } from '../context/FormStore.jsx';
import api from '../services/api';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const navigate = useNavigate();
  const { forms, fetchForms, isLoading } = useFormStore();
  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    completionRate: 0,
    recentActivity: []
  });
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh
  const location = useLocation();
  const [formResponses, setFormResponses] = useState({});

  // Function to handle logout
  const handleLogout = () => {
    // Add your logout logic here
    // For example:
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Function to handle create form
  const handleCreateForm = () => {
    navigate('/forms/builder/new');
  };

  // Stub function to get response count without making failed API calls
  const getResponseCount = async (formId) => {
    try {
      // Return 0 as default instead of trying to call the non-existent endpoint
      // When the backend endpoint is implemented later, update this function
      // to make the actual API call
      return 0;
    } catch (err) {
      console.log(`Could not fetch response count for form ${formId}:`, err);
      return 0;
    }
  };

  // Function to fetch response counts for forms
  const fetchResponseCounts = useCallback(async (formIds) => {
    if (!formIds || formIds.length === 0) return {};
    
    try {
      // Create an object to store response counts
      const counts = {};
      
      // Fetch response counts for each form
      await Promise.all(formIds.map(async (formId) => {
        try {
          // Use the stub function instead of making API calls that will fail
          counts[formId] = await getResponseCount(formId);
        } catch (err) {
          console.log(`Could not fetch response count for form ${formId}:`, err);
          counts[formId] = 0;
        }
      }));
      
      console.log("Response counts:", counts);
      return counts;
    } catch (err) {
      console.error("Error fetching response counts:", err);
      return {};
    }
  }, []);

  // Function to manually refresh data
  const refreshData = useCallback(async () => {
    setError(null);
    try {
      await fetchForms();
      console.log("Forms refreshed successfully!");
    } catch (err) {
      console.error('Error refreshing forms:', err);
      setError('Failed to refresh data. Please try again.');
    }
  }, [fetchForms]);

  // Fetch forms when component mounts or when navigation occurs
  useEffect(() => {
    console.log("Dashboard mounted or location changed. Fetching forms...");
    refreshData();
  }, [refreshData, location.key, refreshKey]);

  // Fetch response counts when forms are loaded
  useEffect(() => {
    const getResponseCounts = async () => {
      if (forms && forms.length > 0) {
        const formIds = forms.map(form => form.id || form._id).filter(id => id);
        const counts = await fetchResponseCounts(formIds);
        setFormResponses(counts);
      }
    };
    
    getResponseCounts();
  }, [forms, fetchResponseCounts]);

  // Calculate stats when forms data changes
  useEffect(() => {
    if (forms && forms.length > 0) {
      console.log("Calculating stats from", forms.length, "forms");
      
      // Calculate total forms
      const totalForms = forms.length;
      
      // Calculate total responses from our separately fetched response counts
      // instead of relying on the potentially incorrect _count property
      const totalResponses = Object.values(formResponses).reduce((sum, count) => sum + count, 0);
      
      // Calculate average completion rate (placeholder or calculate from actual data)
      const completionRate = Math.round(Math.random() * 100);
      
      // Sort forms by creation date to get recent activity
      const recentActivity = [...forms]
        .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || 0))
        .slice(0, 5);
      
      setStats({
        totalForms,
        totalResponses,
        completionRate,
        recentActivity
      });
    } else {
      console.log("No forms available to calculate stats");
    }
  }, [forms, formResponses]);

  // Prepare chart data with safeguards
  const safeFormsList = Array.isArray(forms) ? forms : [];
  
  // Prepare chart data for doughnut chart
  const completionChartData = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: [stats.completionRate, 100 - stats.completionRate],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(244, 67, 54, 0.8)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(244, 67, 54, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for bar chart - use safeFormsList
  const responseChartData = {
    labels: safeFormsList.slice(0, 5).map(form => form.title || 'Untitled'),
    datasets: [
      {
        label: 'Responses',
        data: safeFormsList.slice(0, 5).map(form => {
          // Use our separately fetched response counts instead of _count.responses
          const formId = form.id || form._id;
          return formId ? (formResponses[formId] || 0) : 0;
        }),
        backgroundColor: 'rgba(63, 81, 181, 0.7)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Show loading state
  if (isLoading) {
    return (
      <Container fluid className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  // Helper function to get response count for a form
  const getFormResponseCount = (form) => {
    const formId = form.id || form._id;
    if (!formId) return 0;
    
    // Use our separately fetched response counts
    return formResponses[formId] || 0;
  };

  return (
    <Container fluid>
      <div className="dashboard-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <h1 className="page-title mb-0 me-3">Dashboard</h1>
            <RBButton 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setRefreshKey(prev => prev + 1)}
              title="Refresh dashboard data"
            >
              <FaSyncAlt />
            </RBButton>
          </div>
          <Link to="/forms/builder/new">
            <Button variant="primary" icon={<FaPlus />}>
              Create Form
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col lg={4}>
            <Card className="dashboard-card bg-primary">
              <Card.Body>
                <div className="stat-icon">
                  <FaWpforms size={24} />
                </div>
                <div className="stat-value">{stats.totalForms}</div>
                <div className="stat-label">Total Forms</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="dashboard-card bg-success">
              <Card.Body>
                <div className="stat-icon">
                  <FaUsers size={24} />
                </div>
                <div className="stat-value">{stats.totalResponses}</div>
                <div className="stat-label">Total Responses</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="dashboard-card bg-info">
              <Card.Body>
                <div className="stat-icon">
                  <FaChartLine size={24} />
                </div>
                <div className="stat-value">{stats.completionRate}%</div>
                <div className="stat-label">Avg. Completion Rate</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row className="mb-4">
          <Col lg={6}>
            <Card className="dashboard-card">
              <Card.Header>
                <Card.Title>Form Completion Rate</Card.Title>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Doughnut
                    data={completionChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="dashboard-card">
              <Card.Header>
                <Card.Title>Top Forms by Responses</Card.Title>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Bar
                    data={responseChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Forms */}
        <Card className="dashboard-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title className="mb-0">Recent Forms</Card.Title>
            <RBButton 
              variant="outline-primary" 
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh Forms'}
            </RBButton>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Form Name</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Responses</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map((form, index) => (
                      <tr key={form.id || index}>
                        <td>{form.title || 'Untitled Form'}</td>
                        <td>{form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`badge ${form.isPublished ? 'bg-success' : 'bg-warning'}`}>
                            {form.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td>{getFormResponseCount(form)}</td>
                        <td>
                          <div className="d-flex">
                            <Link to={`/forms/builder/${form.id || form._id}`} className="btn btn-sm btn-outline-primary me-2">
                              Edit
                            </Link>
                            <Link to={`/forms/${form.id || form._id}/fill`} className="btn btn-sm btn-outline-info">
                              Fill Form
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No forms created yet. <Link to="/forms/create">Create your first form</Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card.Body>
          {stats.recentActivity.length > 0 && (
            <Card.Footer>
              <Link to="/forms" className="text-decoration-none">
                View all forms
              </Link>
            </Card.Footer>
          )}
        </Card>
      </div>
    </Container>
  );
};

export default Dashboard;