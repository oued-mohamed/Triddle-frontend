// frontend/src/components/form/FormRenderer.jsx
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormResponseStore } from '../../context/formResponseStore';
import { FaArrowRight, FaCheck, FaUpload } from 'react-icons/fa';
import Dropzone from 'react-dropzone';

const FormRenderer = ({ formId }) => {
  const {
    form,
    currentQuestion,
    response,
    answers,
    progress,
    isLoading,
    isSubmitting,
    error,
    completed,
    startFormResponse,
    submitAnswer,
    uploadFile
  } = useFormResponseStore();

  const [answer, setAnswer] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationError, setValidationError] = useState('');

  // Start form response when component mounts
  React.useEffect(() => {
    if (!response && !isLoading) {
      startFormResponse(formId);
    }
  }, [formId, response, isLoading, startFormResponse]);

  // Reset answer when current question changes
  React.useEffect(() => {
    if (currentQuestion) {
      // Check if we already have an answer for this question
      const existingAnswer = answers[currentQuestion.id];
      if (existingAnswer) {
        setAnswer(existingAnswer.value || '');
        setFileUpload(existingAnswer.fileUrl ? { name: 'Uploaded file', url: existingAnswer.fileUrl } : null);
      } else {
        setAnswer('');
        setFileUpload(null);
      }
      setValidationError('');
    }
  }, [currentQuestion, answers]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the answer
    if (currentQuestion.isRequired && !answer && !fileUpload && currentQuestion.type !== 'checkbox') {
      setValidationError('This question requires an answer');
      return;
    }
    
    try {
      let answerPayload = { value: answer, fileUrl: fileUpload?.url || null };
      
      // Submit the answer
      await submitAnswer(answerPayload);
      
      // Reset for next question
      setAnswer('');
      setFileUpload(null);
      setValidationError('');
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    try {
      const file = acceptedFiles[0];
      setFileUpload({ name: file.name, loading: true });
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Upload the file
      const fileUrl = await uploadFile(file);
      
      // Set upload to complete
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update state with file information
      setFileUpload({ name: file.name, url: fileUrl });
      setAnswer(''); // Clear text answer if any
      
      // After a short delay, reset progress
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setFileUpload(null);
      setUploadProgress(0);
      setValidationError('Failed to upload file');
    }
  };

  // Animation variants
  const questionVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  const completedVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading form...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  // Completed state
  if (completed) {
    return (
      <motion.div
        className="text-center p-5"
        variants={completedVariants}
        initial="initial"
        animate="animate"
      >
        <div className="completed-icon mb-4">
          <FaCheck size={50} className="text-success" />
        </div>
        <h2 className="mb-3">Thank You!</h2>
        <p className="lead mb-4">Your response has been submitted successfully.</p>
        <Button variant="outline-primary" onClick={() => window.location.reload()}>
          Submit Another Response
        </Button>
      </motion.div>
    );
  }

  // Render current question
  return (
    <div className="form-renderer">
      {form && currentQuestion && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            variants={questionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="p-4"
          >
            <h3 className="mb-3">{currentQuestion.title}</h3>
            
            {currentQuestion.description && (
              <p className="text-muted mb-4">{currentQuestion.description}</p>
            )}
            
            <Form onSubmit={handleSubmit}>
              {/* Text Input */}
              {currentQuestion.type === 'text' && (
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="form-input"
                    isInvalid={!!validationError}
                  />
                </Form.Group>
              )}
              
              {/* Number Input */}
              {currentQuestion.type === 'number' && (
                <Form.Group>
                  <Form.Control
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="form-input"
                    isInvalid={!!validationError}
                  />
                </Form.Group>
              )}
              
              {/* Email Input */}
              {currentQuestion.type === 'email' && (
                <Form.Group>
                  <Form.Control
                    type="email"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your email address"
                    className="form-input"
                    isInvalid={!!validationError}
                  />
                </Form.Group>
              )}
              
              {/* Textarea */}
              {currentQuestion.type === 'textarea' && (
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="form-input"
                    isInvalid={!!validationError}
                  />
                </Form.Group>
              )}
              
              {/* Date Input */}
              {currentQuestion.type === 'date' && (
                <Form.Group>
                  <Form.Control
                    type="date"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="form-input"
                    isInvalid={!!validationError}
                  />
                </Form.Group>
              )}
              
              {/* Select Dropdown */}
              {currentQuestion.type === 'select' && (
                <Form.Group>
                  <Form.Select
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="form-input"
                    isInvalid={!!validationError}
                  >
                    <option value="">Select an option...</option>
                    {currentQuestion.options?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              
              {/* Radio Buttons */}
              {currentQuestion.type === 'radio' && (
                <Form.Group>
                  {currentQuestion.options?.map((option, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      id={`radio-${currentQuestion.id}-${index}`}
                      label={option}
                      name={`radio-${currentQuestion.id}`}
                      value={option}
                      checked={answer === option}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="mb-3"
                      isInvalid={!!validationError}
                    />
                  ))}
                </Form.Group>
              )}
              
              {/* Checkboxes */}
              {currentQuestion.type === 'checkbox' && (
                <Form.Group>
                  {currentQuestion.options?.map((option, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      id={`checkbox-${currentQuestion.id}-${index}`}
                      label={option}
                      checked={answer.includes(option)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAnswer(prev => {
                          const values = prev ? prev.split(',') : [];
                          if (checked) {
                            return [...values, option].join(',');
                          } else {
                            return values.filter(val => val !== option).join(',');
                          }
                        });
                      }}
                      className="mb-3"
                      isInvalid={!!validationError}
                    />
                  ))}
                </Form.Group>
              )}
              
              {/* File Upload */}
              {currentQuestion.type === 'file' && (
                <Form.Group>
                  {!fileUpload ? (
                    <Dropzone onDrop={handleFileUpload} multiple={false}>
                      {({ getRootProps, getInputProps }) => (
                        <div 
                          {...getRootProps()} 
                          className={`dropzone-area ${validationError ? 'is-invalid' : ''}`}
                        >
                          <input {...getInputProps()} />
                          <div className="text-center p-5">
                            <FaUpload size={30} className="mb-3 text-muted" />
                            <p>Drag & drop a file here, or click to select</p>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                  ) : (
                    <div className="file-preview p-3 border rounded">
                      {fileUpload.loading ? (
                        <>
                          <p className="mb-2">Uploading: {fileUpload.name}</p>
                          <div className="progress mb-2">
                            <div 
                              className="progress-bar progress-bar-striped progress-bar-animated" 
                              role="progressbar" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-1">File: {fileUpload.name}</p>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => setFileUpload(null)}
                          >
                            Remove
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </Form.Group>
              )}
              
              {/* Validation Error */}
              {validationError && (
                <Alert variant="danger" className="mt-3">
                  {validationError}
                </Alert>
              )}
              
              {/* Submit Button */}
              <div className="d-flex justify-content-end mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="px-4 submit-button"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      {currentQuestion.isLast ? 'Submit' : 'Continue'} <FaArrowRight className="ms-2" />
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default FormRenderer;