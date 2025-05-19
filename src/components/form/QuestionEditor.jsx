// frontend/src/components/form/QuestionEditor.jsx
import React, { useState } from 'react';
import { Form, InputGroup, Row, Col, Button as BsButton } from 'react-bootstrap';
import { FaPlus, FaMinus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import FormControl from '../common/FormControl';

const QuestionEditor = ({ 
  question = null, 
  onSave, 
  onCancel, 
  isSubmitting = false 
}) => {
  // Initial state
  const initialState = question
    ? { ...question }
    : {
        title: '',
        description: '',
        type: 'text',
        isRequired: false,
        options: null,
        validation: null
      };

  const [formData, setFormData] = useState(initialState);
  const [options, setOptions] = useState(
    formData.options ? [...formData.options] : ['']
  );
  const [validationRules, setValidationRules] = useState(
    formData.validation || { required: false }
  );

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle option changes for select, radio, checkbox fields
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Add new option
  const addOption = () => {
    setOptions([...options, '']);
  };

  // Remove option
  const removeOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  // Handle validation rule changes
  const handleValidationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValidationRules({
      ...validationRules,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare question data
    const questionData = {
      ...formData,
      isRequired: formData.isRequired || false
    };
    
    // Add options for select, radio, checkbox fields
    if (['select', 'radio', 'checkbox'].includes(formData.type)) {
      questionData.options = options.filter(opt => opt.trim() !== '');
    }
    
    // Add validation rules
    if (Object.keys(validationRules).length > 0) {
      questionData.validation = validationRules;
    }
    
    onSave(questionData);
  };

  // Animation variants
  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="question-editor p-4 border rounded bg-white shadow-sm"
      variants={formVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h4 className="mb-4">{question ? 'Edit Question' : 'Add Question'}</h4>
      
      <Form onSubmit={handleSubmit}>
        {/* Question Title */}
        <FormControl
          id="title"
          label="Question Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter question title"
          required
        />
        
        {/* Question Description */}
        <FormControl
          id="description"
          label="Description (Optional)"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Enter additional context for the question"
          as="textarea"
          rows={2}
        />
        
        {/* Question Type */}
        <Form.Group className="mb-3">
          <Form.Label>Question Type</Form.Label>
          <Form.Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="custom-select"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="select">Dropdown</option>
            <option value="radio">Multiple Choice (Single)</option>
            <option value="checkbox">Multiple Choice (Multiple)</option>
            <option value="textarea">Long Text</option>
            <option value="date">Date</option>
            <option value="file">File Upload</option>
          </Form.Select>
        </Form.Group>
        
        {/* Options for select, radio, checkbox fields */}
        {['select', 'radio', 'checkbox'].includes(formData.type) && (
          <div className="options-container mb-4">
            <label className="d-block mb-2">Options</label>
            
            {options.map((option, index) => (
              <div key={index} className="mb-2">
                <InputGroup>
                  <Form.Control
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="custom-input"
                  />
                  <BsButton
                    variant="outline-danger"
                    onClick={() => removeOption(index)}
                    disabled={options.length === 1}
                  >
                    <FaMinus />
                  </BsButton>
                </InputGroup>
              </div>
            ))}
            
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={addOption}
              icon={<FaPlus />}
              className="mt-2"
            >
              Add Option
            </Button>
          </div>
        )}
        
        {/* Validation Rules */}
        <div className="validation-container mb-4">
          <h5 className="mb-3">Validation</h5>
          
          <Form.Check
            type="checkbox"
            id="isRequired"
            label="Required"
            name="isRequired"
            checked={formData.isRequired}
            onChange={handleChange}
            className="mb-3"
          />
          
          {formData.type === 'text' && (
            <Row>
              <Col md={6}>
                <FormControl
                  id="minLength"
                  label="Min Length"
                  name="minLength"
                  type="number"
                  value={validationRules.minLength || ''}
                  onChange={handleValidationChange}
                  placeholder="Minimum characters"
                />
              </Col>
              <Col md={6}>
                <FormControl
                  id="maxLength"
                  label="Max Length"
                  name="maxLength"
                  type="number"
                  value={validationRules.maxLength || ''}
                  onChange={handleValidationChange}
                  placeholder="Maximum characters"
                />
              </Col>
            </Row>
          )}
          
          {formData.type === 'number' && (
            <Row>
              <Col md={6}>
                <FormControl
                  id="min"
                  label="Min Value"
                  name="min"
                  type="number"
                  value={validationRules.min || ''}
                  onChange={handleValidationChange}
                  placeholder="Minimum value"
                />
              </Col>
              <Col md={6}>
                <FormControl
                  id="max"
                  label="Max Value"
                  name="max"
                  type="number"
                  value={validationRules.max || ''}
                  onChange={handleValidationChange}
                  placeholder="Maximum value"
                />
              </Col>
            </Row>
          )}
          
          {formData.type === 'file' && (
            <Row>
              <Col md={6}>
                <FormControl
                  id="maxSize"
                  label="Max File Size (MB)"
                  name="maxSize"
                  type="number"
                  value={validationRules.maxSize || ''}
                  onChange={handleValidationChange}
                  placeholder="Maximum file size in MB"
                />
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Allowed File Types</Form.Label>
                  <Form.Select
                    name="fileTypes"
                    value={validationRules.fileTypes || ''}
                    onChange={handleValidationChange}
                    className="custom-select"
                  >
                    <option value="">All Files</option>
                    <option value="image/*">Images Only</option>
                    <option value="application/pdf">PDF Only</option>
                    <option value="text/*">Text Files Only</option>
                    <option value="custom">Custom</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button
            variant="outline-secondary"
            onClick={onCancel}
            icon={<FaTimes />}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            icon={<FaSave />}
          >
            {question ? 'Update Question' : 'Add Question'}
          </Button>
        </div>
      </Form>
    </motion.div>
  );
};

export default QuestionEditor;