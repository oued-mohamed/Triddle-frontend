// src/pages/FormBuilder.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tabs, Tab, Nav, InputGroup } from 'react-bootstrap';
// Remove this import for now
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from 'uuid';
import { FaSave, FaTimes, FaEye, FaPlus, FaCog, FaPalette, FaQuestionCircle, 
  FaGripVertical, FaCopy, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useFormStore } from '../context/FormStore.jsx';

// Import these components if they exist, or comment them out
import FormPreview from '../components/form/FormPreview';
import FieldTypeSelector from '../components/form/FieldTypeSelector';
import FieldEditor from '../components/form/FieldEditor';
import FormSettings from '../components/form/FormSettings';
import FormAppearance from '../components/form/FormAppearance';
import ConditionalLogic from '../components/form/ConditionalLogic';

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
        const loadedForm = await fetchFormById(formId);
        console.log("Loaded form for editing:", loadedForm);
        
        // Handle the data structure mismatch
        if (loadedForm) {
          // If the form has questions, map them to fields with the correct structure
          if (loadedForm.questions && Array.isArray(loadedForm.questions)) {
            // Map questions to fields with proper property names
            const mappedFields = loadedForm.questions.map(question => ({
              id: question.id || `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: question.type || 'text',
              label: question.title || question.label || 'Untitled Question',
              helpText: question.description || question.helpText || '',
              required: question.isRequired || question.required || false,
              order: question.order || 0,
              options: question.options || [],
              // Add any other field properties needed
            }));
            
            loadedForm.fields = mappedFields;
          } else if (!loadedForm.fields) {
            // Initialize empty fields array if neither questions nor fields exist
            loadedForm.fields = [];
          }
        }
        
        setForm(loadedForm);
        
        // If there are fields, select the first one
        if (loadedForm.fields && loadedForm.fields.length > 0) {
          setSelectedFieldId(loadedForm.fields[0].id);
        }
      } catch (err) {
        console.error("Error loading form:", err);
        setError("Failed to load form. The form may not exist or you don't have permission to edit it.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadForm();
  }, [formId, fetchFormById]);

  // Handle saving form
  const handleSaveForm = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Map the fields to the expected question structure for the backend
      const mappedQuestions = (form.fields || []).map(field => ({
        id: field.id,
        title: field.label, // Map label to title as required by backend
        type: field.type,
        description: field.helpText, // Map helpText to description
        isRequired: field.required, // Map required to isRequired
        order: field.order,
        options: field.options,
        // Include any other necessary fields for your backend
      }));
      
      // Create a copy of the form for saving, with the properly mapped questions
      const formToSave = {
        ...form,
        questions: mappedQuestions
      };
      
      let savedForm;
      
      if (formId && formId !== 'new') {
        // Update existing form
        savedForm = await updateForm(formId, formToSave);
        setSuccess("Form saved successfully");
      } else {
        // Create new form
        savedForm = await createForm(formToSave);
        // Redirect to edit the newly created form
        navigate(`/forms/builder/${savedForm.id}`, { replace: true });
        setSuccess("Form created successfully");
      }
      
      console.log("Saved form:", savedForm);
    } catch (err) {
      console.error("Error saving form:", err);
      setError("Failed to save form. Please try again.");
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
    
    setForm(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField]
    }));
    
    setSelectedFieldId(newField.id);
  };
  
  // Handle updating a field
  const handleFieldUpdate = (fieldId, updates) => {
    setForm(prev => ({
      ...prev,
      fields: (prev.fields || []).map(field => 
        field.id === fieldId ? {...field, ...updates} : field
      )
    }));
  };
  
  // Handle deleting a field
  const handleDeleteField = (fieldId) => {
    const fields = form.fields || [];
    
    setForm(prev => ({
      ...prev,
      fields: fields.filter(field => field.id !== fieldId)
    }));
    
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
      
      setForm(prev => ({
        ...prev,
        fields: [...(prev.fields || []), duplicatedField]
      }));
      
      setSelectedFieldId(duplicatedField.id);
    }
  };
  
  // Get the currently selected field
  const selectedField = selectedFieldId && form.fields 
    ? form.fields.find(field => field.id === selectedFieldId) 
    : null;

  // Access fields safely with fallback to empty array
  const fields = form.fields || [];

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
          <Button 
            variant="outline-primary" 
            className="me-2" 
            onClick={() => navigate(`/forms/${formId}/view`)}
            disabled={isSaving}
          >
            <FaEye className="me-2" /> Preview
          </Button>
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
                  <div className="text-center py-5 border rounded bg-light">
                    <FaQuestionCircle size={48} className="text-muted mb-3" />
                    <h4>No questions yet</h4>
                    <p className="text-muted">Add your first question from the left sidebar</p>
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
                            onClick={() => handleDuplicateField(field.id)}
                          >
                            <FaCopy />
                          </Button>
                          <Button 
                            variant="link" 
                            className="text-danger p-1" 
                            onClick={() => handleDeleteField(field.id)}
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
                  <Form.Control type="color" value="#3b82f6" />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Font</Form.Label>
                  <Form.Select>
                    <option>Default</option>
                    <option>Arial</option>
                    <option>Helvetica</option>
                    <option>Times New Roman</option>
                  </Form.Select>
                </Form.Group>
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
                    checked={form.requireLogin}
                    onChange={(e) => setForm(prev => ({...prev, requireLogin: e.target.checked}))}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="switch"
                    id="collect-email"
                    label="Collect email addresses"
                    checked={form.collectEmail}
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