// frontend/src/context/formResponseStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useFormResponseStore = create((set, get) => ({
  form: null,
  currentQuestion: null,
  response: null,
  answers: {},
  progress: 0,
  isLoading: false,
  isSubmitting: false,
  error: null,
  completed: false,
  
  // Reset state
  resetState: () => {
    set({
      form: null,
      currentQuestion: null,
      response: null,
      answers: {},
      progress: 0,
      isLoading: false,
      isSubmitting: false,
      error: null,
      completed: false
    });
  },
  
  // Start a form response session
  startFormResponse: async (formId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/responses/start/${formId}`);
      const { form, response: responseData } = response.data.data;
      
      set({
        form,
        response: responseData,
        currentQuestion: form.firstQuestion,
        progress: form.questionCount > 0 ? (1 / form.questionCount) * 100 : 0,
        isLoading: false
      });
      
      return { form, response: responseData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to start form';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Submit an answer
  submitAnswer: async (answer) => {
    const { response, currentQuestion, form, answers } = get();
    
    if (!response || !currentQuestion) {
      throw new Error('No active response session');
    }
    
    set({ isSubmitting: true, error: null });
    try {
      const payload = {
        questionId: currentQuestion.id,
        value: answer.value,
        fileUrl: answer.fileUrl
      };
      
      const result = await api.post(`/responses/${response.id}/answers`, payload);
      const { nextQuestion, isLastQuestion } = result.data.data;
      
      // Store the answer
      const updatedAnswers = {
        ...answers,
        [currentQuestion.id]: payload
      };
      
      // Calculate progress
      const questionCount = form.questionCount;
      const answeredCount = Object.keys(updatedAnswers).length;
      const progress = questionCount > 0 ? (answeredCount / questionCount) * 100 : 0;
      
      set({
        answers: updatedAnswers,
        currentQuestion: nextQuestion,
        progress,
        isSubmitting: false,
        completed: isLastQuestion
      });
      
      return { nextQuestion, isLastQuestion };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit answer';
      set({ error: errorMessage, isSubmitting: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get upload URL for file
  getUploadUrl: async (fileName, contentType) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/responses/upload-url', { fileName, contentType });
      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get upload URL';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Upload a file
  uploadFile: async (file) => {
    set({ isLoading: true, error: null });
    try {
      // Get a signed upload URL
      const { uploadUrl, fileUrl } = await get().getUploadUrl(file.name, file.type);
      
      // Upload the file directly to the signed URL
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });
      
      set({ isLoading: false });
      return fileUrl;
    } catch (error) {
      const errorMessage = error.message || 'Failed to upload file';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get a completed response
  getResponse: async (responseId, respondentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/responses/${responseId}?respondentId=${respondentId}`);
      set({ isLoading: false });
      return response.data.data.response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get response';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  }
}));