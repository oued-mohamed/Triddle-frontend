// src/components/forms/FormAppearance.jsx
import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';

const fontOptions = [
  { value: 'Inter, sans-serif', label: 'Inter (Default)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: '"Open Sans", sans-serif', label: 'Open Sans' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' }
];

const FormAppearance = ({ theme, onThemeUpdate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onThemeUpdate({ [name]: value });
  };
  
  return (
    <div className="form-appearance">
      <h5 className="mb-4">Form Appearance</h5>
      
      <Form.Group className="mb-4">
        <Form.Label>Primary Color</Form.Label>
        <Row>
          <Col xs={9}>
            <Form.Control
              type="text"
              name="primaryColor"
              value={theme.primaryColor}
              onChange={handleChange}
              placeholder="#3b82f6"
            />
          </Col>
          <Col xs={3}>
            <Form.Control
              type="color"
              value={theme.primaryColor}
              onChange={(e) => onThemeUpdate({ primaryColor: e.target.value })}
              className="w-100"
            />
          </Col>
        </Row>
        <Form.Text className="text-muted">
          Used for buttons, headers, and accents
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Label>Background Color</Form.Label>
        <Row>
          <Col xs={9}>
            <Form.Control
              type="text"
              name="backgroundColor"
              value={theme.backgroundColor}
              onChange={handleChange}
              placeholder="#f8fafc"
            />
          </Col>
          <Col xs={3}>
            <Form.Control
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => onThemeUpdate({ backgroundColor: e.target.value })}
              className="w-100"
            />
          </Col>
        </Row>
        <Form.Text className="text-muted">
          Used for the form background
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Label>Font Family</Form.Label>
        <Form.Select
          name="fontFamily"
          value={theme.fontFamily}
          onChange={handleChange}
        >
          {fontOptions.map(font => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      
      <h5 className="mb-3 mt-5">Preview</h5>
      <Card 
        className="shadow-sm" 
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily
        }}
      >
        <Card.Header style={{ backgroundColor: theme.primaryColor, color: '#fff' }}>
          Sample Form
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Sample Question</Form.Label>
            <Form.Control type="text" placeholder="Your answer here" />
          </Form.Group>
          <button 
            className="btn" 
            style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
          >
            Submit
          </button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FormAppearance;