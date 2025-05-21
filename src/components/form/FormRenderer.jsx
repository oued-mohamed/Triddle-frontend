// frontend/src/components/form/FormRenderer.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormResponseStore } from '../../context/formResponseStore';
import { FaArrowRight, FaCheck, FaUpload, FaShareAlt, FaPrint, FaDownload } from 'react-icons/fa';
import Dropzone from 'react-dropzone';
import ProgressBar from '../common/ProgressBar';

// Background patterns for different question types
const backgroundPatterns = {
  text: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a6cf7' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  textarea: "url(\"data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a6cf7' fill-opacity='0.05'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  select: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234a6cf7' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
  radio: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a6cf7' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  checkbox: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%234a6cf7' fill-opacity='0.05'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E\")",
  date: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.652-1.1 2.782-2.752 3.112-4.83.33-2.077-.252-4.335-1.883-6.58-1.63-2.246-4.082-3.767-6.9-4.255-2.816-.486-5.618.033-7.92 1.474-2.3 1.44-3.952 3.758-4.5 6.555-.55 2.797.37 5.588 2.44 7.837 2.07 2.25 5.09 3.592 8.37 3.83 1.127.083 2.22-.02 3.217-.296.895-.245 1.485-.93 1.236-1.45-.25-.518-1.17-.82-2.06-.576-1.124.307-2.358.326-3.544.076-1.19-.252-2.3-.84-3.134-1.706-.834-.866-1.356-1.964-1.437-3.113-.08-1.15.307-2.305 1.083-3.224.776-.918 1.892-1.566 3.104-1.794 1.21-.228 2.44-.068 3.463.45 1.023.52 1.826 1.36 2.167 2.362.34 1.003.294 2.093-.134 3.014-.428.92-1.193 1.648-2.14 2.003-.942.356-1.98.338-2.892-.05-.913-.385-1.632-1.128-1.932-2.03-.3-.9-.143-1.894.42-2.7.564-.806 1.472-1.363 2.457-1.504.982-.141 1.982.142 2.68.942.696.8.903 1.96.53 2.98l-.04.1c-.17.43-.266.67-.31.76-.04.09-.05.12-.03.15.03.04.1.06.2.06.33 0 .612-.26.66-.63l.11-.43c.23-.76.31-1.57.23-2.37-.09-.79-.45-1.56-1.03-2.2-.59-.64-1.37-1.05-2.215-1.2-.84-.15-1.71 0-2.484.42-.77.42-1.37 1.07-1.728 1.87-.35.8-.43 1.69-.23 2.52.2.83.67 1.59 1.33 2.15.67.57 1.5.86 2.34.86.15 0 .34-.03.48-.04l.06-.04c.03-.03.07-.07.12-.14.05-.07.1-.14.15-.25l.13-.27c.54-1.15 1.08-2.29.73-3.39l-.04-.14-.22.19c-.32.3-.75.48-1.2.52-.44.04-.88-.07-1.24-.32-.37-.25-.64-.62-.78-1.04-.13-.42-.13-.88 0-1.3.14-.43.4-.8.76-1.04.36-.25.8-.37 1.24-.33.45.04.84.26 1.12.59.28.33.42.75.4 1.18 0 .42-.15.84-.42 1.15-.28.31-.66.49-1.08.51l-.12.01c-.04 0-.09-.01-.12-.02-.03-.01-.06-.03-.08-.06-.03-.02-.03-.04-.03-.04 0-.02.01-.03.04-.04l.1-.01c.43-.1.74-.44.74-.88 0-.43-.32-.77-.75-.77-.43 0-.77.34-.77.77 0 .22.09.44.24.59.15.15.36.24.58.24h.24z' fill='%234a6cf7' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
  file: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234a6cf7' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22.24H0v-1.41zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.48H0V3.07zm15.66 18.83l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm15.66 0l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm15.66 0l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm-15.66-15.66l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V6.24zm15.66 0l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V6.24zm15.66 0l2.83-2.83 1.41 1.41-2.83 2.83h-1.41V6.24zm-15.66 30.32l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm15.66 0l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41z'/%3E%3C/g%3E%3C/svg%3E\")"
};

