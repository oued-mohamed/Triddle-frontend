// src/components/form/FormTemplates.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaClipboardList, 
  FaUserAlt, 
  FaShoppingCart, 
  FaStar, 
  FaGraduationCap, 
  FaFileAlt, 
  FaClipboardCheck,
  FaTrophy,
  FaChartBar,
  FaShareAlt
} from 'react-icons/fa';

// Enhanced templates with additional features
const TEMPLATES = [
  {
    id: 'contact-form',
    title: 'Contact Information',
    description: 'Collect basic contact details from users.',
    icon: <FaUserAlt className="mb-3" size={32} />,
    color: '#3b82f6',
    features: ['Progress Bar', 'Shareable Results'],
    fields: [
      {
        id: 'field-name',
        type: 'text',
        label: 'Full Name',
        helpText: 'Please enter your first and last name',
        required: true,
        order: 0,
        options: []
      },
      {
        id: 'field-email',
        type: 'text',
        label: 'Email Address',
        helpText: 'We will use this to contact you',
        required: true,
        order: 1,
        options: []
      },
      {
        id: 'field-phone',
        type: 'text',
        label: 'Phone Number',
        helpText: 'Please include country code if applicable',
        required: false,
        order: 2,
        options: []
      },
      {
        id: 'field-message',
        type: 'paragraph',
        label: 'Message',
        helpText: 'What would you like to tell us?',
        required: false,
        order: 3,
        options: []
      }
    ]
  },
  {
    id: 'customer-feedback',
    title: 'Customer Feedback',
    description: 'Gather feedback about your products or services.',
    icon: <FaStar className="mb-3" size={32} />,
    color: '#f59e0b',
    featured: true,
    features: ['Progress Bar', 'Background Animations', 'Shareable Results'],
    fields: [
      {
        id: 'field-rating',
        type: 'multipleChoice',
        label: 'How would you rate our service?',
        helpText: 'Please select one option',
        required: true,
        order: 0,
        options: [
          { value: 'Excellent', label: 'Excellent' },
          { value: 'Good', label: 'Good' },
          { value: 'Average', label: 'Average' },
          { value: 'Poor', label: 'Poor' },
          { value: 'Very Poor', label: 'Very Poor' }
        ]
      },
      {
        id: 'field-recommend',
        type: 'multipleChoice',
        label: 'Would you recommend us to others?',
        helpText: '',
        required: true,
        order: 1,
        options: [
          { value: 'Definitely', label: 'Definitely' },
          { value: 'Probably', label: 'Probably' },
          { value: 'Not Sure', label: 'Not Sure' },
          { value: 'Probably Not', label: 'Probably Not' },
          { value: 'Definitely Not', label: 'Definitely Not' }
        ]
      },
      {
        id: 'field-mood',
        type: 'radio',
        label: 'How would you describe your mood after using our service?',
        helpText: 'This helps us understand your emotional response',
        required: true,
        order: 2,
        options: [
          { value: 'Very Happy 😊', label: 'Very Happy 😊' },
          { value: 'Satisfied 🙂', label: 'Satisfied 🙂' },
          { value: 'Neutral 😐', label: 'Neutral 😐' },
          { value: 'Disappointed 😕', label: 'Disappointed 😕' },
          { value: 'Frustrated 😔', label: 'Frustrated 😔' }
        ]
      },
      {
        id: 'field-improvements',
        type: 'paragraph',
        label: 'What improvements would you suggest?',
        helpText: 'Your feedback helps us improve',
        required: false,
        order: 3,
        options: []
      }
    ]
  },
  {
    id: 'event-registration',
    title: 'Event Registration',
    description: 'Register participants for your upcoming events.',
    icon: <FaClipboardList className="mb-3" size={32} />,
    color: '#10b981',
    features: ['Progress Bar', 'Completion Milestones', 'Shareable Results'],
    fields: [
      {
        id: 'field-name',
        type: 'text',
        label: 'Full Name',
        helpText: '',
        required: true,
        order: 0,
        options: []
      },
      {
        id: 'field-email',
        type: 'text',
        label: 'Email Address',
        helpText: 'We will send confirmation to this email',
        required: true,
        order: 1,
        options: []
      },
      {
        id: 'field-session',
        type: 'multipleChoice',
        label: 'Which session will you attend?',
        helpText: 'Please select one',
        required: true,
        order: 2,
        options: [
          { value: 'Morning', label: 'Morning Session (9AM-12PM)' },
          { value: 'Afternoon', label: 'Afternoon Session (1PM-4PM)' },
          { value: 'Evening', label: 'Evening Session (6PM-9PM)' }
        ]
      },
      {
        id: 'field-requirements',
        type: 'paragraph',
        label: 'Special Requirements',
        helpText: 'Dietary restrictions, accessibility needs, etc.',
        required: false,
        order: 3,
        options: []
      }
    ]
  },
  {
    id: 'survey',
    title: 'General Survey',
    description: 'A versatile survey template with various question types.',
    icon: <FaClipboardCheck className="mb-3" size={32} />,
    color: '#ec4899',
    featured: true,
    features: ['Progress Bar', 'Completion Milestones', 'Background Animations', 'Shareable Results'],
    fields: [
      {
        id: 'field-age',
        type: 'dropdown',
        label: 'Age Group',
        helpText: '',
        required: true,
        order: 0,
        options: [
          { value: '18-24', label: '18-24 years' },
          { value: '25-34', label: '25-34 years' },
          { value: '35-44', label: '35-44 years' },
          { value: '45-54', label: '45-54 years' },
          { value: '55+', label: '55+ years' }
        ]
      },
      {
        id: 'field-gender',
        type: 'multipleChoice',
        label: 'Gender',
        helpText: '',
        required: true,
        order: 1,
        options: [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Non-binary', label: 'Non-binary' },
          { value: 'Prefer not to say', label: 'Prefer not to say' }
        ]
      }
    ]
  }
];

