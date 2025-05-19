// src/context/FormStore.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

// Create context for form management
const FormContext = createContext();
//test
/**
 * FormProvider component
 * Provides form-related state and methods to all child components
 */
export const FormProvider = ({ children }) => {
  // State variables
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset the store state
  const resetState = useCallback(() => {
    setCurrentForm(null);
    setQuestions([]);
    setError(null);
  }, []);

  // Fetch all forms
  const fetchForms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/forms');
      
      // Ensure proper data structure handling
      const formsData = response.data?.data?.forms || response.data || [];
      console.log("Fetched forms:", formsData);
      setForms(formsData);
      return formsData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch forms';
      setError(errorMessage);
      console.error('Error fetching forms:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch a form by ID
  const fetchFormById = useCallback(async (formId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/forms/${formId}`);
      
      // Ensure proper data structure handling
      const form = response.data?.data?.form || response.data || {};
      setCurrentForm(form);
      setQuestions(form.questions || []);
      return form;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch form';
      setError(errorMessage);
      console.error(`Error fetching form with ID ${formId}:`, errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new form
  const createForm = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure isPublished is included in all possible formats
      const enhancedFormData = {
        ...formData,
        published: formData.isPublished, // Try alternative field name
        status: formData.isPublished ? 'published' : 'draft', // Try status field
      };
      
      console.log("Creating form with data:", JSON.stringify(enhancedFormData, null, 2));
      
      const response = await api.post('/forms', enhancedFormData);
      console.log("Create form response:", response);
      
      // Ensure proper data structure handling
      const newForm = response.data?.data?.form || response.data?.data || response.data || {};
      
      console.log("New form created:", newForm);
      setForms(prevForms => [newForm, ...prevForms]);
      setCurrentForm(newForm);
      setQuestions([]);
      return newForm;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create form';
      setError(errorMessage);
      console.error('Error creating form:', error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a form
  const updateForm = useCallback(async (formId, formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure isPublished is included in all possible formats
      const enhancedFormData = {
        ...formData,
        published: formData.isPublished, // Try alternative field name
        status: formData.isPublished ? 'published' : 'draft', // Try status field
      };
      
      console.log("Updating form with data:", JSON.stringify(enhancedFormData, null, 2));
      
      const response = await api.put(`/forms/${formId}`, enhancedFormData);
      
      // Ensure proper data structure handling
      const updatedForm = response.data?.data?.form || response.data?.data || response.data || {};
      
      setForms(prevForms => 
        prevForms.map(form => (form.id === formId || form._id === formId) ? updatedForm : form)
      );
      setCurrentForm(updatedForm);
      return updatedForm;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update form';
      setError(errorMessage);
      console.error(`Error updating form with ID ${formId}:`, error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a form
  const deleteForm = useCallback(async (formId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.delete(`/forms/${formId}`);
      
      setForms(prevForms => prevForms.filter(form => form.id !== formId && form._id !== formId));
      if (currentForm?.id === formId || currentForm?._id === formId) {
        setCurrentForm(null);
      }
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete form';
      setError(errorMessage);
      console.error(`Error deleting form with ID ${formId}:`, error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentForm]);

  // Publish a form
  const publishForm = useCallback(async (formId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting to publish form:", formId);
      
      // Try multiple approaches to publish the form
      let published = false;
      let updatedForm = null;
      
      try {
        // Approach 1: Use a dedicated publish endpoint if it exists
        const response = await api.put(`/forms/${formId}/publish`, {
          isPublished: true,
          published: true,
          status: 'published'
        });
        console.log("Publish response (approach 1):", response);
        published = true;
        updatedForm = response.data?.data?.form || response.data?.data || response.data;
      } catch (err) {
        console.log("First publish approach failed:", err);
        
        // Approach 2: Try updating the form with isPublished flag
        const response = await api.put(`/forms/${formId}`, {
          isPublished: true,
          published: true,
          status: 'published'
        });
        console.log("Publish response (approach 2):", response);
        published = true;
        updatedForm = response.data?.data?.form || response.data?.data || response.data;
      }
      
      if (!published) {
        throw new Error("Failed to publish form after multiple attempts");
      }
      
      // Update forms list
      setForms(prevForms => 
        prevForms.map(form => (form.id === formId || form._id === formId) 
          ? { ...form, isPublished: true } 
          : form
        )
      );
      
      // Update current form if it's the one being published
      if (currentForm && (currentForm.id === formId || currentForm._id === formId)) {
        setCurrentForm({ ...currentForm, isPublished: true });
      }
      
      // Refresh forms to ensure we have the latest data
      await fetchForms();
      
      return updatedForm || { id: formId, isPublished: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to publish form';
      setError(errorMessage);
      console.error(`Error publishing form with ID ${formId}:`, error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentForm, fetchForms]);

  // Add a question to a form
  const addQuestion = useCallback(async (formId, questionData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/forms/${formId}/questions`, questionData);
      
      // Ensure proper data structure handling
      const newQuestion = response.data?.data?.question || response.data || {};
      
      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
      return newQuestion;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add question';
      setError(errorMessage);
      console.error('Error adding question:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a question
  const updateQuestion = useCallback(async (formId, questionId, questionData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/forms/${formId}/questions/${questionId}`, questionData);
      
      // Ensure proper data structure handling
      const updatedQuestion = response.data?.data?.question || response.data || {};
      
      setQuestions(prevQuestions => 
        prevQuestions.map(question => question.id === questionId ? updatedQuestion : question)
      );
      return updatedQuestion;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update question';
      setError(errorMessage);
      console.error(`Error updating question with ID ${questionId}:`, errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a question
  const deleteQuestion = useCallback(async (formId, questionId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.delete(`/forms/${formId}/questions/${questionId}`);
      
      setQuestions(prevQuestions => 
        prevQuestions.filter(question => question.id !== questionId)
      );
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete question';
      setError(errorMessage);
      console.error(`Error deleting question with ID ${questionId}:`, errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reorder questions
  const reorderQuestions = useCallback(async (formId, questionOrder) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.put(`/forms/${formId}/questions/reorder`, {
        questions: questionOrder
      });
      
      // Update local state with new order
      const reorderedQuestions = questionOrder.map(item => {
        const question = questions.find(q => q.id === item.id);
        return { ...question, order: item.order };
      });
      
      setQuestions(reorderedQuestions.sort((a, b) => a.order - b.order));
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reorder questions';
      setError(errorMessage);
      console.error('Error reordering questions:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [questions]);

  // Get form analytics
  const fetchFormAnalytics = useCallback(async (formId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/forms/${formId}/analytics`);
      return response.data?.data || response.data || {};
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch analytics';
      setError(errorMessage);
      console.error(`Error fetching analytics for form ID ${formId}:`, errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get form responses
  const fetchFormResponses = useCallback(async (formId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/forms/${formId}/responses`);
      return response.data?.data?.responses || response.data || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch responses';
      setError(errorMessage);
      console.error(`Error fetching responses for form ID ${formId}:`, errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Provide all form-related functions and state to children
  return (
    <FormContext.Provider value={{
      // State
      forms,
      currentForm,
      questions,
      isLoading,
      error,
      
      // Methods
      resetState,
      fetchForms,
      fetchFormById,
      createForm,
      updateForm,
      deleteForm,
      publishForm, // Add the new publishForm method
      addQuestion,
      updateQuestion,
      deleteQuestion,
      reorderQuestions,
      fetchFormAnalytics,
      fetchFormResponses
    }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useFormStore = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormStore must be used within a FormProvider');
  }
  return context;
};