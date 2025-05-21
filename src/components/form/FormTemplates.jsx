// src/components/form/FormTemplates.jsx
import React, { useState } from 'react';
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
    id: 'product-order',
    title: 'Product Order Form',
    description: 'Allow customers to place orders for your products.',
    icon: <FaShoppingCart className="mb-3" size={32} />,
    color: '#ef4444',
    features: ['Progress Bar', 'Completion Milestones'],
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
        helpText: '',
        required: true,
        order: 1,
        options: []
      },
      {
        id: 'field-address',
        type: 'paragraph',
        label: 'Delivery Address',
        helpText: 'Include street, city, state, zip code',
        required: true,
        order: 2,
        options: []
      },
      {
        id: 'field-product',
        type: 'dropdown',
        label: 'Select Product',
        helpText: '',
        required: true,
        order: 3,
        options: [
          { value: 'Product A', label: 'Product A - $29.99' },
          { value: 'Product B', label: 'Product B - $39.99' },
          { value: 'Product C', label: 'Product C - $49.99' },
          { value: 'Product D', label: 'Product D - $59.99' }
        ]
      },
      {
        id: 'field-quantity',
        type: 'text',
        label: 'Quantity',
        helpText: 'How many units do you want to order?',
        required: true,
        order: 4,
        options: []
      }
    ]
  },
  {
    id: 'job-application',
    title: 'Job Application',
    description: 'Accept applications for open positions.',
    icon: <FaFileAlt className="mb-3" size={32} />,
    color: '#8b5cf6',
    featured: true,
    features: ['Progress Bar', 'Completion Milestones', 'Background Animations', 'Shareable Results'],
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
        helpText: '',
        required: true,
        order: 1,
        options: []
      },
      {
        id: 'field-phone',
        type: 'text',
        label: 'Phone Number',
        helpText: '',
        required: true,
        order: 2,
        options: []
      },
      {
        id: 'field-position',
        type: 'dropdown',
        label: 'Position Applied For',
        helpText: '',
        required: true,
        order: 3,
        options: [
          { value: 'Developer', label: 'Software Developer' },
          { value: 'Designer', label: 'UI/UX Designer' },
          { value: 'Marketing', label: 'Marketing Specialist' },
          { value: 'Sales', label: 'Sales Representative' }
        ]
      },
      {
        id: 'field-experience',
        type: 'paragraph',
        label: 'Relevant Experience',
        helpText: 'Please describe your relevant work experience',
        required: true,
        order: 4,
        options: []
      },
      {
        id: 'field-start-date',
        type: 'text',
        label: 'Available Start Date',
        helpText: '',
        required: true,
        order: 5,
        options: []
      }
    ]
  },
  {
    id: 'course-evaluation',
    title: 'Course Evaluation',
    description: 'Collect feedback about courses or workshops.',
    icon: <FaGraduationCap className="mb-3" size={32} />,
    color: '#06b6d4',
    features: ['Progress Bar', 'Background Animations'],
    fields: [
      {
        id: 'field-course',
        type: 'dropdown',
        label: 'Course Name',
        helpText: '',
        required: true,
        order: 0,
        options: [
          { value: 'Course A', label: 'Introduction to Programming' },
          { value: 'Course B', label: 'Web Development Basics' },
          { value: 'Course C', label: 'Advanced Data Structures' },
          { value: 'Course D', label: 'UI/UX Design Principles' }
        ]
      },
      {
        id: 'field-instructor',
        type: 'text',
        label: 'Instructor Name',
        helpText: '',
        required: true,
        order: 1,
        options: []
      },
      {
        id: 'field-content-rating',
        type: 'multipleChoice',
        label: 'How would you rate the course content?',
        helpText: '',
        required: true,
        order: 2,
        options: [
          { value: '5', label: 'Excellent' },
          { value: '4', label: 'Good' },
          { value: '3', label: 'Average' },
          { value: '2', label: 'Below Average' },
          { value: '1', label: 'Poor' }
        ]
      },
      {
        id: 'field-instructor-rating',
        type: 'multipleChoice',
        label: 'How would you rate the instructor?',
        helpText: '',
        required: true,
        order: 3,
        options: [
          { value: '5', label: 'Excellent' },
          { value: '4', label: 'Good' },
          { value: '3', label: 'Average' },
          { value: '2', label: 'Below Average' },
          { value: '1', label: 'Poor' }
        ]
      },
      {
        id: 'field-mood',
        type: 'radio',
        label: 'How do you feel after completing this course?',
        helpText: '',
        required: true,
        order: 4,
        options: [
          { value: 'Confident 😊', label: 'Confident 😊' },
          { value: 'Satisfied 🙂', label: 'Satisfied 🙂' },
          { value: 'Neutral 😐', label: 'Neutral 😐' },
          { value: 'Confused 😕', label: 'Confused 😕' },
          { value: 'Overwhelmed 😔', label: 'Overwhelmed 😔' }
        ]
      },
      {
        id: 'field-feedback',
        type: 'paragraph',
        label: 'Additional Comments',
        helpText: 'Please provide any additional feedback about the course',
        required: false,
        order: 5,
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
      },
      {
        id: 'field-interests',
        type: 'checkboxes',
        label: 'What are your interests?',
        helpText: 'Select all that apply',
        required: true,
        order: 2,
        options: [
          { value: 'Technology', label: 'Technology' },
          { value: 'Sports', label: 'Sports' },
          { value: 'Reading', label: 'Reading' },
          { value: 'Travel', label: 'Travel' },
          { value: 'Arts', label: 'Arts' },
          { value: 'Other', label: 'Other' }
        ]
      },
      {
        id: 'field-how-often',
        type: 'multipleChoice',
        label: 'How often do you use our product?',
        helpText: '',
        required: true,
        order: 3,
        options: [
          { value: 'Daily', label: 'Daily' },
          { value: 'Weekly', label: 'Weekly' },
          { value: 'Monthly', label: 'Monthly' },
          { value: 'Rarely', label: 'Rarely' },
          { value: 'Never', label: 'Never' }
        ]
      },
      {
        id: 'field-mood',
        type: 'radio',
        label: 'How do you feel about filling out this survey?',
        helpText: '',
        required: true,
        order: 4,
        options: [
          { value: 'Happy 😊', label: 'Happy 😊' },
          { value: 'Neutral 😐', label: 'Neutral 😐' },
          { value: 'Bored 😴', label: 'Bored 😴' },
          { value: 'Annoyed 😒', label: 'Annoyed 😒' }
        ]
      },
      {
        id: 'field-feedback',
        type: 'paragraph',
        label: 'Any other feedback?',
        helpText: 'We value your opinion',
        required: false,
        order: 5,
        options: []
      }
    ]
  }
];

