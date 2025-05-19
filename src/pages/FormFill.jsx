// src/pages/FormFill.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form as BootstrapForm } from 'react-bootstrap';
import { FaArrowLeft, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';
import { useFormStore } from '../context/FormStore.jsx';
import api from '../services/api';

const FormFill = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { fetchFormById } = useFormStore();
  
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load form data when component mounts
  useEffect(() => {
    const loadForm = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const loadedForm = await fetchFormById(formId);
        console.log("Loaded form for filling:", loadedForm);
        
        if (!loadedForm) {
          setError("Form not found. It may have been deleted or you don't have permission to access it.");
          setIsLoading(false);
          return;
        }
        
        if (!loadedForm.isPublished) {
          setError("This form is not published yet and cannot be filled.");
          setIsLoading(false);
          return;
        }
        
        setForm(loadedForm);
        
        // Initialize form data with empty values
        const initialData = {};
        if (loadedForm.fields && loadedForm.fields.length > 0) {
          loadedForm.fields.forEach(field => {
            initialData[field.id] = '';
          });
        }
        setFormData(initialData);
      } catch (err) {
        console.error("Error loading form:", err);
        setError("There was a problem loading this form. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadForm();
  }, [formId, fetchFormById]);

  // Handle form input changes
  const handleChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log("Submitting form response:", formData);
      
      // Submit the form response
      const response = await api.post(`/forms/${formId}/responses`, {
        responses: formData
      });
      
      console.log("Form submission successful:", response);
      setSuccess("Thank you! Your response has been submitted successfully.");
      
      // Clear form data after successful submission
      const initialData = {};
      if (form.fields && form.fields.length > 0) {
        form.fields.forEach(field => {
          initialData[field.id] = '';
        });
      }
      setFormData(initialData);
      
      // Optionally, you can redirect to a thank you page
      // navigate('/thank-you');
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("There was a problem submitting your response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading form...</span>
        </Spinner>
        <p className="mt-3">Loading form...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body className="p-4 text-center">
            <div className="mb-4 text-danger">
              <FaExclamationTriangle size={48} />
            </div>
            <h3 className="mb-3">Form Error</h3>
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
            <Button 
              variant="primary" 
              onClick={() => navigate('/')}
            >
              <FaArrowLeft className="me-2" /> Return to Home
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body className="p-4 text-center">
            <h3 className="mb-3">Form Not Found</h3>
            <p className="text-muted mb-4">The form you're looking for cannot be found.</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/')}
            >
              <FaArrowLeft className="me-2" /> Return to Home
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Header className="bg-success text-white">
            <h3 className="mb-0">Form Submitted</h3>
          </Card.Header>
          <Card.Body className="p-4 text-center">
            <div className="mb-4 text-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            </div>
            <h3 className="mb-3">Thank You!</h3>
            <p className="mb-4">{form.confirmationMessage || "Your response has been submitted successfully."}</p>
            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="primary" 
                onClick={() => setSuccess(null)}
              >
                Submit Another Response
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h2 className="mb-0">{form.title}</h2>
        </Card.Header>
        <Card.Body className="p-4">
          {form.description && (
            <p className="mb-4">{form.description}</p>
          )}
          
          {(!form.fields || form.fields.length === 0) ? (
            <Alert variant="info" className="mb-0">
              <div className="d-flex align-items-center">
                <FaExclamationTriangle className="me-3" size={24} />
                <div>
                  <h5 className="mb-1">This form doesn't have any fields yet</h5>
                  <p className="mb-0">The form creator needs to add questions before you can submit a response.</p>
                </div>
              </div>
            </Alert>
          ) : (
            <BootstrapForm onSubmit={handleSubmit}>
              {form.fields.map((field, index) => (
                <BootstrapForm.Group key={field.id} className="mb-4">
                  <BootstrapForm.Label>
                    {field.label}
                    {field.required && <span className="text-danger ms-1">*</span>}
                  </BootstrapForm.Label>
                  
                  {field.helpText && (
                    <div className="text-muted small mb-2">{field.helpText}</div>
                  )}
                  
                  {renderField(field, formData[field.id], (value) => handleChange(field.id, value))}
                </BootstrapForm.Group>
              ))}
              
              <div className="d-grid gap-2 mt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  disabled={isSubmitting || !form.fields || form.fields.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="me-2" /> Submit
                    </>
                  )}
                </Button>
              </div>
            </BootstrapForm>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

// Helper function to render the appropriate field based on type
const renderField = (field, value, onChange) => {
  switch(field.type) {
    case 'text':
      return (
        <BootstrapForm.Control
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || 'Your answer'}
          required={field.required}
        />
      );
      
    case 'paragraph':
      return (
        <BootstrapForm.Control
          as="textarea"
          rows={4}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || 'Your answer'}
          required={field.required}
        />
      );
      
    case 'email':
      return (
        <BootstrapForm.Control
          type="email"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || 'name@example.com'}
          required={field.required}
        />
      );
      
    case 'number':
      return (
        <BootstrapForm.Control
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || 'Enter a number'}
          required={field.required}
          min={field.min}
          max={field.max}
        />
      );
      
    case 'date':
      return (
        <BootstrapForm.Control
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );
      
    case 'multipleChoice':
      return (
        <div>
          {field.options && field.options.map((option, idx) => (
            <BootstrapForm.Check
              key={idx}
              type="radio"
              id={`${field.id}-option-${idx}`}
              name={field.id}
              label={option.label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
            />
          ))}
        </div>
      );
      
    case 'checkboxes':
      return (
        <div>
          {field.options && field.options.map((option, idx) => (
            <BootstrapForm.Check
              key={idx}
              type="checkbox"
              id={`${field.id}-option-${idx}`}
              label={option.label}
              checked={Array.isArray(value) ? value.includes(option.value) : false}
              onChange={(e) => {
                const currentValue = Array.isArray(value) ? [...value] : [];
                if (e.target.checked) {
                  onChange([...currentValue, option.value]);
                } else {
                  onChange(currentValue.filter(v => v !== option.value));
                }
              }}
              required={field.required && Array.isArray(value) && value.length === 0}
            />
          ))}
        </div>
      );
      
    case 'dropdown':
      return (
        <BootstrapForm.Select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        >
          <option value="">Select an option</option>
          {field.options && field.options.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </BootstrapForm.Select>
      );
      
    default:
      return (
        <BootstrapForm.Control
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer"
          required={field.required}
        />
      );
  }
};

export default FormFill;