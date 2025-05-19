// src/pages/Forms.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter, FaEllipsisV, FaEdit, FaTrash, FaEye, FaUpload, FaSyncAlt, FaTools } from 'react-icons/fa';
import { useFormStore } from '../context/FormStore.jsx';
import api from '../services/api';

const Forms = () => {
  const { forms, fetchForms, deleteForm, publishForm, isLoading } = useFormStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState(null);
  const [publishingForms, setPublishingForms] = useState({}); // Track publishing status by form ID

  useEffect(() => {
    const loadForms = async () => {
      try {
        await fetchForms();
        console.log("Forms loaded successfully");
      } catch (err) {
        console.error('Error loading forms:', err);
        setError('Failed to load forms. Please try again later.');
      }
    };

    loadForms();
  }, [fetchForms]);

  // Make sure we're working with an array
  const safeFormsList = Array.isArray(forms) ? forms : [];

  // Filter the forms based on search term and status
  const filteredForms = safeFormsList.filter(form => {
    const matchesSearch = (form.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && form.isPublished) || 
                         (filterStatus === 'draft' && !form.isPublished);
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (isPublished) => {
    return isPublished ? 
      <Badge bg="success">Published</Badge> : 
      <Badge bg="secondary">Draft</Badge>;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteForm(id);
      } catch (error) {
        console.error('Error deleting form:', error);
        setError('Failed to delete form. Please try again.');
      }
    }
  };

  // Handle form publishing
  const handlePublishForm = async (formId) => {
    try {
      // Set publishing state for this form
      setPublishingForms(prev => ({ ...prev, [formId]: true }));
      console.log("Publishing form:", formId);
      
      // Clear any previous errors
      setError(null);
      
      try {
        // Try using the store's publishForm method first
        if (publishForm) {
          await publishForm(formId);
          console.log("Form published successfully using store method");
        } else {
          // Fallback to direct API methods if the store method isn't available
          await tryPublishFormViaAPI(formId);
        }
      } catch (publishError) {
        console.error("Error using store publishForm:", publishError);
        // Try direct API methods as a fallback
        await tryPublishFormViaAPI(formId);
      }
      
      // Refresh the forms list
      await fetchForms();
      
      // Clear publishing state for this form
      setPublishingForms(prev => ({ ...prev, [formId]: false }));
      return true;
    } catch (error) {
      console.error("Error publishing form:", error);
      setError("Failed to publish form. Please try again.");
      // Clear publishing state for this form
      setPublishingForms(prev => ({ ...prev, [formId]: false }));
      return false;
    }
  };
  
  // Try multiple API approaches to publish a form
  const tryPublishFormViaAPI = async (formId) => {
    console.log("Trying direct API publish methods for form:", formId);
    
    try {
      // Approach 1: Use a dedicated publish endpoint if it exists
      const response = await api.put(`/forms/${formId}/publish`, {
        isPublished: true,
        published: true,
        status: 'published'
      });
      
      console.log("Form published successfully via dedicated endpoint:", response);
      return true;
    } catch (err) {
      console.log("Dedicated publish endpoint failed:", err);
      
      // Approach 2: Try updating the form with isPublished flag
      try {
        const response = await api.put(`/forms/${formId}`, {
          isPublished: true,
          published: true,
          status: 'published'
        });
        
        console.log("Form published successfully via update endpoint:", response);
        return true;
      } catch (updateErr) {
        console.error("All publish methods failed:", updateErr);
        throw new Error("Failed to publish form after multiple attempts");
      }
    }
  };

  // Manual refresh function
  const refreshForms = async () => {
    try {
      setError(null);
      await fetchForms();
    } catch (err) {
      console.error('Error refreshing forms:', err);
      setError('Failed to refresh forms. Please try again.');
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <h1 className="mb-0 me-3">Forms</h1>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={refreshForms} 
            disabled={isLoading}
            title="Refresh forms list"
          >
            <FaSyncAlt /> Refresh
          </Button>
        </div>
        <div className="d-flex gap-2">
          <Link to="/forms/builder/new">
            <Button variant="outline-primary" className="d-flex align-items-center">
              <FaTools className="me-2" /> Advanced Builder
            </Button>
          </Link>
          <Link to="/forms/builder/new">
            <Button variant="primary" className="d-flex align-items-center">
              <FaPlus className="me-2" /> Create New Form
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" className="w-100">
                Sort <i className="ms-1 fas fa-sort"></i>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading forms...</p>
        </div>
      ) : filteredForms.length > 0 ? (
        <Row className="g-4">
          {filteredForms.map((form, index) => (
            <Col lg={4} md={6} key={form.id || form._id || index}>
              <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    {getStatusBadge(form.isPublished)}
                    <div className="dropdown">
                      <Button 
                        variant="link" 
                        className="p-0 text-muted dropdown-toggle"
                        id={`dropdown-${form.id || form._id || index}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FaEllipsisV />
                      </Button>
                      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-${form.id || form._id || index}`}>
                        {/* UPDATED: Changed edit form link to point to the form builder */}
                        <li>
                          <Link to={`/forms/builder/${form.id || form._id}`} className="dropdown-item">
                            <FaEdit className="me-2" /> Edit Form
                          </Link>
                        </li>
                        {/* This option is now redundant with the one above, but keeping it to match your original UI */}
                        <li>
                          <Link to={`/forms/builder/${form.id || form._id}`} className="dropdown-item">
                            <FaTools className="me-2" /> Open in Advanced Builder
                          </Link>
                        </li>
                        <li>
                          <Link to={`/forms/${form.id || form._id}/view`} className="dropdown-item">
                            <FaEye className="me-2" /> View Form
                          </Link>
                        </li>
                        {!form.isPublished && (
                          <li>
                            <button 
                              className="dropdown-item text-success" 
                              onClick={() => handlePublishForm(form.id || form._id)}
                            >
                              <FaUpload className="me-2" /> Publish Form
                            </button>
                          </li>
                        )}
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button 
                            className="dropdown-item text-danger" 
                            onClick={() => handleDelete(form.id || form._id)}
                          >
                            <FaTrash className="me-2" /> Delete Form
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <h5 className="card-title">{form.title || 'Untitled Form'}</h5>
                  <p className="text-muted small mb-3">
                    {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="card-text text-truncate mb-3">{form.description || 'No description provided'}</p>
                  <div className="d-flex mt-3">
                    {/* Add Publish button for draft forms */}
                    {!form.isPublished && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handlePublishForm(form.id || form._id)}
                        disabled={publishingForms[form.id || form._id]}
                        className="me-2"
                      >
                        {publishingForms[form.id || form._id] ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-1" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <FaUpload className="me-1" /> Publish
                          </>
                        )}
                      </Button>
                    )}
                    
                    {/* UPDATED: Changed Edit button to link to form builder */}
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      as={Link}
                      to={`/forms/builder/${form.id || form._id}`}
                      className="me-2"
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    
                    {/* Fix View/Fill button */}
                    {form.isPublished ? (
                      <Button
                        variant="outline-info"
                        size="sm"
                        as={Link}
                        to={`/forms/${form.id || form._id}/fill`}
                        className="me-2"
                      >
                        <FaEye className="me-1" /> Fill
                      </Button>
                    ) : (
                      <Button
                        variant="outline-info"
                        size="sm"
                        as={Link}
                        to={`/forms/${form.id || form._id}/view`}
                        className="me-2"
                      >
                        <FaEye className="me-1" /> View
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(form.id || form._id)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 my-4">
          <div className="mb-4">
            <i className="far fa-folder-open fa-4x text-muted"></i>
          </div>
          <h3>No forms found</h3>
          <p className="text-muted">
            {searchTerm || filterStatus !== 'all' 
              ? "Try adjusting your search or filters"
              : "Create your first form to get started"}
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Link to="/forms/builder/new">
              <Button variant="outline-primary">
                <FaTools className="me-2" /> Advanced Builder
              </Button>
            </Link>
            <Link to="/forms/builder/new">
              <Button variant="primary">
                <FaPlus className="me-2" /> Create New Form
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Forms;