const FormTemplates = ({ filter, onSelectTemplate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Update filter when prop changes
  useEffect(() => {
    if (filter) {
      setActiveFilter(filter);
    }
  }, [filter]);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const handleConfirmTemplate = () => {
    if (selectedTemplate && onSelectTemplate) {
      onSelectTemplate(selectedTemplate);
    }
    setShowModal(false);
  };

  // Filter templates based on selected filter
  const filteredTemplates = activeFilter === 'all' 
    ? TEMPLATES 
    : activeFilter === 'featured' 
      ? TEMPLATES.filter(template => template.featured) 
      : TEMPLATES.filter(template => template.features && template.features.includes(activeFilter));

  // Template card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Custom styles as inline styles
  const customStyles = {
    templateHeader: {
      marginBottom: '20px'
    },
    filterButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
    },
    filterBtn: {
      borderRadius: '20px',
      fontSize: '0.9rem'
    },
    templateCard: {
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      cursor: 'pointer'
    },
    templateIconContainer: {
      transition: 'all 0.3s ease',
      width: '70px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    featureBadge: {
      fontWeight: 'normal',
      fontSize: '0.7rem',
      backgroundColor: 'rgba(74, 108, 247, 0.1)',
      color: '#4a6cf7'
    },
    useTemplateBtn: {
      borderRadius: '20px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      width: '100%'
    },
    featureList: {
      paddingLeft: '0',
      listStyleType: 'none'
    },
    featureItem: {
      padding: '4px 0'
    },
    featureIcon: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      textAlign: 'center',
      lineHeight: '20px',
      backgroundColor: '#eaf3ff',
      color: '#4a6cf7',
      borderRadius: '50%',
      marginRight: '8px',
      fontWeight: 'bold',
      fontSize: '0.8rem'
    }
  };

  return (
    <div>
      <div style={customStyles.templateHeader}>
        <h4 className="mb-3">Choose a template to get started</h4>
        
        <div style={customStyles.filterButtons} className="mb-4">
          <Button 
            variant={activeFilter === 'all' ? 'primary' : 'outline-primary'} 
            style={customStyles.filterBtn}
            onClick={() => setActiveFilter('all')}
          >
            All Templates
          </Button>
          <Button 
            variant={activeFilter === 'featured' ? 'primary' : 'outline-primary'} 
            style={customStyles.filterBtn}
            onClick={() => setActiveFilter('featured')}
          >
            Featured
          </Button>
          <Button 
            variant={activeFilter === 'Progress Bar' ? 'primary' : 'outline-primary'} 
            style={customStyles.filterBtn}
            onClick={() => setActiveFilter('Progress Bar')}
          >
            <FaChartBar className="me-1" /> Progress Bar
          </Button>
          <Button 
            variant={activeFilter === 'Completion Milestones' ? 'primary' : 'outline-primary'} 
            style={customStyles.filterBtn}
            onClick={() => setActiveFilter('Completion Milestones')}
          >
            <FaTrophy className="me-1" /> Milestones
          </Button>
          <Button 
            variant={activeFilter === 'Shareable Results' ? 'primary' : 'outline-primary'} 
            style={customStyles.filterBtn}
            onClick={() => setActiveFilter('Shareable Results')}
          >
            <FaShareAlt className="me-1" /> Shareable Results
          </Button>
        </div>
      </div>
      
      <Row className="g-3">
        {filteredTemplates.map((template, index) => (
          <Col lg={4} md={6} sm={12} key={template.id}>
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card 
                className="h-100 border-0 shadow-sm" 
                style={customStyles.templateCard}
                onClick={() => handleTemplateClick(template)}
              >
                {template.featured && (
                  <div className="featured-badge">
                    <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
                      Featured
                    </Badge>
                  </div>
                )}
                
                <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                  <div 
                    className="rounded-circle mb-3"
                    style={{
                      ...customStyles.templateIconContainer,
                      backgroundColor: `${template.color}20`,
                      color: template.color
                    }}
                  >
                    {template.icon}
                  </div>
                  <Card.Title>{template.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {template.description}
                  </Card.Text>
                  
                  {/* Features badges */}
                  <div className="mb-3">
                    {template.features?.map((feature, idx) => (
                      <Badge 
                        key={idx} 
                        pill 
                        bg="light" 
                        text="dark" 
                        className="me-1 mb-1"
                        style={customStyles.featureBadge}
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-3">
                    <Button 
                      variant="outline-primary"
                      style={{
                        ...customStyles.useTemplateBtn,
                        borderColor: template.color,
                        color: template.color
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = template.color;
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = template.color;
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Confirmation Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton style={{ 
          background: selectedTemplate ? `linear-gradient(135deg, ${selectedTemplate.color}, ${selectedTemplate.color}AA)` : '',
          color: 'white'
        }}>
          <Modal.Title>Use Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTemplate && (
            <>
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    backgroundColor: `${selectedTemplate.color}20`,
                    color: selectedTemplate.color
                  }}
                >
                  {selectedTemplate.icon}
                </div>
                <div>
                  <h5 className="mb-0">{selectedTemplate.title}</h5>
                  <p className="text-muted mb-0 small">{selectedTemplate.description}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="mb-2">This template includes:</p>
                <ul style={customStyles.featureList}>
                  {selectedTemplate.features.map((feature, idx) => (
                    <li key={idx} style={customStyles.featureItem}>
                      <span style={customStyles.featureIcon}>✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <p>Are you sure you want to use this template? This will pre-populate your form with {selectedTemplate.fields.length} questions.</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmTemplate}
            style={{ 
              backgroundColor: selectedTemplate ? selectedTemplate.color : '',
              borderColor: selectedTemplate ? selectedTemplate.color : ''
            }}
          >
            Use Template
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FormTemplates;