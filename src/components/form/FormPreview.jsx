// src/components/forms/FormPreview.jsx
import React from 'react';
import { Form, InputGroup, Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const FormPreview = ({ field, theme, readOnly = false, value = null, onChange = () => {} }) => {
  // Handle value change for the field
  const handleChange = (e) => {
    if (readOnly) return;
    
    const { type, checked, value } = e.target;
    onChange(type === 'checkbox' ? checked : value);
  };
  
  // Generate a star rating component
  const renderRating = (maxRating = 5) => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`me-1 ${i <= (value || 0) ? 'text-warning' : 'text-muted'}`}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
          onClick={() => !readOnly && onChange(i)}
        />
      );
    }
    return (
      <div className="d-flex align-items-center">
        {stars}
      </div>
    );
  };
  
  // Render the preview based on field type
  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
        return (
          <Form.Control
            type="text"
            placeholder={field.placeholder || 'Short answer text'}
            value={value || ''}
            onChange={handleChange}
            readOnly={readOnly}
            required={field.required}
          />
        );
        
      case 'paragraph':
        return (
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={field.placeholder || 'Long answer text'}
            value={value || ''}
            onChange={handleChange}
            readOnly={readOnly}
            required={field.required}
          />
        );
        
      case 'multipleChoice':
        return (
          <div>
            {field.options.map((option, index) => (
              <Form.Check
                key={index}
                type="radio"
                id={`${field.id}-option-${index}`}
                name={field.id}
                label={option.label}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={readOnly}
                required={field.required}
              />
            ))}
          </div>
        );
        
      case 'checkboxes':
        return (
          <div>
            {field.options.map((option, index) => (
              <Form.Check
                key={index}
                type="checkbox"
                id={`${field.id}-option-${index}`}
                label={option.label}
                value={option.value}
                checked={Array.isArray(value) ? value.includes(option.value) : false}
                onChange={(e) => {
                  if (readOnly) return;
                  
                  const newValue = Array.isArray(value) ? [...value] : [];
                  if (e.target.checked) {
                    newValue.push(option.value);
                  } else {
                    const index = newValue.indexOf(option.value);
                    if (index !== -1) {
                      newValue.splice(index, 1);
                    }
                  }
                  onChange(newValue);
                }}
                disabled={readOnly}
                required={field.required}
              />
            ))}
          </div>
        );
        
      case 'dropdown':
        return (
          <Form.Select
            value={value || ''}
            onChange={handleChange}
            disabled={readOnly}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );
        
      case 'date':
        return (
          <Form.Control
            type="date"
            value={value || ''}
            onChange={handleChange}
            readOnly={readOnly}
            required={field.required}
          />
        );
        
      case 'time':
        return (
          <Form.Control
            type="time"
            value={value || ''}
            onChange={handleChange}
            readOnly={readOnly}
            required={field.required}
          />
        );
        
      case 'rating':
        return renderRating(field.maxRating || 5);
        
      case 'file':
        return (
          <Form.Control
            type="file"
            onChange={handleChange}
            disabled={readOnly}
            required={field.required}
            accept={field.allowedFileTypes}
          />
        );
        
      case 'number':
        return (
          <Form.Control
            type="number"
            placeholder={field.placeholder || 'Enter a number'}
            value={value || ''}
            onChange={handleChange}
            readOnly={readOnly}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
        
      case 'email':
        return (
          <Form.Control
            type="email"
            placeholder={field.placeholder || 'name@example.com'}
            value={value || ''}
            onChange={handleChange}
            readOnly={readOnly}
            required={field.required}
          />
        );
        
      case 'phone':
        return (
          <Form.Control
            type="tel"
            placeholder={field.placeholder || '(123) 456-7890'}
            value={value || ''}
            onChange={handleChange}
            readOnly={readOnly}
            required={field.required}
          />
        );
        
      case 'url':
        return (
          <Form.Control
            type="url"
            placeholder={field.placeholder || 'https://example.com'}
            value={value || ''}
            onChange={handleChange}
            readOnly={readOnly}
            required={field.required}
          />
        );
        
      case 'matrix':
        return (
          <Card className="bg-light">
            <Card.Body className="text-center">
              <p className="mb-0">Matrix field preview not available</p>
            </Card.Body>
          </Card>
        );
        
      default:
        return (
          <p className="text-muted">Preview not available for this field type.</p>
        );
    }
  };
  
  return (
    <div className="form-preview">
      <Form.Group className="mb-0">
        {field.label && (
          <Form.Label>
            {field.label}
            {field.required && <span className="text-danger ms-1">*</span>}
          </Form.Label>
        )}
        
        {field.helpText && (
          <div className="text-muted small mb-2">{field.helpText}</div>
        )}
        
        {renderFieldPreview()}
      </Form.Group>
    </div>
  );
};

export default FormPreview;