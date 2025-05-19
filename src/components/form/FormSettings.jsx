// src/components/forms/FormSettings.jsx
import React from 'react';
import { Form, InputGroup, Button, Card, Accordion } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';

const FormSettings = ({ settings, onSettingsUpdate }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onSettingsUpdate({
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleAddEmail = () => {
    const emails = [...(settings.notificationEmails || []), ''];
    onSettingsUpdate({ notificationEmails: emails });
  };
  
  const handleEmailChange = (index, value) => {
    const emails = [...(settings.notificationEmails || [])];
    emails[index] = value;
    onSettingsUpdate({ notificationEmails: emails });
  };
  
  const handleRemoveEmail = (index) => {
    const emails = [...(settings.notificationEmails || [])];
    emails.splice(index, 1);
    onSettingsUpdate({ notificationEmails: emails });
  };
  
  return (
    <div className="form-settings">
      <h5 className="mb-4">Form Settings</h5>
      
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>General Settings</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="require-sign-in"
                label="Require sign-in to fill this form"
                name="requireSignIn"
                checked={settings.requireSignIn}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Users will need to be logged in to fill out this form
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="limit-responses"
                label="Limit to one response per user"
                name="limitOneResponsePerUser"
                checked={settings.limitOneResponsePerUser}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Users can only submit this form once
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="show-progress"
                label="Show progress bar"
                name="showProgressBar"
                checked={settings.showProgressBar}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Display a progress bar at the top of the form
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="shuffle-questions"
                label="Shuffle questions"
                name="shuffleQuestions"
                checked={settings.shuffleQuestions}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Randomize the order of questions for each user
              </Form.Text>
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="1">
          <Accordion.Header>Confirmation Settings</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3">
              <Form.Label>Confirmation Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="confirmationMessage"
                value={settings.confirmationMessage}
                onChange={handleChange}
                placeholder="Thank you for your submission!"
              />
              <Form.Text className="text-muted">
                Message shown after a user submits the form
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Redirect URL (optional)</Form.Label>
              <Form.Control
                type="url"
                name="redirectUrl"
                value={settings.redirectUrl}
                onChange={handleChange}
                placeholder="https://example.com/thank-you"
              />
              <Form.Text className="text-muted">
                Redirect users to this URL after form submission
              </Form.Text>
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="2">
          <Accordion.Header>Notification Settings</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="notify-submission"
                label="Email notification on form submission"
                name="notifyOnSubmission"
                checked={settings.notifyOnSubmission}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Receive an email notification when someone submits this form
              </Form.Text>
            </Form.Group>
            
            {settings.notifyOnSubmission && (
              <Form.Group className="mb-3">
                <Form.Label>Notification Emails</Form.Label>
                {(settings.notificationEmails || []).map((email, index) => (
                  <InputGroup key={index} className="mb-2">
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="email@example.com"
                    />
                    <Button 
                      variant="outline-danger" 
                      onClick={() => handleRemoveEmail(index)}
                    >
                      <FaTrash />
                    </Button>
                  </InputGroup>
                ))}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleAddEmail}
                  className="mt-2"
                >
                  <FaPlus className="me-1" /> Add Email
                </Button>
              </Form.Group>
            )}
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="3">
          <Accordion.Header>Integration Settings</Accordion.Header>
          <Accordion.Body>
            <Card className="bg-light mb-3">
              <Card.Body>
                <p className="mb-0">Integrations with external services will be available soon.</p>
              </Card.Body>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FormSettings;