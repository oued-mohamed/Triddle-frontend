// frontend/src/components/form/QuestionPreview.jsx
import React from 'react';
import { Card, Form, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const QuestionPreview = ({
  question,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}) => {
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="question-preview mb-3"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Card className="border shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
          <div className="d-flex align-items-center">
            <Badge bg="info" className="me-2">
              {question.order + 1}
            </Badge>
            <Badge bg="secondary" className="text-capitalize">
              {question.type}
            </Badge>
            {question.isRequired && (
              <Badge bg="danger" className="ms-2">
                Required
              </Badge>
            )}
          </div>
          <div className="question-actions">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onMoveUp(question.id)}
              disabled={isFirst}
              className="me-1"
              title="Move Up"
            >
              <FaArrowUp />
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onMoveDown(question.id)}
              disabled={isLast}
              className="me-1"
              title="Move Down"
            >
              <FaArrowDown />
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onEdit(question)}
              className="me-1"
              title="Edit Question"
            >
              <FaEdit />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(question.id)}
              title="Delete Question"
            >
              <FaTrash />
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title>{question.title}</Card.Title>
          {question.description && (
            <Card.Text className="text-muted">{question.description}</Card.Text>
          )}

          {/* Preview of different question types */}
          <div className="question-preview-input mt-3">
            {/* Text Input */}
            {question.type === 'text' && (
              <Form.Control
                type="text"
                placeholder="Text answer"
                disabled
                className="bg-light"
              />
            )}

            {/* Number Input */}
            {question.type === 'number' && (
              <Form.Control
                type="number"
                placeholder="Numeric answer"
                disabled
                className="bg-light"
              />
            )}

            {/* Email Input */}
            {question.type === 'email' && (
              <Form.Control
                type="email"
                placeholder="Email address"
                disabled
                className="bg-light"
              />
            )}

            {/* Date Input */}
            {question.type === 'date' && (
              <Form.Control
                type="date"
                disabled
                className="bg-light"
              />
            )}

            {/* Textarea */}
            {question.type === 'textarea' && (
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Long text answer"
                disabled
                className="bg-light"
              />
            )}

            {/* Select Dropdown */}
            {question.type === 'select' && (
              <Form.Select disabled className="bg-light">
                <option>Select an option...</option>
                {question.options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            )}

            {/* Radio Buttons */}
            {question.type === 'radio' && (
              <div>
                {question.options?.map((option, index) => (
                  <Form.Check
                    key={index}
                    type="radio"
                    id={`radio-${question.id}-${index}`}
                    label={option}
                    name={`radio-${question.id}`}
                    disabled
                    className="mb-2"
                  />
                ))}
              </div>
            )}

            {/* Checkboxes */}
            {question.type === 'checkbox' && (
              <div>
                {question.options?.map((option, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    id={`checkbox-${question.id}-${index}`}
                    label={option}
                    disabled
                    className="mb-2"
                  />
                ))}
              </div>
            )}

            {/* File Upload */}
            {question.type === 'file' && (
              <Form.Control
                type="file"
                disabled
                className="bg-light"
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default QuestionPreview;