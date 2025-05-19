// src/context/formResponseStore.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

// Create context for form response management
const FormResponseContext = createContext();

/**
 * FormResponseProvider component
 * Provides form response-related state and methods to all child components
 */
export const FormResponseProvider = ({ children }) => {
  // State variables
  const [form, setForm] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [response, setResponse] = useState(null);
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  
  // Reset state
  const resetState = useCallback(() => {
    setForm(null);
    setCurrentQuestion(null);
    setResponse(null);
    setAnswers({});
    setProgress(0);
    setIsLoading(false);
    setIsSubmitting(false);
    setError(null);
    setCompleted(false);
  }, []);
  
  // Start a form response session
  const startFormResponse = useCallback(async (formId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Track form visit (for analytics)
      await api.post(`/forms/${formId}/visit`);
      
      // Start response session
      const response = await api.post(`/responses/start/${formId}`);
      
      // Ensure proper data structure handling
      const responseData = response.data?.data?.response || response.data?.response || {};
      const formData = response.data?.data?.form || response.data?.form || {};
      
      setForm(formData);
      setResponse(responseData);
      setCurrentQuestion(formData.firstQuestion);
      
      // Calculate initial progress
      const questionCount = formData.questionCount || 0;
      const initialProgress = questionCount > 0 ? (1 / questionCount) * 100 : 0;
      setProgress(initialProgress);
      
      return { form: formData, response: responseData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to start form';
      setError(errorMessage);
      console.error(`Error starting form ${formId}:`, errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Submit an answer
  const submitAnswer = useCallback(async (answer) => {
    if (!response || !currentQuestion) {
      throw new Error('No active response session');
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const payload = {
        questionId: currentQuestion.id,
        value: answer.value,
        fileUrl: answer.fileUrl
      };
      
      const result = await api.post(`/responses/${response.id}/answers`, payload);
      
      // Ensure proper data structure handling
      const resultData = result.data?.data || result.data || {};
      const nextQuestion = resultData.nextQuestion;
      const isLastQuestion = resultData.isLastQuestion || false;
      
      // Store the answer
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestion.id]: payload
      }));
      
      // Set next question
      setCurrentQuestion(nextQuestion);
      
      // Calculate progress
      const questionCount = form.questionCount || 1;
      const answeredCount = Object.keys(answers).length + 1; // +1 for current answer
      const newProgress = (answeredCount / questionCount) * 100;
      setProgress(newProgress);
      
      // Check if completed
      if (isLastQuestion) {
        setCompleted(true);
      }
      
      return { nextQuestion, isLastQuestion };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit answer';
      setError(errorMessage);
      console.error('Error submitting answer:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [response, currentQuestion, form, answers]);
  
  // Get upload URL for file
  const getUploadUrl = useCallback(async (fileName, contentType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/responses/upload-url', { fileName, contentType });
      
      // Ensure proper data structure handling
      return response.data?.data || response.data || {};
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get upload URL';
      setError(errorMessage);
      console.error('Error getting upload URL:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Upload a file
  const uploadFile = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get a signed upload URL
      const { uploadUrl, fileUrl } = await getUploadUrl(file.name, file.type);
      
      // Upload the file directly to the signed URL
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });
      
      return fileUrl;
    } catch (error) {
      const errorMessage = error.message || 'Failed to upload file';
      setError(errorMessage);
      console.error('Error uploading file:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getUploadUrl]);
  
  // Get a completed response
  const getResponse = useCallback(async (responseId, respondentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/responses/${responseId}?respondentId=${respondentId}`);
      
      // Ensure proper data structure handling
      return response.data?.data?.response || response.data || {};
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get response';
      setError(errorMessage);
      console.error(`Error getting response ${responseId}:`, errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Provide all form response-related functions and state to children
  return (
    <FormResponseContext.Provider value={{
      // State
      form,
      currentQuestion,
      response,
      answers,
      progress,
      isLoading,
      isSubmitting,
      error,
      completed,
      
      // Methods
      resetState,
      startFormResponse,
      submitAnswer,
      getUploadUrl,
      uploadFile,
      getResponse
    }}>
      {children}
    </FormResponseContext.Provider>
  );
};

// Custom hook to use the form response context
export const useFormResponseStore = () => {
  const context = useContext(FormResponseContext);
  if (!context) {
    throw new Error('useFormResponseStore must be used within a FormResponseProvider');
  }
  return context;
};
