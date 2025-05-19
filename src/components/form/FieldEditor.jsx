// src/components/forms/FieldEditor.jsx
import React from 'react';
import { Form, InputGroup, Button, Accordion } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';

const FieldEditor = ({ field, onFieldUpdate, allFields }) => {
  // Handle field property changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFieldUpdate({
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle option property changes for multiple choice, checkboxes, dropdown
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...field.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      value,
      label: value
    };
    
    onFieldUpdate({ options: updatedOptions });
  };
  
  // Add new option
  const handleAddOption = () => {
    const newOption = {
      value: `Option ${field.options.length + 1}`,
      label: `Option ${field.options.length + 1}`
    };
    
    onFieldUpdate({
      options: [...field.options, newOption]
    });
  };
  
  // Delete an option
  const handleDeleteOption = (index) => {
    const updatedOptions = [...field.options];
    updatedOptions.splice(index, 1);
    
    onFieldUpdate({ options: updatedOptions });
  };
  
  return (
    <div className="field-editor">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Question Text</Form.Label>
          <Form.Control
            type="text"
            name="label"
            value={field.label}
            onChange={handleChange}
            placeholder="Enter question text"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Help Text (Optional)</Form.Label>
          <Form.Control
            type="text"
            name="helpText"
            value={field.helpText}
            onChange={handleChange}
            placeholder="Additional instructions"
          />
        </Form.Group>
        
        {/* Options editor for multiple choice, checkboxes, dropdown */}
        {(field.type === 'multipleChoice' || field.type === 'checkboxes' || field.type === 'dropdown') && (
          <div className="mb-3">
            <Form.Label>{field.type === 'dropdown' ? 'Dropdown Options' : 'Options'}</Form.Label>
            {field.options.map((option, index) => (
              <InputGroup key={index} className="mb-2">
                <Form.Control
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button 
                  variant="outline-danger" 
                  onClick={() => handleDeleteOption(index)}
                  disabled={field.options.length <= 1}
                >
                  <FaTrash />
                </Button>
              </InputGroup>
            ))}
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={handleAddOption}
              className="mt-2"
            >
              <FaPlus className="me-1" /> Add Option
            </Button>
          </div>
        )}
        
        {/* Rating field options */}
        {field.type === 'rating' && (
          <Form.Group className="mb-3">
            <Form.Label>Maximum Rating</Form.Label>
            <Form.Select
              name="maxRating"
              value={field.maxRating || 5}
              onChange={handleChange}
            >
              {[5, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        
        {/* Advanced settings accordion */}
        <Accordion className="mt-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Advanced Settings</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Required"
                  name="required"
                  checked={field.required}
                  onChange={handleChange}
                />
              </Form.Group>
              
              {/* Validation settings based on field type */}
              {field.type === 'text' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Minimum Length</Form.Label>
                    <Form.Control
                      type="number"
                      name="validation.min"
                      value={field.validation?.min || ''}
                      onChange={(e) => onFieldUpdate({
                        validation: { ...field.validation, min: e.target.value }
                      })}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Maximum Length</Form.Label>
                    <Form.Control
                      type="number"
                      name="validation.max"
                      value={field.validation?.max || ''}
                      onChange={(e) => onFieldUpdate({
                        validation: { ...field.validation, max: e.target.value }
                      })}
                    />
                  </Form.Group>
                </>
              )}
              
              {field.type === 'number' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Minimum Value</Form.Label>
                    <Form.Control
                      type="number"
                      name="validation.min"
                      value={field.validation?.min || ''}
                      onChange={(e) => onFieldUpdate({
                        validation: { ...field.validation, min: e.target.value }
                      })}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Maximum Value</Form.Label>
                    <Form.Control
                      type="number"
                      name="validation.max"
                      value={field.validation?.max || ''}
                      onChange={(e) => onFieldUpdate({
                        validation: { ...field.validation, max: e.target.value }
                      })}
                    />
                  </Form.Group>
                </>
              )}
              
              {field.type === 'file' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Allowed File Types</Form.Label>
                    <Form.Control
                      type="text"
                      name="allowedFileTypes"
                      value={field.allowedFileTypes || ''}
                      onChange={handleChange}
                      placeholder="e.g. .pdf, .jpg, .png"
                    />
                    <Form.Text className="text-muted">
                      Comma-separated list of file extensions
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Maximum File Size (MB)</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxFileSize"
                      value={field.maxFileSize || ''}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                    />
                  </Form.Group>
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>
    </div>
  );
};

export default FieldEditor;