// src/components/forms/CreateForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaTimes, FaPlus, FaRegFileAlt } from "react-icons/fa";
import { useFormStore } from "../../context/FormStore.jsx";
import api from "../../services/api";

function CreateForm() {
  const { createForm, publishForm } = useFormStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished: false,
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
    setIsSubmitting(true);
    setError(null);

    try {
      const dataToSubmit = { 
        title: formData.title,
        description: formData.description,
        isPublished: formData.isPublished,
        published: formData.isPublished, // Try alternative field name
        status: formData.isPublished ? 'published' : 'draft', // Try status field
      };
      
      console.log("Submitting form data:", dataToSubmit);
      
      // Create the form
      let createdForm;
      try {
        // First try using the store method
        createdForm = await createForm(dataToSubmit);
      } catch (storeError) {
        console.error("Store createForm failed:", storeError);
        // Fall back to direct API call if the store method fails
        const response = await api.post('/forms', dataToSubmit);
        createdForm = response.data?.data?.form || response.data?.data || response.data || {};
      }
      
      console.log("Form created:", createdForm);
      
      // If the form should be published but wasn't published during creation, publish it explicitly
      const formId = createdForm.id || createdForm._id;
      if (formData.isPublished && !createdForm.isPublished && formId) {
        console.log("Form created but not published, attempting explicit publish...");
        try {
          await publishForm(formId);
          console.log("Form published successfully after creation");
        } catch (publishError) {
          console.error("Failed to publish form after creation:", publishError);
          // Continue anyway, we'll just navigate to the forms list
        }
      }
      
      // Navigate to the forms list
      navigate('/forms');
    } catch (error) {
      console.error('Error creating form:', error);
      setError(error.response?.data?.message || 'Failed to create form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <div className="d-flex align-items-center mb-4">
            <FaRegFileAlt className="text-primary me-2" size={24} />
            <h2 className="mb-0">Create New Form</h2>
          </div>

          <Card className="shadow-sm">
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

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
                    label={formData.isPublished ? "Form will be published immediately" : "Form will be saved as draft"}
                    checked={formData.isPublished}
                    onChange={handleIsPublishedChange}
                  />
                  <Form.Text className="text-muted mt-2">
                    {formData.isPublished 
                      ? "Your form will be published and available for users to fill out immediately." 
                      : "Your form will be saved as a draft. You can publish it later."}
                  </Form.Text>
                </Form.Group>

                <hr className="my-4" />

                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/forms')}
                    className="d-flex align-items-center"
                    type="button"
                  >
                    <FaTimes className="me-2" /> Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    className="d-flex align-items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaPlus className="me-2" /> Create
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <small className="text-muted">
              After creating your form, you'll be able to add fields and customize it further.
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateForm;