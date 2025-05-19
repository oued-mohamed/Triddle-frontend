// frontend/src/components/layout/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="app-footer mt-auto">
      <Container fluid>
        <Row>
          <Col className="text-center py-3">
            <p className="small text-muted mb-0">
              &copy; {new Date().getFullYear()} Triddle - Fragmented Form Builder
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;