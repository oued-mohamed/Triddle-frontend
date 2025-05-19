// frontend/src/pages/FormAnalytics.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaChartBar, 
  FaUsers, 
  FaCheckCircle, 
  FaList, 
  FaArrowLeft,
  FaShareAlt, 
  FaClock
} from 'react-icons/fa';
import { useFormStore } from '.src/context/formStore';

import Button from '../components/common/Button';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  PointElement, 
  LineElement 
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  PointElement, 
  LineElement
);

const FormAnalytics = () => {
  const { id } = useParams();
  const { currentForm, fetchFormById, fetchFormAnalytics, isLoading, error } = useFormStore();
  const [analytics, setAnalytics] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  
  // Fetch form data and analytics when component mounts
  useEffect(() => {
    const loadData = async () => {
      await fetchFormById(id);
      const analyticsData = await fetchFormAnalytics(id);
      setAnalytics(analyticsData);
    };
    
    loadData();
  }, [id, fetchFormById, fetchFormAnalytics]);
  
  // Set share URL when form data is loaded
  useEffect(() => {
    if (currentForm) {
      setShareUrl(`${window.location.origin}/f/${currentForm.id}`);
    }
  }, [currentForm]);
  
  // Copy share URL to clipboard
  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Share URL copied to clipboard!');
  };
  
  // Prepare chart data for completion rate
  const completionChartData = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: analytics ? [analytics.completionRate, 100 - analytics.completionRate] : [0, 100],
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
  
  // Prepare chart data for question dropoff
  const dropoffChartData = {
    labels: analytics ? analytics.questions.map((q, idx) => `Q${idx + 1}`) : [],
    datasets: [
      {
        label: 'Answers',
        data: analytics ? analytics.questions.map(q => q.answers) : [],
        backgroundColor: 'rgba(63, 81, 181, 0.7)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  // Loading state
  if (isLoading && !currentForm) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading analytics...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );
  }
  
  return (
    <Container fluid>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/forms/builder/${form.id || form._id}`} className="text-decoration-none text-muted mb-2 d-inline-block">
                <FaArrowLeft className="me-2" />
                Back to Form
              </Link>
              <h1 className="mb-0">Form Analytics</h1>
              {currentForm && <p className="text-muted mb-0">{currentForm.title}</p>}
            </div>
            
            <Button
              variant="outline-primary"
              onClick={handleCopyShareUrl}
              icon={<FaShareAlt />}
            >
              Share Form
            </Button>
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <motion.div variants={itemVariants}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="stat-icon">
                    <FaUsers />
                  </div>
                  <div className="stat-value">{analytics?.visits || 0}</div>
                  <div className="stat-label">Total Visits</div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col md={4}>
            <motion.div variants={itemVariants}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="stat-icon">
                    <FaList />
                  </div>
                  <div className="stat-value">{analytics?.responses || 0}</div>
                  <div className="stat-label">Total Responses</div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col md={4}>
            <motion.div variants={itemVariants}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="stat-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="stat-value">{analytics?.completionRate || 0}%</div>
                  <div className="stat-label">Completion Rate</div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
        
        {/* Charts */}
        <Row className="mb-4">
          <Col lg={6}>
            <motion.div variants={itemVariants}>
              <Card className="dashboard-card">
                <Card.Header>
                  <Card.Title>Completion Rate</Card.Title>
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
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div variants={itemVariants}>
              <Card className="dashboard-card">
                <Card.Header>
                  <Card.Title>Response By Question</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={dropoffChartData}
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
                            title: {
                              display: true,
                              text: 'Number of Answers'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Questions'
                            }
                          }
                        },
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
        
        {/* Question Drop-off Analysis */}
        <motion.div variants={itemVariants} className="mb-4">
          <Card className="dashboard-card">
            <Card.Header>
              <Card.Title>Question Drop-off Analysis</Card.Title>
            </Card.Header>
            <Card.Body>
              {analytics?.questions && analytics.questions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Type</th>
                        <th>Answers</th>
                        <th>Drop-off Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.questions.map((question, index) => (
                        <tr key={question.id}>
                          <td>{index + 1}</td>
                          <td>{question.title}</td>
                          <td><span className="badge bg-secondary">{question.type}</span></td>
                          <td>{question.answers}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div 
                                className="progress flex-grow-1 me-2" 
                                style={{ height: '10px' }}
                              >
                                <div 
                                  className={`progress-bar ${
                                    question.dropoffRate < 10 ? 'bg-success' : 
                                    question.dropoffRate < 30 ? 'bg-warning' : 
                                    'bg-danger'
                                  }`}
                                  style={{ width: `${100 - question.dropoffRate}%` }}
                                />
                              </div>
                              <span>{question.dropoffRate.toFixed(1)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-5">
                  <FaChartBar size={48} className="text-muted mb-3" />
                  <h5>No Data Available</h5>
                  <p className="text-muted">
                    Start collecting responses to see drop-off analysis.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
        
        {/* Actions */}
        <motion.div variants={itemVariants} className="d-flex justify-content-between">
          <Link to={`/forms/builder/${form.id || form._id}`}>
            <Button variant="outline-secondary" icon={<FaArrowLeft />}>
              Back to Form
            </Button>
          </Link>
          <Link to={`/forms/${id}/responses`}>
            <Button variant="primary" icon={<FaList />}>
              View Responses
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default FormAnalytics;