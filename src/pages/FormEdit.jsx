// src/pages/FormEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSave, FaTimes, FaPlus, FaTrash, FaArrowLeft, FaEye, FaUpload, FaTools } from 'react-icons/fa';
import { useFormStore } from '../context/FormStore.jsx';
import api from '../services/api';

const FormEdit = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { fetchFormById, updateForm, publishForm } = useFormStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished: false,
  });
  const [originalForm, setOriginalForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
        
        setOriginalForm(loadedForm);
        setFormData({
          title: loadedForm.title || '',
          description: loadedForm.description || '',
          isPublished: loadedForm.isPublished || false,
        });
      } catch (err) {
        console.error("Error loading form:", err);
        setError("Failed to load form. The form may not exist or you don't have permission to edit it.");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleIsPublishedChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      isPublished: e.target.checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        isPublished: formData.isPublished,
        published: formData.isPublished, // Alternative field name
        status: formData.isPublished ? 'published' : 'draft', // Alternative field format
      };
      
      console.log("Updating form with data:", dataToSubmit);
      
      const updatedForm = await updateForm(formId, dataToSubmit);
      console.log("Form updated:", updatedForm);
      
      setSuccess("Form updated successfully");
      
      // If the form should be published but wasn't published during update, publish it explicitly
      if (formData.isPublished && !updatedForm.isPublished) {
        await handlePublish();
      }
    } catch (err) {
      console.error("Error updating form:", err);
      setError(err.response?.data?.message || "Failed to update form. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    setError(null);
    setSuccess(null);
    
    try {
      await publishForm(formId);
      console.log("Form published successfully");
      
      // Update local state
      setFormData(prev => ({ ...prev, isPublished: true }));
      setSuccess("Form published successfully");
    } catch (err) {
      console.error("Error publishing form:", err);
      setError("Failed to publish form. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancel = () => {
    navigate(`/forms`);
  };

  const handlePreview = () => {
    navigate(`/forms/${formId}/view`);
  };

  // New function to navigate to form builder
  const handleOpenInBuilder = () => {
    navigate(`/forms/builder/${formId}`);
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

  if (error && !originalForm) {
    return (
      <Container className="py-5">
        <Card className="shadow">
          <Card.Body className="p-4 text-center">
            <div className="mb-4 text-danger">
              <FaTimes size={48} />
            </div>
            <h3 className="mb-3">Form Not Found</h3>
            <p className="text-muted mb-4">{error}</p>
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
        <div className="d-flex gap-2">
          <Button 
            variant="link" 
            className="px-0" 
            onClick={() => navigate('/forms')}
          >
            <FaArrowLeft className="me-2" /> Back to Forms
          </Button>
          <span className="text-muted mx-2">|</span>
          <Button 
            variant="link" 
            className="px-0 text-primary" 
            onClick={handleOpenInBuilder}
          >
            <FaTools className="me-2" /> Edit in Form Builder
          </Button>
        </div>
      </div>
      <h2 className="mb-4">Edit Form Properties</h2>

      <Card className="shadow-sm">
        <Card.Body className="p-4">
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          {/* ADDED: New alert for form builder */}
          <Alert variant="info" className="mb-4">
            <div className="d-flex align-items-center">
              <FaTools className="me-3" size={24} />
              <div>
                <h5 className="mb-1">Want to edit form fields?</h5>
                <p className="mb-2">Use the Form Builder to add, remove, or modify form fields.</p>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleOpenInBuilder}
                >
                  <FaTools className="me-2" /> Open in Form Builder
                </Button>
              </div>
            </div>
          </Alert>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Form Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a descriptive title"
                required
                className="form-control-lg"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about the purpose of this form"
                className="form-control-md"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Publication Status</Form.Label>
              <Form.Check
                type="switch"
                id="publishSwitch"
                label={formData.isPublished ? "Form is published and available to users" : "Form is saved as a draft"}
                checked={formData.isPublished}
                onChange={handleIsPublishedChange}
              />
              <Form.Text className="text-muted mt-2">
                {formData.isPublished 
                  ? "Your form is published and available for users to fill out." 
                  : "Your form is saved as a draft. Publish it to make it available to users."}
              </Form.Text>
            </Form.Group>

            <hr className="my-4" />

            <div className="d-flex flex-wrap justify-content-between gap-2">
              <div>
                <Button
                  variant="outline-secondary"
                  onClick={handleCancel}
                  className="d-flex align-items-center me-2"
                  type="button"
                >
                  <FaTimes className="me-2" /> Cancel
                </Button>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant="outline-info"
                  onClick={handlePreview}
                  className="d-flex align-items-center"
                  type="button"
                >
                  <FaEye className="me-2" /> Preview
                </Button>
                
                {!formData.isPublished && (
                  <Button
                    variant="success"
                    onClick={handlePublish}
                    className="d-flex align-items-center"
                    type="button"
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" /> Publish
                      </>
                    )}
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="d-flex align-items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormEdit;