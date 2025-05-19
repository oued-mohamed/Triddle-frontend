// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Container, Row, Col, Card, Button as BsButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaMobileAlt, 
  FaChartBar, 
  FaCloudUploadAlt, 
  FaCode, 
  FaLock, 
  FaCheck,
  FaArrowRight
} from 'react-icons/fa';
import { useAuthStore } from '../context/authStore';

const LandingPage = () => {
  const { user } = useAuthStore();
  
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const features = [
    {
      icon: <FaMobileAlt size={30} />,
      title: 'Mobile-First Design',
      description: 'Optimized for all devices with a smooth, responsive experience.'
    },
    {
      icon: <FaChartBar size={30} />,
      title: 'Advanced Analytics',
      description: 'Track visits, completions, and see where users drop off.'
    },
    {
      icon: <FaCloudUploadAlt size={30} />,
      title: 'File Uploads',
      description: 'Allow users to upload documents, images, and more.'
    },
    {
      icon: <FaCode size={30} />,
      title: 'Developer API',
      description: 'RESTful API for custom integrations and workflows.'
    },
    {
      icon: <FaLock size={30} />,
      title: 'Secure & Private',
      description: 'Data protection with JWT authentication and secure storage.'
    },
    {
      icon: <FaRocket size={30} />,
      title: 'Cloud Deployment',
      description: 'Easy deployment to cloud platforms for instant availability.'
    }
  ];
  
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: [
        '3 forms',
        '100 responses/month',
        'Basic analytics',
        'Email support'
      ],
      highlighted: false,
      buttonText: 'Start Free'
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      features: [
        'Unlimited forms',
        '1,000 responses/month',
        'Advanced analytics',
        'File uploads',
        'Priority support'
      ],
      highlighted: true,
      buttonText: 'Get Pro'
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'per month',
      features: [
        'Unlimited everything',
        'Custom branding',
        'API access',
        'Dedicated support',
        'Team management'
      ],
      highlighted: false,
      buttonText: 'Contact Sales'
    }
  ];
  
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
        <Container>
          <Link to="/" className="navbar-brand fw-bold fs-4 text-primary">
            Triddle
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a href="#features" className="nav-link">Features</a>
              </li>
              <li className="nav-item">
                <a href="#pricing" className="nav-link">Pricing</a>
              </li>
              <li className="nav-item">
                <a href="#faq" className="nav-link">FAQ</a>
              </li>
            </ul>
            
            <div className="d-flex">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-primary me-2">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </Container>
      </nav>
      
      {/* Hero Section */}
      <motion.section 
        className="hero-section bg-gradient-primary text-white py-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="display-4 fw-bold mb-4">
                  Beautiful Forms, One Question at a Time
                </h1>
                <p className="lead mb-4">
                  Triddle helps you create mobile-friendly forms that your users will love to fill out. 
                  Collect responses, analyze results, and make better decisions with powerful analytics.
                </p>
                <div className="d-flex gap-3">
                  <Link to={user ? "/dashboard" : "/register"} className="btn btn-light btn-lg">
                    Get Started <FaArrowRight className="ms-2" />
                  </Link>
                  <a href="#features" className="btn btn-outline-light btn-lg">
                    Learn More
                  </a>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <img 
                  src="https://via.placeholder.com/600x400" 
                  alt="Triddle Form Builder" 
                  className="img-fluid rounded shadow"
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.section>
      
      {/* Features Section */}
      <motion.section 
        id="features" 
        className="features-section py-5"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        viewport={{ once: true }}
      >
        <Container>
          <motion.div variants={itemVariants} className="text-center mb-5">
            <h2 className="display-5 fw-bold">Powerful Features</h2>
            <p className="lead">Everything you need to create amazing forms</p>
          </motion.div>
          
          <Row>
            {features.map((feature, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <motion.div variants={itemVariants}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center p-4">
                      <div className="feature-icon text-primary mb-3">
                        {feature.icon}
                      </div>
                      <h4 className="mb-2">{feature.title}</h4>
                      <p className="text-muted mb-0">{feature.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </motion.section>
      
      {/* How It Works Section */}
      <motion.section
        className="how-it-works-section py-5 bg-light"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        viewport={{ once: true }}
      >
        <Container>
          <motion.div variants={itemVariants} className="text-center mb-5">
            <h2 className="display-5 fw-bold">How It Works</h2>
            <p className="lead">Create forms in minutes, not hours</p>
          </motion.div>
          
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <motion.div variants={itemVariants}>
                <img 
                  src="https://via.placeholder.com/600x400" 
                  alt="How Triddle Works" 
                  className="img-fluid rounded shadow"
                />
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div variants={itemVariants}>
                <div className="step d-flex align-items-start mb-4">
                  <div className="step-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                    1
                  </div>
                  <div>
                    <h4>Create Your Form</h4>
                    <p className="text-muted">
                      Design your form with our easy-to-use builder. Add questions, customize fields, and set validation rules.
                    </p>
                  </div>
                </div>
                
                <div className="step d-flex align-items-start mb-4">
                  <div className="step-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                    2
                  </div>
                  <div>
                    <h4>Share With Your Audience</h4>
                    <p className="text-muted">
                      Get a unique link to share your form with your audience via email, social media, or embed it on your website.
                    </p>
                  </div>
                </div>
                
                <div className="step d-flex align-items-start mb-4">
                  <div className="step-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                    3
                  </div>
                  <div>
                    <h4>Collect & Analyze Responses</h4>
                    <p className="text-muted">
                      View responses in real-time and gain insights with powerful analytics and visualization tools.
                    </p>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.section>
      
      {/* Pricing Section */}
      <motion.section 
        id="pricing" 
        className="pricing-section py-5"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        viewport={{ once: true }}
      >
        <Container>
          <motion.div variants={itemVariants} className="text-center mb-5">
            <h2 className="display-5 fw-bold">Simple Pricing</h2>
            <p className="lead">Plans that grow with your needs</p>
          </motion.div>
          
          <Row className="justify-content-center">
            {plans.map((plan, index) => (
              <Col md={4} key={index} className="mb-4">
                <motion.div variants={itemVariants}>
                  <Card className={`h-100 border-0 shadow pricing-card ${plan.highlighted ? 'pricing-card-highlighted' : ''}`}>
                    {plan.highlighted && (
                      <div className="pricing-popular">Most Popular</div>
                    )}
                    <Card.Body className="p-4">
                      <h3 className="pricing-name mb-2">{plan.name}</h3>
                      <div className="pricing-price mb-4">
                        <span className="display-4 fw-bold">{plan.price}</span>
                        {plan.period && <span className="text-muted">/{plan.period}</span>}
                      </div>
                      <ul className="pricing-features mb-4">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="mb-2">
                            <FaCheck className="text-success me-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <BsButton 
                        variant={plan.highlighted ? 'primary' : 'outline-primary'} 
                        size="lg" 
                        className="w-100"
                      >
                        {plan.buttonText}
                      </BsButton>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </motion.section>
      
      {/* FAQ Section */}
      <motion.section
        id="faq" 
        className="faq-section py-5 bg-light"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        viewport={{ once: true }}
      >
        <Container>
          <motion.div variants={itemVariants} className="text-center mb-5">
            <h2 className="display-5 fw-bold">Frequently Asked Questions</h2>
            <p className="lead">Everything you need to know about Triddle</p>
          </motion.div>
          
          <Row className="justify-content-center">
            <Col lg={8}>
              <motion.div variants={itemVariants}>
                <div className="accordion" id="faqAccordion">
                  <div className="accordion-item border-0 mb-3 shadow-sm">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#faq1"
                      >
                        How does Triddle differ from other form builders?
                      </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Triddle focuses on creating a mobile-first experience with a one-question-at-a-time approach. This leads to higher completion rates and a better user experience, especially on mobile devices.
                      </div>
                    </div>
                  </div>
                  
                  <div className="accordion-item border-0 mb-3 shadow-sm">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#faq2"
                      >
                        Can I embed forms on my website?
                      </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Yes! Triddle forms can be easily embedded on your website using our embed code. You can also customize the appearance to match your website's design.
                      </div>
                    </div>
                  </div>
                  
                  <div className="accordion-item border-0 mb-3 shadow-sm">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#faq3"
                      >
                        How secure are the file uploads?
                      </button>
                    </h2>
                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        All file uploads are securely stored in the cloud using signed URLs. We also provide virus scanning and file size limits to ensure safety and performance.
                      </div>
                    </div>
                  </div>
                  
                  <div className="accordion-item border-0 shadow-sm">
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#faq4"
                      >
                        Do you offer a free trial?
                      </button>
                    </h2>
                    <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Yes, we offer a free tier that includes basic features. You can upgrade to our paid plans at any time to unlock more advanced features and higher response limits.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.section>
      
      {/* CTA Section */}
      <motion.section
        className="cta-section py-5 bg-gradient-primary text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Container className="text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Create Amazing Forms?</h2>
          <p className="lead mb-4">
            Join thousands of users who are building better forms with Triddle.
          </p>
          <Link to={user ? "/dashboard" : "/register"} className="btn btn-light btn-lg px-5">
            Get Started for Free
          </Link>
        </Container>
      </motion.section>
      
      {/* Footer */}
      <footer className="footer py-5 bg-dark text-white">
        <Container>
          <Row>
            <Col lg={4} className="mb-4 mb-lg-0">
              <h4 className="text-white mb-4">Triddle</h4>
              <p>
                A lightweight, mobile-first form builder platform designed for modern businesses and developers.
              </p>
              <div className="social-icons">
                {/* Social icons would go here */}
              </div>
            </Col>
            
            <Col lg={2} md={4} className="mb-4 mb-md-0">
              <h5 className="text-white mb-4">Product</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white-50">Features</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Pricing</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">FAQ</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Roadmap</a></li>
              </ul>
            </Col>
            
            <Col lg={2} md={4} className="mb-4 mb-md-0">
              <h5 className="text-white mb-4">Company</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white-50">About</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Blog</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Careers</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Contact</a></li>
              </ul>
            </Col>
            
            <Col lg={2} md={4} className="mb-4 mb-md-0">
              <h5 className="text-white mb-4">Resources</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white-50">Documentation</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">API Reference</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Tutorials</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Support</a></li>
              </ul>
            </Col>
            
            <Col lg={2} md={4}>
              <h5 className="text-white mb-4">Legal</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white-50">Privacy Policy</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Terms of Service</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Cookie Policy</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">GDPR</a></li>
              </ul>
            </Col>
          </Row>
          
          <hr className="my-4 bg-light" />
          
          <div className="text-center text-white-50">
            <p className="mb-0">&copy; {new Date().getFullYear()} Triddle. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;