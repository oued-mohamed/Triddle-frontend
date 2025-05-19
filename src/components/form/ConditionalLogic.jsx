// src/components/forms/ConditionalLogic.jsx
import React from 'react';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const ConditionalLogic = ({ field, allFields, onUpdate }) => {
  // Initialize conditional logic if not present
  const conditionalLogic = field.conditionalLogic || {
    enabled: false,
    rules: []
  };

  // Toggle conditional logic on/off
  const handleToggleLogic = () => {
    onUpdate({
      ...conditionalLogic,
      enabled: !conditionalLogic.enabled
    });
  };

  // Add a new conditional rule
  const handleAddRule = () => {
    // Only add if there are other fields to reference
    if (allFields.length === 0) return;

    const newRule = {
      id: uuidv4(),
      fieldId: allFields[0].id,
      operator: 'equals',
      value: '',
      action: 'show'
    };

    onUpdate({
      ...conditionalLogic,
      rules: [...conditionalLogic.rules, newRule]
    });
  };

  // Delete a rule
  const handleDeleteRule = (ruleId) => {
    onUpdate({
      ...conditionalLogic,
      rules: conditionalLogic.rules.filter(rule => rule.id !== ruleId)
    });
  };

  // Update a rule property
  const handleRuleChange = (ruleId, property, value) => {
    onUpdate({
      ...conditionalLogic,
      rules: conditionalLogic.rules.map(rule => 
        rule.id === ruleId ? { ...rule, [property]: value } : rule
      )
    });
  };

  // Get options for a field (for dropdown, multiple choice, checkboxes)
  const getFieldOptions = (fieldId) => {
    const targetField = allFields.find(f => f.id === fieldId);
    return targetField?.options || [];
  };

  return (
    <div className="conditional-logic">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Conditional Logic</h5>
        <Form.Check
          type="switch"
          id={`logic-switch-${field.id}`}
          label=""
          checked={conditionalLogic.enabled}
          onChange={handleToggleLogic}
        />
      </div>

      {conditionalLogic.enabled ? (
        <>
          <p className="text-muted small mb-3">
            Show or hide this question based on answers to previous questions.
          </p>

          {allFields.length === 0 ? (
            <div className="alert alert-warning">
              You need at least one other question to set up conditional logic.
            </div>
          ) : (
            <>
              {conditionalLogic.rules.length === 0 ? (
                <div className="text-center p-3 border rounded mb-3">
                  <p className="text-muted mb-0">No rules yet. Add your first rule below.</p>
                </div>
              ) : (
                <div className="mb-3">
                  {conditionalLogic.rules.map((rule, index) => (
                    <Card key={rule.id} className="mb-2 shadow-sm">
                      <Card.Body className="p-2">
                        <div className="d-flex align-items-center mb-2">
                          <span className="text-muted me-2">{index === 0 ? 'If' : 'And if'}</span>
                          <Form.Select
                            size="sm"
                            className="me-2"
                            value={rule.fieldId}
                            onChange={(e) => handleRuleChange(rule.id, 'fieldId', e.target.value)}
                          >
                            {allFields.map(f => (
                              <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                          </Form.Select>
                        </div>

                        <div className="d-flex align-items-center mb-2">
                          <Form.Select
                            size="sm"
                            className="me-2"
                            value={rule.operator}
                            onChange={(e) => handleRuleChange(rule.id, 'operator', e.target.value)}
                            style={{ width: '150px' }}
                          >
                            <option value="equals">Equals</option>
                            <option value="notEquals">Does not equal</option>
                            <option value="contains">Contains</option>
                            <option value="notContains">Does not contain</option>
                            <option value="greaterThan">Greater than</option>
                            <option value="lessThan">Less than</option>
                            <option value="isAnswered">Is answered</option>
                            <option value="isNotAnswered">Is not answered</option>
                          </Form.Select>

                          {rule.operator !== 'isAnswered' && rule.operator !== 'isNotAnswered' && (
                            <div className="flex-grow-1">
                              {/* Show dropdown for fields with options */}
                              {getFieldOptions(rule.fieldId).length > 0 ? (
                                <Form.Select
                                  size="sm"
                                  value={rule.value}
                                  onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                                >
                                  <option value="">Select an option</option>
                                  {getFieldOptions(rule.fieldId).map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </Form.Select>
                              ) : (
                                <Form.Control
                                  size="sm"
                                  type="text"
                                  value={rule.value}
                                  onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                                  placeholder="Enter value"
                                />
                              )}
                            </div>
                          )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <Form.Select
                            size="sm"
                            value={rule.action}
                            onChange={(e) => handleRuleChange(rule.id, 'action', e.target.value)}
                            style={{ width: '100px' }}
                          >
                            <option value="show">Show</option>
                            <option value="hide">Hide</option>
                          </Form.Select>
                          <span className="text-muted mx-2">this question</span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <FaTrash size={12} />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}

              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleAddRule}
                className="w-100"
              >
                <FaPlus className="me-1" /> Add Rule
              </Button>
            </>
          )}
        </>
      ) : (
        <p className="text-muted small">
          Enable conditional logic to show or hide this question based on answers to previous questions.
        </p>
      )}
    </div>
  );
};

export default ConditionalLogic;