// Default background pattern for all question types
const defaultPattern = "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234a6cf7' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H0V0h5z'/%3E%3C/g%3E%3C/svg%3E\")";

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
  const [showResults, setShowResults] = useState(false);

  // Start form response when component mounts
  useEffect(() => {
    if (!response && !isLoading) {
      startFormResponse(formId);
    }
  }, [formId, response, isLoading, startFormResponse]);

  // Reset answer when current question changes
  useEffect(() => {
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

  // Handle sharing results
  const handleShareResults = () => {
    // Create a shareable link (in a real app, this might be a unique URL to results)
    const shareUrl = `${window.location.origin}/form-results/${response.id}`;
    
    // Use Navigator Share API if available
    if (navigator.share) {
      navigator.share({
        title: `${form.title} - My Results`,
        text: `Check out my responses to ${form.title}!`,
        url: shareUrl
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert('Results link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  // Handle printing results
  const handlePrintResults = () => {
    window.print();
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

  // Get background pattern based on question type
  const getBackgroundPattern = (type) => {
    return backgroundPatterns[type] || defaultPattern;
  };
  
  // Get animation for current mood (for mood questions)
  const getMoodAnimation = () => {
    if (currentQuestion?.type !== 'radio' || !answer) return null;
    
    // Check if this is likely a mood question
    const isMoodQuestion = currentQuestion.title?.toLowerCase().includes('mood') || 
                          currentQuestion.title?.toLowerCase().includes('feel') ||
                          currentQuestion.options?.some(opt => 
                            opt.includes('😊') || opt.includes('😔') || 
                            opt.includes('happy') || opt.includes('sad'));
    
    if (!isMoodQuestion) return null;
    
    // Return mood animation based on answer
    const isPositive = answer.toLowerCase().includes('happy') || 
                      answer.toLowerCase().includes('good') ||
                      answer.includes('😊') ||
                      answer.includes('excellent');
                      
    const isNegative = answer.toLowerCase().includes('sad') || 
                      answer.toLowerCase().includes('bad') ||
                      answer.includes('😔') ||
                      answer.includes('poor');
    
    if (isPositive) {
      return (
        <motion.div 
          className="mood-animation positive"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 1 }}
        >
          <span role="img" aria-label="happy">😊</span>
        </motion.div>
      );
    } else if (isNegative) {
      return (
        <motion.div 
          className="mood-animation negative"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 1 }}
        >
          <span role="img" aria-label="sad">😔</span>
        </motion.div>
      );
    }
    
    return null;
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

  // Results page
  if (completed && showResults) {
    return (
      <motion.div
        className="results-page p-5"
        variants={completedVariants}
        initial="initial"
        animate="animate"
      >
        <div className="results-card">
          <div className="results-header">
            <motion.div 
              className="check-icon"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <FaCheck size={30} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Form Completed!
            </motion.h2>
            <motion.p 
              className="results-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Thank you for your responses
            </motion.p>
          </div>
          
          <div className="results-body">
            <motion.div 
              className="results-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <h4>Summary</h4>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-value">{Object.keys(answers).length}</span>
                  <span className="stat-label">Questions Answered</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Completion Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{new Date().toLocaleDateString()}</span>
                  <span className="stat-label">Date Submitted</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="results-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <Button variant="primary" onClick={handleShareResults} className="action-btn">
                <FaShareAlt className="icon" /> Share Results
              </Button>
              <Button variant="outline-primary" onClick={handlePrintResults} className="action-btn">
                <FaPrint className="icon" /> Print Results
              </Button>
              <Button variant="outline-secondary" onClick={() => window.location.reload()} className="action-btn">
                <FaDownload className="icon" /> Start New Response
              </Button>
            </motion.div>
          </div>
        </div>
        
        <style jsx>{`
          .results-page {
            background-color: #f8f9fa;
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .results-card {
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 700px;
            overflow: hidden;
          }
          
          .results-header {
            background: linear-gradient(135deg, #4a6cf7, #1e40af);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          
          .check-icon {
            background-color: white;
            color: #4a6cf7;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          .results-subtitle {
            margin-top: 10px;
            opacity: 0.9;
          }
          
          .results-body {
            padding: 30px;
          }
          
          .results-summary {
            margin-bottom: 30px;
          }
          
          .summary-stats {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
          
          .stat-item {
            text-align: center;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 10px;
            flex: 1;
            margin: 0 10px;
          }
          
          .stat-value {
            display: block;
            font-size: 1.5rem;
            font-weight: bold;
            color: #4a6cf7;
            margin-bottom: 5px;
          }
          
          .stat-label {
            color: #6c757d;
            font-size: 0.9rem;
          }
          
          .results-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
          }
          
          .action-btn {
            min-width: 180px;
          }
          
          .icon {
            margin-right: 8px;
          }

          @media (max-width: 768px) {
            .summary-stats {
              flex-direction: column;
            }
            
            .stat-item {
              margin: 10px 0;
            }
            
            .results-actions {
              flex-direction: column;
            }
            
            .action-btn {
              width: 100%;
            }
          }
        `}</style>
      </motion.div>
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
        <div className="d-flex justify-content-center gap-3">
          <Button variant="primary" onClick={() => setShowResults(true)}>
            View Results
          </Button>
          <Button variant="outline-primary" onClick={() => window.location.reload()}>
            Submit Another Response
          </Button>
        </div>
      </motion.div>
    );
  }

  // Render current question
  return (
    <div className="form-renderer">
      {form && (
        <div className="form-progress-container mb-4">
          <ProgressBar progress={progress} />
        </div>
      )}
      
      {form && currentQuestion && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            variants={questionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="question-container p-4"
            style={{ 
              backgroundImage: getBackgroundPattern(currentQuestion.type),
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center' 
            }}
          >
            {/* Mood animation overlay */}
            {getMoodAnimation()}
            
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
                      className="mb-3 radio-option"
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
                      className="mb-3 checkbox-option"
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
      
      <style jsx>{`
        .form-renderer {
          position: relative;
          margin-bottom: 20px;
        }
        
        .question-container {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .question-container:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .form-input {
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.25);
          border-color: #4a6cf7;
        }
        
        .radio-option, .checkbox-option {
          padding: 10px 15px;
          margin-bottom: 10px !important;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .radio-option:hover, .checkbox-option:hover {
          background-color: rgba(74, 108, 247, 0.05);
        }

        .submit-button {
          background: linear-gradient(135deg, #4a6cf7, #1e40af);
          border: none;
          border-radius: 30px;
          padding: 10px 25px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(30, 64, 175, 0.4);
        }
        
        .completed-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          box-shadow: 0 10px 15px rgba(16, 185, 129, 0.3);
        }
        
        .dropzone-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .dropzone-area:hover {
          border-color: #4a6cf7;
          background-color: rgba(74, 108, 247, 0.05);
        }
        
        .dropzone-area.is-invalid {
          border-color: #dc3545;
        }
        
        .form-progress-container {
          padding: 15px 5px;
        }
        
        .mood-animation {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 2.5rem;
          opacity: 0.9;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default FormRenderer;