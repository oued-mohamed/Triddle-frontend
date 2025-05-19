// src/pages/FormView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaEdit, FaArrowLeft, FaUpload, FaEye, FaShare, FaExclamationTriangle, FaPlus, FaTools } from 'react-icons/fa';
import { useFormStore } from '../context/FormStore.jsx';
import api from '../services/api';

const FormView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { fetchFormById, publishForm } = useFormStore();
  
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load form data when component mounts
  useEffect(() => {
    const loadForm = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const loadedForm = await fetchFormById(formId);
        console.log("Loaded form:", loadedForm);
        setForm(loadedForm);
      } catch (err) {
        console.error("Error loading form:", err);
        setError("Failed to load form. The form may not exist or you don't have permission to view it.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (formId) {
      loadForm();
    } else {
      setError("No form ID provided");
      setIsLoading(false);
    }
  }, [formId, fetchFormById]);

  const handlePublish = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    setError(null);
    setSuccess(null);
    
    try {
      await publishForm(formId);
      console.log("Form published successfully");
      
      // Update local state
      setForm(prev => prev ? { ...prev, isPublished: true } : null);
      setSuccess("Form published successfully");
    } catch (err) {
      console.error("Error publishing form:", err);
      setError("Failed to publish form. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // UPDATED: Changed to redirect to form builder
  const handleEdit = () => {
    navigate(`/forms/builder/${formId}`);
  };

  // Function to edit form properties (metadata only)
  const handleEditProperties = () => {
    navigate(`/forms/${formId}/edit`);
  };

  const handleFill = () => {
    navigate(`/forms/${formId}/fill`);
  };

  const handleCopyLink = () => {
    const formUrl = `${window.location.origin}/forms/${formId}/fill`;
    navigator.clipboard.writeText(formUrl)
      .then(() => {
        setSuccess("Form link copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
        setError("Failed to copy link to clipboard");
      });
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

  if (error || !form) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body className="p-4 text-center">
            <h3 className="mb-3">Form Not Found</h3>
            <p className="text-muted mb-4">{error || "The requested form could not be loaded."}</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/forms')}
            >
              <FaArrowLeft className="me-2" /> Back to Forms
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center mb-4">
        <Button 
          variant="link" 
          className="px-0 me-3" 
          onClick={() => navigate('/forms')}
        >
          <FaArrowLeft className="me-2" /> Back to Forms
        </Button>
        <h2 className="mb-0">Form Preview</h2>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)} className="mb-4">
          {success}
        </Alert>
      )}

      <Card className="shadow-sm mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light py-3">
          <div className="d-flex align-items-center">
            <h3 className="mb-0 me-3">{form.title || "Untitled Form"}</h3>
            <Badge bg={form.isPublished ? "success" : "secondary"}>
              {form.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
          <div className="d-flex gap-2">
            {/* UPDATED: Changed Edit button to use Form Builder */}
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleEdit}
            >
              <FaTools className="me-1" /> Edit Form
            </Button>
            
            {form.isPublished ? (
              <Button 
                variant="outline-success" 
                size="sm" 
                onClick={handleFill}
              >
                <FaEye className="me-1" /> Fill Form
              </Button>
            ) : (
              <Button 
                variant="success" 
                size="sm" 
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-1" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FaUpload className="me-1" /> Publish
                  </>
                )}
              </Button>
            )}
            
            {form.isPublished && (
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={handleCopyLink}
              >
                <FaShare className="me-1" /> Copy Link
              </Button>
            )}
          </div>
        </Card.Header>
        
        <Card.Body className="p-4">
          <Row>
            <Col md={8}>
              <div className="mb-4">
                <h6 className="text-muted mb-2">Description</h6>
                <p>{form.description || "No description provided."}</p>
              </div>
              
              <div className="mb-4">
                <h6 className="text-muted mb-2">Form Details</h6>
                <ul className="list-unstyled">
                  <li><strong>Created:</strong> {form.createdAt ? new Date(form.createdAt).toLocaleString() : 'N/A'}</li>
                  <li><strong>Last Updated:</strong> {form.updatedAt ? new Date(form.updatedAt).toLocaleString() : 'N/A'}</li>
                  <li><strong>Status:</strong> {form.isPublished ? 'Published' : 'Draft'}</li>
                  <li><strong>Response Count:</strong> {form._count?.responses || 0}</li>
                </ul>
              </div>
            </Col>
            
            <Col md={4}>
              <Card className="bg-light">
                <Card.Body>
                  <h5 className="mb-3">Form Actions</h5>
                  <div className="d-grid gap-2">
                    {/* UPDATED: Split Edit into two options */}
                    <Button 
                      variant="outline-primary" 
                      onClick={handleEdit}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FaTools className="me-2" /> Edit Form Fields
                    </Button>
                    
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleEditProperties}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FaEdit className="me-2" /> Edit Properties
                    </Button>
                    
                    {form.isPublished ? (
                      <Button 
                        variant="success" 
                        onClick={handleFill}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FaEye className="me-2" /> Fill Form
                      </Button>
                    ) : (
                      <Button 
                        variant="success" 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="d-flex align-items-center justify-content-center"
                      >
                        {isPublishing ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <FaUpload className="me-2" /> Publish Form
                          </>
                        )}
                      </Button>
                    )}
                    
                    {form.isPublished && (
                      <Button 
                        variant="outline-secondary" 
                        onClick={handleCopyLink}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FaShare className="me-2" /> Copy Form Link
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <hr className="my-4" />
          
          <div className="form-preview">
            <h5 className="mb-3">Form Fields</h5>
            
            {/* New code for quick field creation section */}
            {!form.fields || form.fields.length === 0 ? (
              <div className="p-4 bg-light rounded mb-4">
                <div className="d-flex align-items-center mb-3">
                  <FaExclamationTriangle className="text-warning me-3" size={24} />
                  <h5 className="mb-0">This form doesn't have any fields yet</h5>
                </div>
                <p>Users won't be able to submit responses until you add questions to this form.</p>
                <Button 
                  variant="primary" 
                  onClick={handleEdit}
                  className="mt-2"
                >
                  <FaPlus className="me-2" /> Add Questions Now
                </Button>
              </div>
            ) : (
              <div className="form-fields">
                {form.fields.map((field, index) => (
                  <Card key={field.id || index} className="mb-3">
                    <Card.Body>
                      <h6>{field.label || `Field ${index + 1}`}</h6>
                      <p className="text-muted small mb-2">Type: {field.type || 'Text'}</p>
                      {field.helpText && <p className="text-muted small">{field.helpText}</p>}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormView;
              
