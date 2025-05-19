// frontend/src/components/layout/FormFillLayout.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ProgressBar from '../common/ProgressBar';
import { useFormResponseStore } from '../../context/formResponseStore';

const FormFillLayout = ({ children }) => {
  const { form, progress } = useFormResponseStore();

  return (
    <div className="form-fill-layout">
      {/* Form header with logo and progress */}
      <header className="form-fill-header">
        <Container>
          <div className="d-flex justify-content-between align-items-center py-3">
            <div className="logo">
              <h2>Triddle</h2>
            </div>
            {form && (
              <div className="progress-container">
                <ProgressBar progress={progress} />
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Main content area with animation */}
      <main className="form-fill-content">
        <Container className="py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="form-fill-card"
          >
            {children}
          </motion.div>
        </Container>
      </main>

      {/* Simple footer */}
      <footer className="form-fill-footer">
        <Container>
          <div className="py-3 text-center">
            <p className="small text-muted">
              Powered by <a href="/" className="text-decoration-none">Triddle</a>
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default FormFillLayout;