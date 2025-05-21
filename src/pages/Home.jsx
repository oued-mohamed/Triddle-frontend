// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaMobileAlt, 
  FaChartBar, 
  FaCloudUploadAlt, 
  FaLock, 
  FaCode, 
  FaCheckCircle,
  FaGithub,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa';
import { useAuthStore } from '../context/AuthStore';

const LandingPage = () => {
  const { user } = useAuthStore();

  // Custom inline styles to match the design
  const styles = {
    // General styles
    sectionPadding: {
      padding: '6rem 0'
    },
    sectionPaddingSmall: {
      padding: '4rem 0'
    },
    primaryBg: {
      backgroundColor: '#4361ee'
    },
    lightBg: {
      backgroundColor: '#f8f9fa'
    },
    darkBg: {
      backgroundColor: '#212529'
    },
    
    // Hero section
    hero: {
      backgroundImage: 'linear-gradient(135deg, #4361ee, #3a56d4)',
      color: 'white',
      paddingTop: '7rem',
      paddingBottom: '7rem',
      position: 'relative',
      overflow: 'hidden'
    },
    heroContent: {
      position: 'relative',
      zIndex: 10
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: '800',
      marginBottom: '1.5rem',
      lineHeight: '1.2'
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      fontWeight: '400',
      marginBottom: '2rem',
      maxWidth: '600px'
    },
    heroImage: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '1rem',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
    },
    heroBtnPrimary: {
      backgroundColor: 'white',
      color: '#4361ee',
      border: 'none',
      padding: '0.75rem 2rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '50px',
      marginRight: '1rem'
    },
    heroBtnSecondary: {
      backgroundColor: 'transparent',
      color: 'white',
      border: '2px solid white',
      padding: '0.75rem 2rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '50px'
    },
    
    // Features section
    featureIcon: {
      fontSize: '2.5rem',
      color: '#4361ee',
      marginBottom: '1.25rem'
    },
    featureTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '1rem'
    },
    featureCard: {
      border: 'none',
      borderRadius: '1rem',
      padding: '2rem',
      height: '100%',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'default'
    },
    featureCardHover: {
      transform: 'translateY(-10px)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)'
    },

    // How it works section
    stepNumber: {
      backgroundColor: '#4361ee',
      color: 'white',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
      fontWeight: '700',
      marginRight: '1rem'
    },
    
    // Testimonials section
    testimonialCard: {
      border: 'none',
      borderRadius: '1rem',
      padding: '2.5rem',
      backgroundColor: 'white',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)'
    },
    testimonialText: {
      fontSize: '1.1rem',
      fontStyle: 'italic',
      marginBottom: '1.5rem'
    },
    testimonialAuthor: {
      fontWeight: '700'
    },
    testimonialRole: {
      color: '#6c757d'
    },
    
    // Pricing section
    pricingCard: {
      border: 'none',
      borderRadius: '1rem',
      padding: '2.5rem',
      height: '100%',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    pricingCardHighlighted: {
      transform: 'scale(1.05)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
      border: '2px solid #4361ee'
    },
    pricingHeader: {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '1rem'
    },
    pricingPrice: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '1rem'
    },
    pricingPeriod: {
      fontSize: '1rem',
      color: '#6c757d'
    },
    pricingFeatures: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '2rem'
    },
    pricingFeatureItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.75rem'
    },
    pricingFeatureIcon: {
      color: '#4361ee',
      marginRight: '0.75rem'
    },
    
    // CTA section
    ctaSection: {
      backgroundColor: '#4361ee',
      color: 'white',
      padding: '5rem 0',
      borderRadius: '1rem',
      margin: '0 1rem'
    },
    ctaTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '1.5rem'
    },
    ctaBtn: {
      backgroundColor: 'white',
      color: '#4361ee',
      border: 'none',
      padding: '0.75rem 2rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '50px'
    },
    
    // Footer
    footer: {
      backgroundColor: '#1e2a4a',
      color: 'white',
      padding: '5rem 0 2rem'
    },
    footerLogo: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '1rem'
    },
    footerText: {
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '2rem'
    },
    footerHeading: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1.5rem'
    },
    footerLink: {
      color: 'rgba(255, 255, 255, 0.7)',
      textDecoration: 'none',
      marginBottom: '0.75rem',
      display: 'block',
      transition: 'color 0.3s ease'
    },
    footerLinkHover: {
      color: 'white'
    },
    footerSocial: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    footerSocialIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease'
    },
    footerSocialIconHover: {
      backgroundColor: '#4361ee'
    },
    footerBottom: {
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      paddingTop: '2rem',
      marginTop: '3rem',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)'
    }
  };

  const features = [
    {
      icon: <FaMobileAlt style={styles.featureIcon} />,
      title: 'Mobile-First Design',
      description: 'Create forms that look and work beautifully on any device with our responsive, mobile-first approach.'
    },
    {
      icon: <FaChartBar style={styles.featureIcon} />,
      title: 'Advanced Analytics',
      description: 'Gain insights from comprehensive analytics that track form performance, completion rates, and user behavior.'
    },
    {
      icon: <FaCloudUploadAlt style={styles.featureIcon} />,
      title: 'File Uploads',
      description: 'Allow users to upload documents, images, and more with secure cloud storage integration.'
    },
    {
      icon: <FaLock style={styles.featureIcon} />,
      title: 'Secure & Private',
      description: 'Keep your data safe with our secure authentication system, encrypted data storage, and compliant practices.'
    },
    {
      icon: <FaCode style={styles.featureIcon} />,
      title: 'Developer-Friendly API',
      description: 'Integrate forms into your applications with our comprehensive RESTful API and documentation.'
    }
  ];

  const testimonials = [
    {
      text: "Triddle transformed our survey process. The single-question approach significantly increased our completion rates from 20% to over 75%!",
      author: "Sarah Johnson",
      role: "Marketing Director, TechCorp"
    },
    {
      text: "As a developer, I appreciate the clean API and seamless integration options. It took me just an hour to implement Triddle forms across our entire platform.",
      author: "Alex Rodriguez",
      role: "Lead Developer, FinTech Inc."
    },
    {
      text: "The analytics provided by Triddle helped us understand exactly where users were dropping off in our forms, allowing us to optimize and improve conversion.",
      author: "Michelle Chang",
      role: "UX Researcher, StartupX"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "3 forms",
        "100 responses/month",
        "Basic analytics",
        "Email support",
        "File uploads up to 5MB"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline-primary",
      highlighted: false
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      features: [
        "Unlimited forms",
        "1,000 responses/month",
        "Advanced analytics",
        "File uploads up to 100MB",
        "Priority support",
        "Custom branding",
        "Export responses"
      ],
      buttonText: "Get Pro",
      buttonVariant: "primary",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "per month",
      features: [
        "Unlimited everything",
        "Custom branding",
        "API access",
        "Dedicated support",
        "Team management",
        "SSO integration",
        "SLA guarantees"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline-primary",
      highlighted: false
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 fixed-top shadow-sm">
        <Container>
          <Link to="/" className="navbar-brand fw-bold fs-4">
            <span style={{ color: '#4361ee' }}>Triddle</span>
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
                <a href="#how-it-works" className="nav-link">How It Works</a>
              </li>
              <li className="nav-item">
                <a href="#pricing" className="nav-link">Pricing</a>
              </li>
            </ul>
            
            <div className="d-flex">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary rounded-pill px-4">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-primary rounded-pill px-4 me-2">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary rounded-pill px-4">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </Container>
      </nav>
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <Container style={styles.heroContent}>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 style={styles.heroTitle}>
                Beautiful Forms, One Question at a Time
              </h1>
              <p style={styles.heroSubtitle}>
                Create engaging, mobile-friendly forms that your users will love to fill out. 
                Collect responses, analyze results, and make better decisions.
              </p>
              <div>
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button style={styles.heroBtnPrimary}>
                    Get Started <FaArrowRight className="ms-2" />
                  </Button>
                </Link>
                <Button style={styles.heroBtnSecondary}>
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <img 
                src="https://via.placeholder.com/600x400/4361ee/FFFFFF?text=Form+Builder" 
                alt="Triddle Form Builder" 
                style={styles.heroImage}
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Features Section */}
      <section id="features" style={{...styles.sectionPadding, ...styles.lightBg}}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{fontSize: '2.5rem'}}>Powerful Features</h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: '700px'}}>
              Everything you need to create amazing forms that convert
            </p>
          </div>
          
          <Row>
            {features.map((feature, index) => (
              <Col lg={4} md={6} className="mb-4" key={index}>
                <Card 
                  style={styles.featureCard}
                  className="shadow-sm feature-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = styles.featureCardHover.transform;
                    e.currentTarget.style.boxShadow = styles.featureCardHover.boxShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <Card.Body className="text-center">
                    {feature.icon}
                    <h3 style={styles.featureTitle}>{feature.title}</h3>
                    <p className="text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" style={styles.sectionPadding}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{fontSize: '2.5rem'}}>How It Works</h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: '700px'}}>
              Creating forms with Triddle is easy and intuitive
            </p>
          </div>
          
          <Row className="align-items-center mb-5">
            <Col lg={6} className="mb-4 mb-lg-0">
              <img 
                src="https://via.placeholder.com/600x400/eeeeee/333333?text=Create+Forms" 
                alt="Create your form" 
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col lg={6}>
              <div className="d-flex align-items-start mb-4">
                <div style={styles.stepNumber}>1</div>
                <div>
                  <h3 className="fw-bold mb-2">Create Your Form</h3>
                  <p className="text-muted">
                    Design your form with our easy-to-use builder. Add questions, customize fields, and set validation rules.
                    Choose from multiple question types including text, multiple choice, and file uploads.
                  </p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-4">
                <div style={styles.stepNumber}>2</div>
                <div>
                  <h3 className="fw-bold mb-2">Share With Your Audience</h3>
                  <p className="text-muted">
                    Get a unique link to share your form via email, social media, or embed it on your website.
                    Control access with password protection or limited time availability.
                  </p>
                </div>
              </div>
              
              <div className="d-flex align-items-start">
                <div style={styles.stepNumber}>3</div>
                <div>
                  <h3 className="fw-bold mb-2">Collect & Analyze Responses</h3>
                  <p className="text-muted">
                    View responses in real-time and gain insights with powerful analytics and visualization tools.
                    Export data in multiple formats for further analysis.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Testimonials Section */}
      <section style={{...styles.sectionPadding, ...styles.lightBg}}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{fontSize: '2.5rem'}}>What Our Users Say</h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: '700px'}}>
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <Carousel indicators={false} interval={5000} className="py-4">
            <Carousel.Item>
              <Row className="justify-content-center">
                {testimonials.map((testimonial, index) => (
                  <Col lg={4} md={6} className="mb-4" key={index}>
                    <Card style={styles.testimonialCard}>
                      <Card.Body>
                        <p style={styles.testimonialText}>{testimonial.text}</p>
                        <div>
                          <p style={styles.testimonialAuthor} className="mb-0">{testimonial.author}</p>
                          <p style={styles.testimonialRole}>{testimonial.role}</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" style={styles.sectionPadding}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{fontSize: '2.5rem'}}>Simple Pricing</h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: '700px'}}>
              Flexible plans that grow with your needs
            </p>
          </div>
          
          <Row className="justify-content-center">
            {pricingPlans.map((plan, index) => (
              <Col lg={4} md={6} className="mb-4" key={index}>
                <Card 
                  style={{
                    ...styles.pricingCard,
                    ...(plan.highlighted ? styles.pricingCardHighlighted : {})
                  }}
                  className={`shadow-sm ${plan.highlighted ? 'border-primary' : ''}`}
                >
                  <Card.Body className="text-center">
                    {plan.highlighted && (
                      <div className="badge bg-primary position-absolute top-0 end-0 translate-middle">
                        Popular
                      </div>
                    )}
                    <h3 style={styles.pricingHeader}>{plan.name}</h3>
                    <div style={styles.pricingPrice}>
                      {plan.price}
                      <span style={styles.pricingPeriod}>/{plan.period}</span>
                    </div>
                    
                    <ul style={styles.pricingFeatures}>
                      {plan.features.map((feature, i) => (
                        <li key={i} style={styles.pricingFeatureItem}>
                          <FaCheckCircle style={styles.pricingFeatureIcon} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant={plan.buttonVariant}
                      className="w-100 py-3 rounded-pill fw-bold"
                    >
                      {plan.buttonText}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="mb-5">
        <Container>
          <div style={styles.ctaSection} className="text-center">
            <h2 style={styles.ctaTitle}>Ready to Create Amazing Forms?</h2>
            <p className="lead mb-4">
              Join thousands of users who are building better forms with Triddle
            </p>
            <Link to={user ? "/dashboard" : "/register"}>
              <Button style={styles.ctaBtn} size="lg" className="rounded-pill px-5">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </Container>
      </section>
      
      {/* Footer */}
      <footer style={styles.footer}>
        <Container>
          <Row>
            <Col lg={4} className="mb-5 mb-lg-0">
              <div style={styles.footerLogo}>Triddle</div>
              <p style={styles.footerText}>
                A lightweight, mobile-first form builder platform designed for modern businesses and developers.
                Create beautiful forms, collect responses, and analyze results.
              </p>
              <div style={styles.footerSocial}>
                <a 
                  href="#" 
                  style={styles.footerSocialIcon}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.footerSocialIconHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  <FaTwitter />
                </a>
                <a 
                  href="#" 
                  style={styles.footerSocialIcon}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.footerSocialIconHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  <FaLinkedin />
                </a>
                <a 
                  href="#" 
                  style={styles.footerSocialIcon}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.footerSocialIconHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  <FaGithub />
                </a>
              </div>
            </Col>
            
            <Col md={2} sm={6} className="mb-4 mb-md-0">
              <h4 style={styles.footerHeading}>Product</h4>
              <ul className="list-unstyled">
                <li><a href="#features" style={styles.footerLink}>Features</a></li>
                <li><a href="#pricing" style={styles.footerLink}>Pricing</a></li>
                <li><a href="#" style={styles.footerLink}>FAQ</a></li>
                <li><a href="#" style={styles.footerLink}>Roadmap</a></li>
              </ul>
            </Col>
            
            <Col md={2} sm={6} className="mb-4 mb-md-0">
              <h4 style={styles.footerHeading}>Company</h4>
              <ul className="list-unstyled">
                <li><a href="#" style={styles.footerLink}>About</a></li>
                <li><a href="#" style={styles.footerLink}>Blog</a></li>
                <li><a href="#" style={styles.footerLink}>Careers</a></li>
                <li><a href="#" style={styles.footerLink}>Contact</a></li>
              </ul>
            </Col>
            
            <Col md={2} sm={6} className="mb-4 mb-md-0">
              <h4 style={styles.footerHeading}>Resources</h4>
              <ul className="list-unstyled">
                <li><a href="#" style={styles.footerLink}>Documentation</a></li>
                <li><a href="#" style={styles.footerLink}>API Reference</a></li>
                <li><a href="#" style={styles.footerLink}>Tutorials</a></li>
                <li><a href="#" style={styles.footerLink}>Support</a></li>
              </ul>
            </Col>
            
            <Col md={2} sm={6}>
              <h4 style={styles.footerHeading}>Legal</h4>
              <ul className="list-unstyled">
                <li><a href="#" style={styles.footerLink}>Privacy Policy</a></li>
                <li><a href="#" style={styles.footerLink}>Terms of Service</a></li>
                <li><a href="#" style={styles.footerLink}>Cookie Policy</a></li>
                <li><a href="#" style={styles.footerLink}>GDPR</a></li>
              </ul>
            </Col>
          </Row>
          
          <div style={styles.footerBottom}>
            <p className="mb-0">&copy; {new Date().getFullYear()} Triddle. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;