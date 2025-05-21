// src/context/FormStore.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

// Create context for form management
const FormContext = createContext();

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
      console.log(`Fetching form with ID: ${formId}`);
      
      // Check if there's a draft in localStorage
      try {
        const savedDraft = localStorage.getItem(`formDraft_${formId}`);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          console.log("Using saved draft for form:", draft);
          // Use draft while we fetch from server
          setCurrentForm(draft);
          setQuestions(draft.questions || []);
        }
      } catch (err) {
        console.log("No valid draft found in localStorage");
      }
      
      const response = await api.get(`/forms/${formId}`);
      console.log("Form fetch response:", response);
      
      // Ensure proper data structure handling
      const form = response.data?.data?.form || response.data?.data || response.data || {};
      
      // Standardize the form data structure regardless of what the backend returns
      const standardizedForm = {
        ...form,
        // Ensure questions array exists
        questions: form.questions || 
                  (form.fields ? form.fields.map(f => ({
                    id: f.id || f._id,
                    title: f.label,
                    type: f.type,
                    description: f.helpText,
                    isRequired: f.required,
                    order: f.order,
                    options: f.options || []
                  })) : []),
        // Ensure fields array exists
        fields: form.fields || 
                (form.questions ? form.questions.map(q => ({
                  id: q.id || q._id,
                  type: q.type,
                  label: q.title || q.label,
                  helpText: q.description || q.helpText,
                  required: q.isRequired || q.required,
                  order: q.order,
                  options: q.options || []
                })) : [])
      };
      
      console.log("Standardized form data:", standardizedForm);
      
      // Use the draft fields if they exist to maintain UI state
      try {
        const savedDraft = localStorage.getItem(`formDraft_${formId}`);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          if (draft.fields && draft.fields.length > 0) {
            standardizedForm.fields = draft.fields;
          }
        }
      } catch (err) {
        console.log("Error applying draft fields:", err);
      }
      
      setCurrentForm(standardizedForm);
      setQuestions(standardizedForm.questions || []);
      
      return standardizedForm;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch form';
      setError(errorMessage);
      console.error(`Error fetching form with ID ${formId}:`, error);
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
      // Store the original fields for state persistence
      const originalFields = formData.fields || [];
      
      // Make a deep copy to avoid modifying the original object
      const dataToSubmit = { ...formData };
      
      // Ensure we have questions array
      if (!dataToSubmit.questions && dataToSubmit.fields) {
        // Map fields to questions if questions array is missing
        dataToSubmit.questions = dataToSubmit.fields.map(field => ({
          id: field.id,
          title: field.label,
          type: field.type,
          description: field.helpText,
          isRequired: field.required,
          order: field.order,
          options: field.options || [],
        }));
      }
      
      // Add standard fields for different backend implementations
      dataToSubmit.isPublished = dataToSubmit.isPublished || false;
      dataToSubmit.published = dataToSubmit.isPublished;
      dataToSubmit.status = dataToSubmit.isPublished ? 'published' : 'draft';
      
      console.log("Creating form with formatted data:", JSON.stringify(dataToSubmit, null, 2));
      
      const response = await api.post('/forms', dataToSubmit);
      console.log("Server response for create:", response);
      
      // Ensure proper data structure handling
      const newForm = response.data?.data?.form || response.data?.data || response.data || {};
      
      // Make sure the returned form has both fields and questions arrays
      const standardizedForm = {
        ...newForm,
        // Ensure questions array
        questions: newForm.questions || 
                  (newForm.fields ? newForm.fields.map(f => ({
                    id: f.id || f._id,
                    title: f.label,
                    type: f.type,
                    description: f.helpText,
                    isRequired: f.required,
                    order: f.order,
                    options: f.options || []
                  })) : []),
        // Ensure fields array - KEEP original fields
        fields: originalFields
      };
      
      console.log("Standardized new form:", standardizedForm);
      
      // Save a draft to localStorage
      if (standardizedForm.id || standardizedForm._id) {
        const id = standardizedForm.id || standardizedForm._id;
        localStorage.setItem(`formDraft_${id}`, JSON.stringify(standardizedForm));
      }
      
      setForms(prevForms => [standardizedForm, ...prevForms]);
      setCurrentForm(standardizedForm);
      setQuestions(standardizedForm.questions || []);
      
      return standardizedForm;
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
      // Store the original fields for state persistence
      const originalFields = formData.fields || [];
      
      // Make a deep copy to avoid modifying the original object
      const dataToSubmit = { ...formData };
      
      // Ensure we have questions array
      if (!dataToSubmit.questions && dataToSubmit.fields) {
        // Map fields to questions if questions array is missing
        dataToSubmit.questions = dataToSubmit.fields.map(field => ({
          id: field.id,
          title: field.label,
          type: field.type,
          description: field.helpText,
          isRequired: field.required,
          order: field.order,
          options: field.options || [],
        }));
      }
      
      // Add standard fields for different backend implementations
      if (dataToSubmit.isPublished !== undefined) {
        dataToSubmit.published = dataToSubmit.isPublished;
        dataToSubmit.status = dataToSubmit.isPublished ? 'published' : 'draft';
      }
      
      console.log("Updating form with formatted data:", JSON.stringify(dataToSubmit, null, 2));
      
      // Save a draft to localStorage before sending to server
      localStorage.setItem(`formDraft_${formId}`, JSON.stringify({
        ...dataToSubmit,
        fields: originalFields
      }));
      
      const response = await api.put(`/forms/${formId}`, dataToSubmit);
      console.log("Server response for update:", response);
      
      // Ensure proper data structure handling
      const updatedForm = response.data?.data?.form || response.data?.data || response.data || {};
      
      // Make sure the returned form has both fields and questions arrays
      const standardizedForm = {
        ...updatedForm,
        // Ensure questions array
        questions: updatedForm.questions || 
                  (updatedForm.fields ? updatedForm.fields.map(f => ({
                    id: f.id || f._id,
                    title: f.label,
                    type: f.type,
                    description: f.helpText,
                    isRequired: f.required,
                    order: f.order,
                    options: f.options || []
                  })) : []),
        // Ensure fields array - IMPORTANT: Keep the original fields to maintain UI state
        fields: originalFields
      };
      
      console.log("Standardized updated form:", standardizedForm);
      
      setForms(prevForms => 
        prevForms.map(form => (form.id === formId || form._id === formId) ? standardizedForm : form)
      );
      
      setCurrentForm(standardizedForm);
      setQuestions(standardizedForm.questions || []);
      
      return standardizedForm;
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
      
      // Remove any localStorage draft
      localStorage.removeItem(`formDraft_${formId}`);
      
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
        const updatedCurrentForm = { ...currentForm, isPublished: true };
        setCurrentForm(updatedCurrentForm);
        
        // Update localStorage draft
        localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedCurrentForm));
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
      
      // Update draft in localStorage
      try {
        const savedDraft = localStorage.getItem(`formDraft_${formId}`);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          const updatedDraft = {
            ...draft,
            questions: [...(draft.questions || []), newQuestion],
            fields: [...(draft.fields || []), {
              id: newQuestion.id || newQuestion._id,
              type: newQuestion.type,
              label: newQuestion.title || newQuestion.label,
              helpText: newQuestion.description || newQuestion.helpText,
              required: newQuestion.isRequired || newQuestion.required,
              order: newQuestion.order,
              options: newQuestion.options || []
            }]
          };
          localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedDraft));
        }
      } catch (err) {
        console.log("Error updating draft with new question:", err);
      }
      
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
      
      // Update draft in localStorage
      try {
        const savedDraft = localStorage.getItem(`formDraft_${formId}`);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          const updatedDraft = {
            ...draft,
            questions: (draft.questions || []).map(q => 
              q.id === questionId ? updatedQuestion : q
            ),
            fields: (draft.fields || []).map(f => 
              f.id === questionId ? {
                id: updatedQuestion.id || updatedQuestion._id,
                type: updatedQuestion.type,
                label: updatedQuestion.title || updatedQuestion.label,
                helpText: updatedQuestion.description || updatedQuestion.helpText,
                required: updatedQuestion.isRequired || updatedQuestion.required,
                order: updatedQuestion.order,
                options: updatedQuestion.options || []
              } : f
            )
          };
          localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedDraft));
        }
      } catch (err) {
        console.log("Error updating draft with updated question:", err);
      }
      
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
      
      // Update draft in localStorage
      try {
        const savedDraft = localStorage.getItem(`formDraft_${formId}`);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          const updatedDraft = {
            ...draft,
            questions: (draft.questions || []).filter(q => q.id !== questionId),
            fields: (draft.fields || []).filter(f => f.id !== questionId)
          };
          localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedDraft));
        }
      } catch (err) {
        console.log("Error updating draft after question deletion:", err);
      }
      
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
      
      // Update draft in localStorage
      try {
        const savedDraft = localStorage.getItem(`formDraft_${formId}`);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          const updatedQuestions = questionOrder.map(item => {
            const question = draft.questions.find(q => q.id === item.id) || {};
            return { ...question, order: item.order };
          }).sort((a, b) => a.order - b.order);
          
          const updatedFields = questionOrder.map(item => {
            const field = draft.fields.find(f => f.id === item.id) || {};
            return { ...field, order: item.order };
          }).sort((a, b) => a.order - b.order);
          
          const updatedDraft = {
            ...draft,
            questions: updatedQuestions,
            fields: updatedFields
          };
          
          localStorage.setItem(`formDraft_${formId}`, JSON.stringify(updatedDraft));
        }
      } catch (err) {
        console.log("Error updating draft after reordering questions:", err);
      }
      
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
      publishForm,
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