const FormTemplates = ({ onSelectTemplate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filter, setFilter] = useState('all');

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
  const filteredTemplates = filter === 'all' 
    ? TEMPLATES 
    : filter === 'featured' 
      ? TEMPLATES.filter(template => template.featured) 
      : TEMPLATES.filter(template => template.features.includes(filter));

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

  return (
    <>
      <div className="templates-header">
        <h4 className="mb-3">Choose a template to get started</h4>
        
        <div className="filter-buttons mb-4">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline-primary'} 
            className="filter-btn"
            onClick={() => setFilter('all')}
          >
            All Templates
          </Button>
          <Button 
            variant={filter === 'featured' ? 'primary' : 'outline-primary'} 
            className="filter-btn"
            onClick={() => setFilter('featured')}
          >
            Featured
          </Button>
          <Button 
            variant={filter === 'Progress Bar' ? 'primary' : 'outline-primary'} 
            className="filter-btn"
            onClick={() => setFilter('Progress Bar')}
          >
            <FaChartBar className="me-1" /> Progress Bar
          </Button>
          <Button 
            variant={filter === 'Completion Milestones' ? 'primary' : 'outline-primary'} 
            className="filter-btn"
            onClick={() => setFilter('Completion Milestones')}
          >
            <FaTrophy className="me-1" /> Milestones
          </Button>
          <Button 
            variant={filter === 'Shareable Results' ? 'primary' : 'outline-primary'} 
            className="filter-btn"
            onClick={() => setFilter('Shareable Results')}
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
                className="h-100 border-0 shadow-sm template-card" 
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
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
                    className="template-icon-container rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{ 
                      width: '70px', 
                      height: '70px', 
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
                  <div className="template-features mb-3">
                    {template.features?.map((feature, idx) => (
                      <Badge 
                        key={idx} 
                        pill 
                        bg="light" 
                        text="dark" 
                        className="me-1 mb-1 feature-badge"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-3">
                    <Button 
                      variant="outline-primary" 
                      className="w-100 use-template-btn"
                      style={{ 
                        borderColor: template.color,
                        color: template.color,
                        '--template-color': template.color
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
                  className="template-icon-container rounded-circle d-flex align-items-center justify-content-center me-3"
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
              
              <div className="template-details mb-3">
                <p className="mb-2">This template includes:</p>
                <ul className="feature-list">
                  {selectedTemplate.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <span className="feature-icon">✓</span> {feature}
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

      <style jsx>{`
        .templates-header {
          margin-bottom: 20px;
        }
        
        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .filter-btn {
          border-radius: 20px;
          font-size: 0.9rem;
        }
        
        .template-card {
          border-radius: 12px;
          transition: all 0.3s ease !important;
          overflow: hidden;
        }
        
        .template-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
        }
        
        .template-icon-container {
          transition: all 0.3s ease;
        }
        
        .template-card:hover .template-icon-container {
          transform: scale(1.1);
        }
        
        .feature-badge {
          font-weight: normal;
          font-size: 0.7rem;
          background-color: rgba(74, 108, 247, 0.1);
          color: #4a6cf7;
        }
        
        .use-template-btn {
          border-radius: 20px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .use-template-btn:hover {
          color: white !important;
          background-color: var(--template-color);
        }
        
        .feature-list {
          padding-left: 0;
          list-style-type: none;
        }
        
        .feature-item {
          padding: 4px 0;
        }
        
        .feature-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          background-color: #eaf3ff;
          color: #4a6cf7;
          border-radius: 50%;
          margin-right: 8px;
          font-weight: bold;
          font-size: 0.8rem;
        }
        
        @media (max-width: 768px) {
          .filter-buttons {
            justify-content: center;
          }
          
          .filter-btn {
            font-size: 0.8rem;
            padding: 0.375rem 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default FormTemplates;