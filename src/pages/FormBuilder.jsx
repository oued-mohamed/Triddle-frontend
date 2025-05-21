// src/pages/FormBuilder.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner, Nav, InputGroup } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { FaSave, FaEye, FaPlus, FaCog, FaPalette, FaQuestionCircle, 
  FaGripVertical, FaCopy, FaTrash, FaArrowLeft, FaChartBar, FaTrophy, FaShareAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useFormStore } from '../context/FormStore';

// Import the FormTemplates component
import FormTemplates from '../components/form/FormTemplates';
import ProgressBar from '../components/common/ProgressBar';

const FormBuilder = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { fetchFormById, updateForm, createForm } = useFormStore();
  
  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    isPublished: false,
    fields: []
  });
  
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [templateFilter, setTemplateFilter] = useState('all');
  const [responseCount, setResponseCount] = useState(0); // Added to store response count

  // Stub function to handle missing response count API
  const getResponseCount = async (id) => {
    if (!id || id === 'new') return 0;
    
    try {
      // Return a default value of 0 to avoid 404 errors
      // When backend is updated later, this can be replaced with a real API call
      return 0;
    } catch (error) {
      console.error('Error fetching response count:', error);
      return 0;
    }
  };

  // Load form data when component mounts
  useEffect(() => {
    const loadForm = async () => {
      // Check if we're in create mode or edit mode
      const isCreateMode = !formId || formId === 'new';
      
      if (isCreateMode) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Loading form with ID:", formId);
        
        // Get response count (uses stub function to avoid 404 errors)
        const count = await getResponseCount(formId);
        setResponseCount(count);
        
        // First check if there's a draft in localStorage
        try {
          const savedDraft = localStorage.getItem(`formDraft_${formId}`);
          console.log("Found draft in localStorage?", Boolean(savedDraft));
          
          if (savedDraft) {
            const draftData = JSON.parse(savedDraft);
            console.log("Draft data from localStorage:", draftData);
            
            // If draft has fields, use those
            if (draftData.fields && Array.isArray(draftData.fields) && draftData.fields.length > 0) {
              console.log("Using fields from localStorage draft:", draftData.fields);
              
              setForm({
                ...draftData,
                fields: draftData.fields
              });
              
              if (draftData.fields.length > 0) {
                setSelectedFieldId(draftData.fields[0].id);
              }
              
              setIsLoading(false);
              return; // Exit early - we have the data we need
            }
          }
        } catch (err) {
          console.error("Error checking localStorage:", err);
        }
        
        // If no valid draft in localStorage, fetch from API
        console.log("Fetching form from API");
        try {
          const loadedForm = await fetchFormById(formId);
          console.log("API response:", loadedForm);
          
          // Standardize the data structure
          let formFields = [];
          
          // Check different possible formats for questions/fields
          if (loadedForm.questions && Array.isArray(loadedForm.questions) && loadedForm.questions.length > 0) {
            console.log("Using questions array from API:", loadedForm.questions);
            
            formFields = loadedForm.questions.map(question => ({
              id: question.id || question._id || uuidv4(),
              type: question.type || 'text',
              label: question.title || question.label || 'Untitled Question',
              helpText: question.description || question.helpText || '',
              required: question.isRequired || question.required || false,
              order: question.order || 0,
              options: question.options || [],
            }));
          } 
          else if (loadedForm.fields && Array.isArray(loadedForm.fields) && loadedForm.fields.length > 0) {
            console.log("Using fields array from API:", loadedForm.fields);
            formFields = loadedForm.fields;
          }
          
          console.log("Final processed fields:", formFields);
          
          // Set form with fields properly structured
          setForm({
            ...loadedForm,
            fields: formFields
          });
          
          // If there are fields, select the first one
          if (formFields.length > 0) {
            setSelectedFieldId(formFields[0].id);
          }
          
          // Save to localStorage for future use
          localStorage.setItem(`formDraft_${formId}`, JSON.stringify({
            ...loadedForm,
            fields: formFields
          }));
          
        } catch (apiErr) {
          console.error("Error fetching from API:", apiErr);
          setError("Failed to load form from the server. Please try again.");
        }
      } catch (err) {
        console.error("General error loading form:", err);
        setError("Failed to load form. The form may not exist or you don't have permission to edit it.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadForm();
  }, [formId, fetchFormById]);

  // Save form draft to localStorage when form changes
  useEffect(() => {
    if (formId && formId !== 'new' && form.fields) {
      console.log("Saving form draft to localStorage:", form);
      localStorage.setItem(`formDraft_${formId}`, JSON.stringify(form));
    }
  }, [formId, form]);

  // Handle saving form
  const handleSaveForm = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Make sure title is not empty
      if (!form.title || form.title.trim() === '') {
        setError("Form title is required");
        setIsSaving(false);
        return;
      }
      
      // Store the current fields before sending to backend
      const currentFields = [...(form.fields || [])];
      console.log("Current fields before save:", currentFields);
      
      // Make sure we have valid IDs for all fields
      currentFields.forEach(field => {
        if (!field.id) {
          field.id = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
      });
      
      // Map the fields to the expected question structure for the backend
      const mappedQuestions = currentFields.map((field, index) => ({
        id: field.id,
        title: field.label || `Question ${index + 1}`,
        type: field.type || 'text',
        description: field.helpText || '',
        isRequired: field.required || false,
        order: index, // Ensure order is sequential and valid
        options: field.options || [],
      }));
      
      // Create a copy of the form for saving, with properly formatted data
      const formToSave = {
        title: form.title.trim(),
        description: form.description || '',
        isPublished: form.isPublished || false,
        questions: mappedQuestions,
        // Include any other form properties your backend expects
        requireLogin: form.requireLogin || false,
        collectEmail: form.collectEmail || false,
        confirmationMessage: form.confirmationMessage || 'Thank you for your submission!'
      };
      
      console.log("Form data to save:", formToSave);
      
      // For existing forms
      if (formId && formId !== 'new') {
        try {
          // First, store the form data in localStorage to ensure we don't lose the fields
          localStorage.setItem(`formDraft_${formId}`, JSON.stringify({
            ...form,
            fields: currentFields
          }));
          
          console.log("Saved to localStorage before API call");
          
          // Then make the API call
          const updatedForm = await updateForm(formId, formToSave);
          
          console.log("API update successful:", updatedForm);
          
          // Update state with the data from backend, but keep our fields structure
          setForm(prev => ({
            ...updatedForm,
            fields: currentFields
          }));
          
          setSuccess("Form saved successfully");
        } catch (err) {
          console.error("Error updating form:", err);
          
          // More detailed error reporting
          if (err.response) {
            console.error("Server response:", err.response.data);
            setError(err.response.data?.message || "Failed to save form. Server error.");
          } else if (err.request) {
            setError("Failed to save form. No response from server.");
          } else {
            setError(`Failed to save form: ${err.message}`);
          }
        }
      } else {
        // For new forms
        try {
          // Create new form with more detailed logging
          console.log("Attempting to create new form with data:", formToSave);
          
          // Create form using the API
          const savedForm = await createForm(formToSave);
          console.log("New form created - API response:", savedForm);
          
          if (!savedForm) {
            throw new Error("No response from server when creating form");
          }
          
          const newFormId = savedForm.id || savedForm._id;
          
          if (newFormId) {
            // Store our version with the fields in localStorage
            const formToStore = {
              ...savedForm,
              fields: currentFields
            };
            
            console.log("Saving new form to localStorage:", formToStore);
            localStorage.setItem(`formDraft_${newFormId}`, JSON.stringify(formToStore));
            
            // Set the form with our preserved fields
            setForm(formToStore);
            
            // Redirect to edit the newly created form
            navigate(`/forms/builder/${newFormId}`, { replace: true });
            setSuccess("Form created successfully");
          } else {
            throw new Error("Created form has no ID");
          }
        } catch (err) {
          console.error("Error creating form:", err);
          
          // More detailed error reporting
          if (err.response) {
            console.error("Server response:", err.response.data);
            setError(err.response.data?.message || "Failed to create form. Server error.");
          } else if (err.request) {
            console.error("No response from server:", err.request);
            setError("Failed to create form. No response from server.");
          } else {
            console.error("Error message:", err.message);
            setError(`Failed to create form: ${err.message}`);
          }
          
          // Even if we failed to save to server, keep the form in local state
          // so the user doesn't lose their work
          localStorage.setItem('formDraft_temp', JSON.stringify({
            ...form,
            fields: currentFields
          }));
        }
      }
    } catch (err) {
      console.error("General error saving form:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle form field updates
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle adding a new field
  const handleAddField = (fieldType) => {
    const newField = {
      id: `field-${Date.now()}`,
      type: fieldType || 'text',
      label: `New ${fieldType || 'text'} question`,
      helpText: '',
      required: false,
      order: form.fields ? form.fields.length : 0,
      options: fieldType === 'multipleChoice' || fieldType === 'checkboxes' || fieldType === 'dropdown' 
        ? [{value: 'Option 1', label: 'Option 1'}] 
        : [],
    };
    
    console.log("Adding new field:", newField);
    
    setForm(prev => {
      const updatedForm = {
        ...prev,
        fields: [...(prev.fields || []), newField]
      };
      
      // Save to localStorage immediately when adding a field
      if (formId && formId !== 'new') {
        console.log("Saving form with new field to localStorage");
        localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedForm));
      }
      
      return updatedForm;
    });
    
    setSelectedFieldId(newField.id);
  };
  
  // Handle updating a field
  const handleFieldUpdate = (fieldId, updates) => {
    console.log("Updating field:", fieldId, updates);
    
    setForm(prev => {
      const updatedForm = {
        ...prev,
        fields: (prev.fields || []).map(field => 
          field.id === fieldId ? {...field, ...updates} : field
        )
      };
      
      // Save to localStorage immediately when updating a field
      if (formId && formId !== 'new') {
        console.log("Saving form with updated field to localStorage");
        localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedForm));
      }
      
      return updatedForm;
    });
  };
  
  // Handle deleting a field
  const handleDeleteField = (fieldId) => {
    console.log("Deleting field:", fieldId);
    const fields = form.fields || [];
    
    setForm(prev => {
      const updatedForm = {
        ...prev,
        fields: fields.filter(field => field.id !== fieldId)
      };
      
      // Save to localStorage immediately when deleting a field
      if (formId && formId !== 'new') {
        console.log("Saving form with deleted field to localStorage");
        localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedForm));
      }
      
      return updatedForm;
    });
    
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(fields.length > 1 
        ? fields.find(field => field.id !== fieldId)?.id 
        : null);
    }
  };
  
  // Handle duplicating a field
  const handleDuplicateField = (fieldId) => {
    const fields = form.fields || [];
    const fieldToDuplicate = fields.find(field => field.id === fieldId);
    
    if (fieldToDuplicate) {
      const duplicatedField = {
        ...fieldToDuplicate,
        id: `field-${Date.now()}`,
        label: `${fieldToDuplicate.label} (Copy)`,
        order: fields.length
      };
      
      console.log("Duplicating field:", fieldId, "New field:", duplicatedField);
      
      setForm(prev => {
        const updatedForm = {
          ...prev,
          fields: [...(prev.fields || []), duplicatedField]
        };
        
        // Save to localStorage immediately when duplicating a field
        if (formId && formId !== 'new') {
          console.log("Saving form with duplicated field to localStorage");
          localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedForm));
        }
        
        return updatedForm;
      });
      
      setSelectedFieldId(duplicatedField.id);
    }
  };
  
  // Get the currently selected field
  const selectedField = selectedFieldId && form.fields 
    ? form.fields.find(field => field.id === selectedFieldId) 
    : null;

  // Access fields safely with fallback to empty array
  const fields = form.fields || [];
  console.log("Current fields in render:", fields);

  // Template filter handler
  const handleTemplateFilter = (filter) => {
    setTemplateFilter(filter);
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading form builder...</span>
        </Spinner>
        <p className="mt-3">Loading form builder...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <div className="d-flex align-items-center">
          <Button 
            variant="link" 
            className="px-0 me-3" 
            onClick={() => navigate('/forms')}
          >
            <FaArrowLeft className="me-2" /> Back
          </Button>
          <div>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Form Title"
              className="form-control-lg border-0 shadow-none fw-bold"
              style={{ fontSize: '1.5rem' }}
            />
            <Form.Control
              type="text"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Form Description (optional)"
              className="border-0 shadow-none text-muted"
            />
          </div>
        </div>
        <div>
          {formId && formId !== 'new' && (
            <Button 
              variant="outline-primary" 
              className="me-2" 
              onClick={() => window.open(`/forms/${formId}/preview`, '_blank')}
              disabled={isSaving}
            >
              <FaEye className="me-2" /> Preview
            </Button>
          )}
          <Button 
            variant="primary" 
            onClick={handleSaveForm}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" /> Save
              </>
            )}
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mx-3 mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)} className="mx-3 mb-4">
          {success}
        </Alert>
      )}
      
      {/* Main Content */}
      <Row>
        {/* Left Sidebar - Navigation */}
        <Col md={2} className="border-end p-0">
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'builder'} 
                onClick={() => setActiveTab('builder')}
                className="rounded-0 border-0"
              >
                <FaQuestionCircle className="me-2" /> Questions
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'appearance'} 
                onClick={() => setActiveTab('appearance')}
                className="rounded-0 border-0"
              >
                <FaPalette className="me-2" /> Appearance
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
                className="rounded-0 border-0"
              >
                <FaCog className="me-2" /> Settings
              </Nav.Link>
            </Nav.Item>
          </Nav>
          
          {/* Field Type Selector (only visible in builder tab) */}
          {activeTab === 'builder' && (
            <div className="p-3 border-top">
              <h6 className="mb-3">Add Question</h6>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-secondary" 
                  className="text-start"
                  onClick={() => handleAddField('text')}
                >
                  Text Field
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="text-start"
                  onClick={() => handleAddField('paragraph')}
                >
                  Paragraph
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="text-start"
                  onClick={() => handleAddField('multipleChoice')}
                >
                  Multiple Choice
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="text-start"
                  onClick={() => handleAddField('checkboxes')}
                >
                  Checkboxes
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="text-start"
                  onClick={() => handleAddField('dropdown')}
                >
                  Dropdown
                </Button>
              </div>
            </div>
          )}
        </Col>
        
        {/* Center Column - Form Builder */}
        <Col md={7} className="pb-5 position-relative" style={{ minHeight: '80vh' }}>
          {activeTab === 'builder' && (
            <>
              <div className="p-3">
                {fields.length === 0 ? (
                  <div className="py-5 border rounded bg-light">
                    <div className="text-center mb-4">
                      <FaQuestionCircle size={48} className="text-muted mb-3" />
                      <h4>No questions yet</h4>
                      <p className="text-muted mb-4">You can add questions manually or use a template</p>
                    </div>
                    
                    <div className="px-4 pb-3">
                      <div className="mb-4">
                        <h5>Choose a template to get started</h5>
                        
                        {/* Template filters */}
                        <div className="filter-buttons mb-4 d-flex flex-wrap gap-2">
                          <Button 
                            variant={templateFilter === 'all' ? 'primary' : 'outline-primary'} 
                            className="filter-btn rounded-pill"
                            onClick={() => handleTemplateFilter('all')}
                          >
                            All Templates
                          </Button>
                          <Button 
                            variant={templateFilter === 'featured' ? 'primary' : 'outline-primary'} 
                            className="filter-btn rounded-pill"
                            onClick={() => handleTemplateFilter('featured')}
                          >
                            Featured
                          </Button>
                          <Button 
                            variant={templateFilter === 'Progress Bar' ? 'primary' : 'outline-primary'} 
                            className="filter-btn rounded-pill"
                            onClick={() => handleTemplateFilter('Progress Bar')}
                          >
                            <FaChartBar className="me-1" /> Progress Bar
                          </Button>
                          <Button 
                            variant={templateFilter === 'Milestones' ? 'primary' : 'outline-primary'} 
                            className="filter-btn rounded-pill"
                            onClick={() => handleTemplateFilter('Milestones')}
                          >
                            <FaTrophy className="me-1" /> Milestones
                          </Button>
                          <Button 
                            variant={templateFilter === 'Shareable Results' ? 'primary' : 'outline-primary'} 
                            className="filter-btn rounded-pill"
                            onClick={() => handleTemplateFilter('Shareable Results')}
                          >
                            <FaShareAlt className="me-1" /> Shareable Results
                          </Button>
                        </div>
                      </div>
                      
                      <FormTemplates 
                        filter={templateFilter}
                        onSelectTemplate={(template) => {
                          // Set form fields from template
                          const templateFields = template.fields.map(field => ({
                            ...field,
                            id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                          }));
                          
                          setForm(prev => {
                            const updatedForm = {
                              ...prev,
                              fields: templateFields,
                              // Copy any template metadata if available
                              title: template.title || prev.title,
                              description: template.description || prev.description
                            };
                            
                            // Save to localStorage immediately when applying template
                            if (formId && formId !== 'new') {
                              console.log("Saving form with template fields to localStorage");
                              localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedForm));
                            }
                            
                            return updatedForm;
                          });
                          
                          // If there are fields, select the first one
                          if (template.fields && template.fields.length > 0) {
                            setSelectedFieldId(templateFields[0].id);
                          }
                          
                          // Show success message
                          setSuccess(`Template "${template.title}" applied successfully!`);
                        }} 
                      />
                    </div>
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`mb-3 card ${selectedFieldId === field.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedFieldId(field.id)}
                    >
                      <div className="card-header d-flex align-items-center bg-white">
                        <div className="me-2">
                          <FaGripVertical className="text-muted" />
                        </div>
                        <div className="flex-grow-1">
                          {field.label}
                        </div>
                        <div>
                          <Button 
                            variant="link" 
                            className="text-muted p-1" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateField(field.id);
                            }}
                          >
                            <FaCopy />
                          </Button>
                          <Button 
                            variant="link" 
                            className="text-danger p-1" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteField(field.id);
                            }}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                      <div className="card-body">
                        {/* Simple field preview */}
                        <Form.Group>
                          <Form.Label>{field.label}</Form.Label>
                          {field.helpText && (
                            <div className="text-muted small mb-2">{field.helpText}</div>
                          )}
                          
                          {field.type === 'text' && (
                            <Form.Control type="text" placeholder="Short answer text" disabled />
                          )}
                          
                          {field.type === 'paragraph' && (
                            <Form.Control as="textarea" rows={3} placeholder="Long answer text" disabled />
                          )}
                          
                          {field.type === 'multipleChoice' && (
                            <div>
                              {(field.options || []).map((option, i) => (
                                <Form.Check
                                  key={i}
                                  type="radio"
                                  id={`${field.id}-option-${i}`}
                                  label={option.label}
                                  disabled
                                />
                              ))}
                            </div>
                          )}
                          
                          {field.type === 'checkboxes' && (
                            <div>
                              {(field.options || []).map((option, i) => (
                                <Form.Check
                                  key={i}
                                  type="checkbox"
                                  id={`${field.id}-option-${i}`}
                                  label={option.label}
                                  disabled
                                />
                              ))}
                            </div>
                          )}
                          
                          {field.type === 'dropdown' && (
                            <Form.Select disabled>
                              <option>Select an option</option>
                              {(field.options || []).map((option, i) => (
                                <option key={i} value={option.value}>{option.label}</option>
                              ))}
                            </Form.Select>
                          )}
                        </Form.Group>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="text-center mt-3">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => handleAddField('text')}
                >
                  <FaPlus className="me-2" /> Add Question
                </Button>
              </div>
            </>
          )}
          
          {activeTab === 'appearance' && (
            <div className="p-3">
              <h5>Form Appearance</h5>
              <p className="text-muted">Customize the look and feel of your form</p>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Primary Color</Form.Label>
                  <Form.Control 
                    type="color" 
                    value={form.primaryColor || "#3b82f6"}
                    onChange={(e) => setForm(prev => ({...prev, primaryColor: e.target.value}))}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Font</Form.Label>
                  <Form.Select
                    value={form.font || "Default"}
                    onChange={(e) => setForm(prev => ({...prev, font: e.target.value}))}
                  >
                    <option>Default</option>
                    <option>Arial</option>
                    <option>Helvetica</option>
                    <option>Times New Roman</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="switch"
                    id="enable-progress-bar"
                    label="Enable Progress Bar with Milestones"
                    checked={form.enableProgressBar || true}
                    onChange={(e) => setForm(prev => ({...prev, enableProgressBar: e.target.checked}))}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check 
                   type="switch"
                   id="enable-animations"
                   label="Enable Background Animations"
                   checked={form.enableAnimations || true}
                   onChange={(e) => setForm(prev => ({...prev, enableAnimations: e.target.checked}))}
                 />
               </Form.Group>
               
               <Form.Group className="mb-3">
                 <Form.Check 
                   type="switch"
                   id="enable-shareable-results"
                   label="Enable Shareable Results Page"
                   checked={form.enableShareableResults || true}
                   onChange={(e) => setForm(prev => ({...prev, enableShareableResults: e.target.checked}))}
                 />
               </Form.Group>
               
               <div className="bg-light p-3 rounded mb-4">
                 <h6>Progress Bar Preview</h6>
                 <ProgressBar progress={65} />
               </div>
             </Form>
           </div>
         )}
         
         {activeTab === 'settings' && (
           <div className="p-3">
             <h5>Form Settings</h5>
             <p className="text-muted">Configure form behavior and notifications</p>
             
             <Form>
               <Form.Group className="mb-3">
                 <Form.Check 
                   type="switch"
                   id="require-login"
                   label="Require login"
                   checked={form.requireLogin || false}
                   onChange={(e) => setForm(prev => ({...prev, requireLogin: e.target.checked}))}
                 />
               </Form.Group>
               
               <Form.Group className="mb-3">
                 <Form.Check 
                   type="switch"
                   id="collect-email"
                   label="Collect email addresses"
                   checked={form.collectEmail || false}
                   onChange={(e) => setForm(prev => ({...prev, collectEmail: e.target.checked}))}
                 />
               </Form.Group>
               
               <Form.Group className="mb-3">
                 <Form.Label>Confirmation Message</Form.Label>
                 <Form.Control 
                   as="textarea" 
                   placeholder="Thank you for your submission!"
                   value={form.confirmationMessage || ''}
                   onChange={(e) => setForm(prev => ({...prev, confirmationMessage: e.target.value}))}
                 />
               </Form.Group>
             </Form>
           </div>
         )}
       </Col>
       
       {/* Right Sidebar - Field Editor or Preview */}
       <Col md={3} className="border-start p-0">
         {activeTab === 'builder' && selectedField ? (
           <div className="p-3">
             <h5 className="mb-3">Edit Question</h5>
             <Form>
               <Form.Group className="mb-3">
                 <Form.Label>Question Text</Form.Label>
                 <Form.Control
                   type="text"
                   value={selectedField.label}
                   onChange={(e) => handleFieldUpdate(selectedField.id, { label: e.target.value })}
                   placeholder="Enter question text"
                 />
               </Form.Group>
               
               <Form.Group className="mb-3">
                 <Form.Label>Help Text (Optional)</Form.Label>
                 <Form.Control
                   type="text"
                   value={selectedField.helpText || ''}
                   onChange={(e) => handleFieldUpdate(selectedField.id, { helpText: e.target.value })}
                   placeholder="Additional instructions"
                 />
               </Form.Group>
               
               {/* Options editor for multiple choice, checkboxes, dropdown */}
               {(selectedField.type === 'multipleChoice' || 
                 selectedField.type === 'checkboxes' || 
                 selectedField.type === 'dropdown') && (
                 <div className="mb-3">
                   <Form.Label>{selectedField.type === 'dropdown' ? 'Dropdown Options' : 'Options'}</Form.Label>
                   {(selectedField.options || []).map((option, index) => (
                     <InputGroup key={index} className="mb-2">
                       <Form.Control
                         type="text"
                         value={option.label}
                         onChange={(e) => {
                           const newOptions = [...(selectedField.options || [])];
                           newOptions[index] = { 
                             ...newOptions[index], 
                             label: e.target.value,
                             value: e.target.value 
                           };
                           handleFieldUpdate(selectedField.id, { options: newOptions });
                         }}
                         placeholder={`Option ${index + 1}`}
                       />
                       <Button 
                         variant="outline-danger" 
                         onClick={() => {
                           const newOptions = [...(selectedField.options || [])];
                           newOptions.splice(index, 1);
                           handleFieldUpdate(selectedField.id, { options: newOptions });
                         }}
                         disabled={(selectedField.options || []).length <= 1}
                       >
                         <FaTrash />
                       </Button>
                     </InputGroup>
                   ))}
                   <Button 
                     variant="outline-secondary" 
                     size="sm" 
                     onClick={() => {
                       const newOption = {
                         value: `Option ${(selectedField.options || []).length + 1}`,
                         label: `Option ${(selectedField.options || []).length + 1}`
                       };
                       handleFieldUpdate(selectedField.id, { 
                         options: [...(selectedField.options || []), newOption] 
                       });
                     }}
                     className="mt-2"
                   >
                     <FaPlus className="me-1" /> Add Option
                   </Button>
                 </div>
               )}
               
               <Form.Group className="mb-3">
                 <Form.Check
                   type="checkbox"
                   label="Required"
                   checked={selectedField.required || false}
                   onChange={(e) => handleFieldUpdate(selectedField.id, { required: e.target.checked })}
                 />
               </Form.Group>
             </Form>
           </div>
         ) : (
           <div className="p-3 text-center">
             <p className="text-muted">
               {activeTab === 'builder' ? 'Select a question to edit' : 'Preview not available in this tab'}
             </p>
           </div>
         )}
       </Col>
     </Row>
   </Container>
 );
};

export default FormBuilder;