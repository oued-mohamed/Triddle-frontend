// src/components/form/FormActions.jsx
import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrash, FaCheckCircle, FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../context/FormStore';
import { toast } from 'react-toastify'; // If you're using react-toastify

const FormActions = ({ form, onFormUpdated, size = "sm", isInline = true }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const navigate = useNavigate();
  const { publishForm, deleteForm } = useFormStore();
  
  // Direct users to the form builder for editing
  const handleEdit = () => {
    navigate(`/forms/builder/${form.id}`);
  };
  
  const handleFill = () => {
    navigate(`/forms/${form.id}/fill`);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteForm(form.id);
        if (onFormUpdated) onFormUpdated();
        toast ? toast.success('Form deleted successfully') : alert('Form deleted successfully');
      } catch (error) {
        console.error('Error deleting form:', error);
        toast ? toast.error(error.message || 'Failed to delete form') : alert(error.message || 'Failed to delete form');
      }
    }
  };
  
  const handlePublish = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    try {
      console.log(`Publishing form ${form.id}...`);
      
      await publishForm(form.id);
      
      if (onFormUpdated) onFormUpdated();
      toast ? toast.success('Form published successfully!') : alert('Form published successfully!');
    } catch (error) {
      console.error('Error publishing form:', error);
      toast ? toast.error(error.message || 'Failed to publish form. Please try again.') : alert(error.message || 'Failed to publish form. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handleCopyLink = () => {
    setIsCopying(true);
    try {
      const formUrl = `${window.location.origin}/forms/${form.id}/fill`;
      navigator.clipboard.writeText(formUrl);
      toast ? toast.success('Form link copied to clipboard!') : alert('Form link copied to clipboard!');
    } catch (error) {
      console.error('Error copying link:', error);
      toast ? toast.error('Failed to copy link') : alert('Failed to copy link');
    } finally {
      setIsCopying(false);
    }
  };
  
  const containerClass = isInline ? "d-flex gap-2" : "d-grid gap-2";
  
  return (
    <div className={containerClass}>
      <Button variant="outline-primary" size={size} onClick={handleEdit}>
        <FaEdit className="me-1" /> Edit
      </Button>
      
      {form.isPublished && (
        <Button variant="outline-info" size={size} onClick={handleFill}>
          <FaEye className="me-1" /> Fill
        </Button>
      )}
      
      {!form.isPublished && (
        <Button 
          variant="outline-success" 
          size={size} 
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" />
              Publishing...
            </>
          ) : (
            <>
              <FaCheckCircle className="me-1" /> Publish
            </>
          )}
        </Button>
      )}
      
      {form.isPublished && (
        <Button 
          variant="outline-secondary" 
          size={size} 
          onClick={handleCopyLink}
          disabled={isCopying}
        >
          <FaCopy className="me-1" /> Copy Link
        </Button>
      )}
      
      <Button variant="outline-danger" size={size} onClick={handleDelete}>
        <FaTrash className="me-1" /> Delete
      </Button>
    </div>
  );
};

export default FormActions;