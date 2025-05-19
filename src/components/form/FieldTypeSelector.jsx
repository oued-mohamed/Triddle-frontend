// src/components/forms/FieldTypeSelector.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import {
  FaFont, FaAlignLeft, FaCheckSquare, FaDotCircle, FaList,
  FaCalendarAlt, FaClock, FaStar, FaUpload, FaTable, FaPhoneAlt,
  FaEnvelope, FaLink, FaCalculator
} from 'react-icons/fa';

const fieldTypes = [
  { id: 'text', icon: <FaFont />, label: 'Short Text' },
  { id: 'paragraph', icon: <FaAlignLeft />, label: 'Paragraph' },
  { id: 'multipleChoice', icon: <FaDotCircle />, label: 'Multiple Choice' },
  { id: 'checkboxes', icon: <FaCheckSquare />, label: 'Checkboxes' },
  { id: 'dropdown', icon: <FaList />, label: 'Dropdown' },
  { id: 'date', icon: <FaCalendarAlt />, label: 'Date' },
  { id: 'time', icon: <FaClock />, label: 'Time' },
  { id: 'rating', icon: <FaStar />, label: 'Rating' },
  { id: 'file', icon: <FaUpload />, label: 'File Upload' },
  { id: 'matrix', icon: <FaTable />, label: 'Matrix' },
  { id: 'phone', icon: <FaPhoneAlt />, label: 'Phone' },
  { id: 'email', icon: <FaEnvelope />, label: 'Email' },
  { id: 'url', icon: <FaLink />, label: 'Website' },
  { id: 'number', icon: <FaCalculator />, label: 'Number' }
];

const FieldTypeSelector = ({ onAddField }) => {
  return (
    <div className="field-type-selector">
      <div className="d-grid gap-2">
        {fieldTypes.map(type => (
          <Button
            key={type.id}
            variant="outline-secondary"
            className="text-start d-flex align-items-center"
            onClick={() => onAddField(type.id)}
          >
            <span className="me-2">{type.icon}</span>
            {type.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FieldTypeSelector;